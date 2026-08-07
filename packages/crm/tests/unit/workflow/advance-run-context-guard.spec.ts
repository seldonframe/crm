// Regression tests for the advanceRun context-load guard (2026-08-07,
// reworked after review rejected the original degrade-and-proceed fix).
//
// runtime.ts's advanceRun() calls loadRunContext()/buildRunContext(),
// which issues a live DB query. Before any guard, that call was
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
// A first fix caught the throw but degraded to a DB-free placeholder
// context (empty workspace name, "UTC" timezone) and PROCEEDED with
// dispatch. Review rejected that: dispatchConversation interpolates
// workspace.name straight into an outbound SMS ("thanks for reaching
// out to !") and tool-invoker.ts falls back to the same degraded UTC
// for timezone-sensitive booking parses — both real, unrecallable
// side effects on invented identity. The fix here is fail-closed: a
// context-load failure ends the run `failed` with a step_result row,
// UNCONDITIONALLY, and no dispatch of the current step occurs.
//
// These tests exercise the guard directly, without mocking the `db`
// import: InMemoryRuntimeStorage + a synthetic org id naturally makes
// buildRunContext throw (no DB configured in this test process), the
// same as production hitting a deleted org row. They do NOT inject
// RuntimeContext.loadRunContext (the DI seam other workflow specs use)
// specifically because the point of these three tests is to exercise
// what happens when that seam is absent, i.e. production's real path.

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import type { AgentSpec } from "../../../src/lib/agents/validator";
import { advanceRun, startRun } from "../../../src/lib/workflow/runtime";
import type { RuntimeContext } from "../../../src/lib/workflow/types";
import { InMemoryRuntimeStorage } from "./storage-memory";

const ORG_ID = "org_context_guard_01";

