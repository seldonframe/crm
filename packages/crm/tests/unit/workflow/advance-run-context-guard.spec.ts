// Regression tests for the advanceRun context-load guard (2026-08-07).
//
// runtime.ts's advanceRun() calls loadRunContext()/buildRunContext(),
// which issues a live DB query. Before this fix that call was
// unguarded: any failure (no DB connection, a transient blip, a
// deleted/missing workspace row) escaped uncaught, which
//   (a) stranded the run in status="running" forever with zero
//       failure record — a dead run reporting as running, and
//   (b) made this exact scenario reachable by ANY hermetic unit test
//       using InMemoryRuntimeStorage + a synthetic org id, since no
//       DB exists in that test process at all — identical to the
//       production "workspace row missing" case, not a "no Postgres
//       in CI" artifact.
//
// These tests exercise the guard directly, without mocking the `db`
// import: InMemoryRuntimeStorage + a synthetic org id naturally makes
// buildRunContext throw (no DB configured in this test process), the
// same as production hitting a deleted org row.

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import type { AgentSpec } from "../../../src/lib/agents/validator";
import { advanceRun, startRun } from "../../../src/lib/workflow/runtime";
import type { RuntimeContext } from "../../../src/lib/workflow/types";
import { InMemoryRuntimeStorage } from "./storage-memory";

const ORG_ID = "org_context_guard_01";

describe("advanceRun — context-load guard", () => {
  test("context-build failure degrades gracefully: run advances, never strands in status='running'", async () => {
    const storage = new InMemoryRuntimeStorage();
    const context: RuntimeContext = {
      storage,
      invokeTool: async () => ({ data: { ok: true } }),
      now: () => new Date("2026-08-07T00:00:00Z"),
    };
    const spec: AgentSpec = {
      name: "Context guard — degrade",
      description: "x",
      trigger: { type: "event", event: "contact.created" },
      steps: [{ id: "done", type: "wait", seconds: 0, next: null }],
    };

    // No DB is configured in this test process, so buildRunContext
    // throws internally (same shape as a deleted/missing org row in
    // production). Before the fix this rejected startRun's returned
    // promise uncaught and left the run row at status="running".
    const runId = await startRun(context, {
      orgId: ORG_ID,
      archetypeId: "test",
      spec,
      triggerEventId: null,
      triggerPayload: {},
    });

    const run = await storage.getRun(runId);
    assert.ok(run);
    // The invariant: never "running" after the tick that hit the
    // context-build failure. This step has nothing left to do, so it
    // should reach a clean terminal state, not "failed" — the context
    // failure is tolerated, not fatal, because this step never
    // touched workspace/customer identity.
    assert.notEqual(run!.status, "running");
    // A "wait" step always pauses (it registers a timer wait, even at
    // 0 seconds) — the terminal-state assertion above is the one that
    // matters; "waiting" here just confirms the step dispatched at
    // all instead of crashing before reaching it.
    assert.equal(run!.status, "waiting");

    // Degradation is observable, not silent.
    const degradedEvents = storage.eventLog.filter(
      (e) => e.eventType === "workflow.run_context_degraded",
    );
    assert.equal(degradedEvents.length, 1);
    assert.equal(degradedEvents[0].orgId, ORG_ID);
  });

  test("double failure (context build AND the DB-free fallback) fails the run honestly, never strands it", async () => {
    const storage = new InMemoryRuntimeStorage();
    const context: RuntimeContext = {
      storage,
      invokeTool: async () => ({ data: { ok: true } }),
      // Forces the DB-free fallback construction itself to throw too
      // (buildFallbackRunContext takes `now: context.now()`), proving
      // the guard's outer catch — not just the inner degrade path —
      // upholds the invariant: a genuinely unrecoverable failure gets
      // a proper markRunFailed + step_result record, never an
      // uncaught throw that strands the run in status="running".
      now: () => {
        throw new Error("clock unavailable");
      },
    };
    const spec: AgentSpec = {
      name: "Context guard — double failure",
      description: "x",
      trigger: { type: "event", event: "contact.created" },
      steps: [{ id: "done", type: "wait", seconds: 0, next: null }],
    };

    const runId = await startRun(context, {
      orgId: ORG_ID,
      archetypeId: "test",
      spec,
      triggerEventId: null,
      triggerPayload: {},
    });

    const run = await storage.getRun(runId);
    assert.ok(run);
    assert.equal(run!.status, "failed");
    assert.notEqual(run!.status, "running");

    const failedSteps = storage.stepResults.filter(
      (r) => r.runId === runId && r.outcome === "failed",
    );
    assert.equal(failedSteps.length, 1);
    assert.match(failedSteps[0].errorMessage ?? "", /context unavailable/);
    assert.match(failedSteps[0].errorMessage ?? "", /fallback also failed/);

    const failedRunEvents = storage.eventLog.filter(
      (e) => e.eventType === "workflow.run_failed" && e.orgId === ORG_ID,
    );
    assert.equal(failedRunEvents.length, 1);
  });
});
