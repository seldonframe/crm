// In-memory RuntimeStorage for tests.
//
// Same interface as DrizzleRuntimeStorage; unit + integration tests
// run against this without touching Postgres. Keeps the test:unit
// pipeline DB-free while still exercising the full state-machine
// code paths.
//
// Not exported from the src tree on purpose — this is test-only.

import type {
  EventLogInput,
  NewRunInput,
  NewWaitInput,
  RuntimeStorage,
  StepResultInput,
  StoredRun,
  StoredStepResult,
  StoredWait,
} from "../../../src/lib/workflow/types";
import { buildClock, resolveCustomerFromTriggerPayload } from "../../../src/lib/workflow/build-run-context";
import type { RunContext, RunContextWorkspace } from "../../../src/lib/workflow/run-context";
import type { OrgSoul } from "../../../src/lib/soul/types";

export type StoredEventLog = {
  id: string;
  orgId: string;
  eventType: string;
  payload: Record<string, unknown>;
  emittedAt: Date;
};

let uuidCounter = 0;
function nextId(prefix: string): string {
  uuidCounter += 1;
  return `${prefix}_${String(uuidCounter).padStart(8, "0")}`;
}

export class InMemoryRuntimeStorage implements RuntimeStorage {
  readonly runs = new Map<string, StoredRun>();
  readonly waits = new Map<string, StoredWait>();
  readonly eventLog: StoredEventLog[] = [];
  readonly stepResults: StoredStepResult[] = [];

  async createRun(input: NewRunInput): Promise<string> {
    const id = nextId("run");
    const now = new Date();
    this.runs.set(id, {
      id,
      orgId: input.orgId,
      archetypeId: input.archetypeId,
      specSnapshot: input.specSnapshot,
      triggerEventId: input.triggerEventId,
      triggerPayload: input.triggerPayload,
      status: "running",
      currentStepId: input.currentStepId,
      captureScope: {},
      variableScope: input.variableScope,
      context: input.context ?? null,
      failureCount: {},
      createdAt: now,
      updatedAt: now,
    });
    return id;
  }

  async getRun(runId: string): Promise<StoredRun | null> {
    const row = this.runs.get(runId);
    if (!row) return null;
    // Return a clone so callers mutating the returned row don't
    // corrupt the in-memory store.
    return JSON.parse(JSON.stringify({ ...row, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString() }), (key, value) => {
      if (key === "createdAt" || key === "updatedAt") return new Date(value as string);
      return value;
    });
  }

  async updateRun(
    runId: string,
    patch: Partial<Pick<StoredRun, "status" | "currentStepId" | "captureScope" | "failureCount">>,
  ): Promise<void> {
    const row = this.runs.get(runId);
    if (!row) throw new Error(`updateRun: run ${runId} not found`);
    const next: StoredRun = { ...row, updatedAt: new Date() };
    if (patch.status !== undefined) next.status = patch.status;
    if (patch.currentStepId !== undefined) next.currentStepId = patch.currentStepId;
    if (patch.captureScope !== undefined) next.captureScope = patch.captureScope;
    if (patch.failureCount !== undefined) next.failureCount = patch.failureCount;
    this.runs.set(runId, next);
  }

  async createWait(input: NewWaitInput): Promise<string> {
    const id = nextId("wait");
    const now = new Date();
    this.waits.set(id, {
      id,
      runId: input.runId,
      stepId: input.stepId,
      eventType: input.eventType,
      matchPredicate: input.matchPredicate,
      timeoutAt: input.timeoutAt,
      resumedAt: null,
      resumedBy: null,
      resumedReason: null,
      createdAt: now,
    });
    return id;
  }

  async findUnresolvedWaitsForEvent(orgId: string, eventType: string): Promise<StoredWait[]> {
    const out: StoredWait[] = [];
    for (const w of this.waits.values()) {
      if (w.eventType !== eventType || w.resumedAt !== null) continue;
      const run = this.runs.get(w.runId);
      if (run?.orgId === orgId) out.push({ ...w });
    }
    return out;
  }

  async findDueWaits(now: Date, limit: number): Promise<StoredWait[]> {
    const out: StoredWait[] = [];
    for (const w of this.waits.values()) {
      if (w.resumedAt !== null) continue;
      if (w.timeoutAt.getTime() <= now.getTime()) out.push({ ...w });
      if (out.length >= limit) break;
    }
    return out;
  }

  async claimWait(
    waitId: string,
    reason: "event_match" | "timeout" | "manual" | "cancelled",
    resumedBy: string | null,
  ): Promise<boolean> {
    const row = this.waits.get(waitId);
    if (!row || row.resumedAt !== null) return false;
    this.waits.set(waitId, {
      ...row,
      resumedAt: new Date(),
      resumedReason: reason,
      resumedBy,
    });
    return true;
  }

  async appendEventLog(input: EventLogInput): Promise<string> {
    const id = nextId("evt");
    this.eventLog.push({
      id,
      orgId: input.orgId,
      eventType: input.eventType,
      payload: input.payload,
      emittedAt: new Date(),
    });
    return id;
  }

  async appendStepResult(input: StepResultInput): Promise<string> {
    const id = nextId("sr");
    this.stepResults.push({
      id,
      runId: input.runId,
      stepId: input.stepId,
      stepType: input.stepType,
      outcome: input.outcome,
      captureValue: input.captureValue,
      errorMessage: input.errorMessage,
      durationMs: input.durationMs,
      createdAt: new Date(),
    });
    return id;
  }

  async listStepResults(runId: string): Promise<StoredStepResult[]> {
    return this.stepResults
      .filter((r) => r.runId === runId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((r) => ({ ...r }));
  }
}

// ---------------------------------------------------------------------
// testLoadRunContext — synthetic, DB-free RunContext loader.
//
// 2026-08-07 — advanceRun's context-load guard (runtime.ts) fails the
// run closed when loadRunContext throws, rather than degrading to a
// placeholder identity and proceeding (that degrade-and-proceed
// approach shipped real SMS with an empty business name and was
// rejected in review). Every hermetic workflow spec that drives
// advanceRun/startRun through InMemoryRuntimeStorage needs SOMETHING
// to satisfy the context load, since there is no real Postgres in
// this test process. Wire this in via RuntimeContext.loadRunContext
// (the DI seam types.ts adds) instead of relying on production
// tolerating a missing workspace.
//
// Fields are populated with realistic non-empty test values (not
// empty strings) — specs exercising conversation/tool-invoker
// dispatch that read workspace.name / workspace.timezone need a
// realistic identity to reach their own assertions.
// ---------------------------------------------------------------------

export async function testLoadRunContext(run: {
  id: string;
  orgId: string;
  archetypeId: string;
  triggerPayload: Record<string, unknown>;
  triggerEventId: string | null;
  context: Record<string, unknown> | null;
}): Promise<RunContext> {
  if (run.context) return run.context as unknown as RunContext;
  const clock = buildClock(new Date(), "UTC");
  const customer = resolveCustomerFromTriggerPayload(run.triggerPayload);
  const workspace: RunContextWorkspace = {
    id: run.orgId,
    name: "Test Workspace",
    slug: "test-workspace",
    timezone: "UTC",
    soul: {} as OrgSoul,
    theme: {},
  };
  return {
    runId: run.id,
    orgId: run.orgId,
    archetypeId: run.archetypeId,
    startedAt: clock.nowIso,
    customer,
    workspace,
    agency: null,
    clock,
    source: { type: "manual", triggerEventId: run.triggerEventId },
  };
}