describe("advanceRun — context-load guard (fail-closed)", () => {
  test("context-load failure on a wait step: run ends failed with a step_result row, never strands at running", async () => {
    const storage = new InMemoryRuntimeStorage();
    const context: RuntimeContext = {
      storage,
      invokeTool: async () => ({ data: { ok: true } }),
      now: () => new Date("2026-08-07T00:00:00Z"),
      // No loadRunContext injected — production's real DB-backed path,
      // which throws in this DB-free test process.
    };
    const spec: AgentSpec = {
      name: "Context guard — fail closed",
      description: "x",
      trigger: { type: "event", event: "contact.created" },
      steps: [{ id: "done", type: "wait", seconds: 0, next: null }],
    };

    // No DB is configured in this test process, so buildRunContext
    // throws internally (same shape as a deleted/missing org row in
    // production). Before any guard this rejected startRun's returned
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
    // The invariant: a context-load failure fails the run closed.
    // Never "running" (stranded), never any other terminal state that
    // implies the step dispatched on invented identity.
    assert.equal(run!.status, "failed");
    assert.notEqual(run!.status, "running");

    // A step_result row records the failure for the admin trace view.
    const failedSteps = storage.stepResults.filter(
      (r) => r.runId === runId && r.outcome === "failed",
    );
    assert.equal(failedSteps.length, 1);
    assert.equal(failedSteps[0].stepId, "done");
    assert.match(failedSteps[0].errorMessage ?? "", /context unavailable/);

    // Failure is observable via the event log too (workflow.run_failed,
    // written by markRunFailed) — never silent.
    const failedRunEvents = storage.eventLog.filter(
      (e) => e.eventType === "workflow.run_failed" && e.orgId === ORG_ID,
    );
    assert.equal(failedRunEvents.length, 1);
  });

  test("context-load failure on a conversation step: NO outbound send is dispatched (NB-6 — the regression that matters)", async () => {
    // The prior degrade-and-proceed fix's blocking defect only shows
    // up on a step that actually reads runContext (conversation reads
    // workspace.name for the SMS body + calls the send tool). A wait
    // step reads nothing from runContext, so it can't distinguish
    // "fails closed" from "degrades and proceeds harmlessly" — this
    // test closes that gap by asserting the send path (invokeTool /
    // the conversation dispatcher's DB-backed send) is never reached
    // at all when the context load fails.
    const storage = new InMemoryRuntimeStorage();
    let invokeToolCalls = 0;
    const context: RuntimeContext = {
      storage,
      invokeTool: async () => {
        invokeToolCalls += 1;
        return { data: { ok: true } };
      },
      now: () => new Date("2026-08-07T00:00:00Z"),
      // No loadRunContext injected — forces the real DB-backed loader,
      // which throws in this DB-free test process.
    };
    const spec: AgentSpec = {
      name: "Context guard — conversation fail closed",
      description: "x",
      trigger: { type: "event", event: "contact.created" },
      steps: [
        {
          id: "talk",
          type: "conversation",
          channel: "sms",
          initial_message: "Hi {{contact.firstName}}, thanks for reaching out to {{businessName}}!",
          exit_when: "customer confirms a time",
          on_exit: { extract: {}, next: null },
        },
      ],
    };

    const runId = await startRun(context, {
      orgId: ORG_ID,
      archetypeId: "test",
      spec,
      triggerEventId: null,
      // A real contactId + phone — same shape the healthy path uses.
      // If the guard were still degrading-and-proceeding, this payload
      // is exactly what would let dispatchConversation's contactId/
      // phone check pass and actually send.
      triggerPayload: { contactId: "contact_1", phone: "+15551234567", fullName: "Ada Lovelace" },
    });

    const run = await storage.getRun(runId);
    assert.ok(run);
    assert.equal(run!.status, "failed");
    assert.notEqual(run!.status, "running");

    // The load-bearing assertion: the conversation dispatcher's send
    // path was never reached. dispatchConversation would call
    // invokeTool (or the SMS-sending DB path it wraps) to deliver
    // initial_message; a context-load failure must prevent the step
    // from dispatching at all, not merely fail after sending.
    assert.equal(invokeToolCalls, 0);

    const failedSteps = storage.stepResults.filter(
      (r) => r.runId === runId && r.stepId === "talk" && r.outcome === "failed",
    );
    assert.equal(failedSteps.length, 1);
    assert.match(failedSteps[0].errorMessage ?? "", /context unavailable/);
  });

  test("context-load failure surfaces a structured console.warn even when the DB event-log write also fails (NB-3/NB-4)", async () => {
    const storage = new InMemoryRuntimeStorage();
    // Force the observability DB write (appendEventLog) to throw too —
    // the exact scenario NB-3 called out: the DB being unavailable is
    // why context load failed in the first place, so an event-log
    // insert is liable to fail the same way. The console.warn must
    // still fire, and it must never be misattributed to this
    // secondary failure (NB-4) — appendStepResult/markRunFailed still
    // run and use the ORIGINAL context-load reason.
    const originalAppendEventLog = storage.appendEventLog.bind(storage);
    let eventLogCalls = 0;
    storage.appendEventLog = async (input) => {
      eventLogCalls += 1;
      // Only the context-load observability write is forced to fail —
      // markRunFailed's own appendEventLog(workflow.run_failed) call
      // is NOT wrapped in a try/catch in runtime.ts (it's a genuine,
      // separate write on the failure path, not best-effort), so
      // failing it too would throw out of markRunFailed itself and
      // break the very invariant ("run ends failed, never stranded")
      // this test is trying to verify. Scoping the injected failure to
      // exactly the write NB-3 is about keeps the test honest.
      if (input.eventType === "workflow.run_context_failed") {
        throw new Error("db unavailable for event log too");
      }
      return originalAppendEventLog(input);
    };

    const warnCalls: unknown[] = [];
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      warnCalls.push(args[0]);
    };

    const context: RuntimeContext = {
      storage,
      invokeTool: async () => ({ data: { ok: true } }),
      now: () => new Date("2026-08-07T00:00:00Z"),
    };
    const spec: AgentSpec = {
      name: "Context guard — warn survives DB outage",
      description: "x",
      trigger: { type: "event", event: "contact.created" },
      steps: [{ id: "done", type: "wait", seconds: 0, next: null }],
    };

    let runId: string;
    try {
      runId = await startRun(context, {
        orgId: ORG_ID,
        archetypeId: "test",
        spec,
        triggerEventId: null,
        triggerPayload: {},
      });
    } finally {
      console.warn = originalWarn;
      storage.appendEventLog = originalAppendEventLog;
    }

    assert.ok(eventLogCalls >= 1);

    const primaryWarn = warnCalls.find(
      (w) =>
        typeof w === "object" &&
        w !== null &&
        (w as Record<string, unknown>).event === "workflow.run_context_failed",
    );
    assert.ok(primaryWarn, "expected an unconditional console.warn with event=workflow.run_context_failed");
    assert.equal((primaryWarn as Record<string, unknown>).runId, runId!);

    // markRunFailed still ran despite the event-log write throwing —
    // the run is failed, not stranded, and appendStepResult still
    // recorded the ORIGINAL context-unavailable reason (never the
    // secondary "db unavailable for event log too" message).
    const run = await storage.getRun(runId!);
    assert.equal(run!.status, "failed");
    const failedSteps = storage.stepResults.filter((r) => r.runId === runId && r.outcome === "failed");
    assert.equal(failedSteps.length, 1);
    assert.match(failedSteps[0].errorMessage ?? "", /context unavailable/);
    assert.doesNotMatch(failedSteps[0].errorMessage ?? "", /db unavailable for event log too/);
  });
});
