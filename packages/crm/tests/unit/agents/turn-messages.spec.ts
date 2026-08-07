// Ephemeral-turn message assembly — unit properties for buildTurnMessages
// (src/lib/agents/turn-messages.ts). Extracted from runtime.ts's executeTurn
// so the persist:false decision (never-lies L2b: synthetic vision-retry
// coaching text must never land in agentTurns) is testable without a DB.
//
// Properties under test:
//   - persist:true → history returned unchanged (message already came from
//     the DB insert-before-select ordering in executeTurn)
//   - persist:false → userMessage appended in memory, at the end (ordering)
//   - persist:false but history already ends with the identical user
//     message → not duplicated
//   - persist:true but history is empty (defensive) → returns empty, no
//     append (never fabricates a turn the DB doesn't have)

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { buildTurnMessages, type TurnMessage } from "@/lib/agents/turn-messages";

const asst = (text: string): TurnMessage => ({
  role: "assistant",
  content: [{ type: "text", text }],
});
const usr = (text: string): TurnMessage => ({ role: "user", content: text });

describe("buildTurnMessages", () => {
  test("persist:true returns history unchanged (message comes from DB)", () => {
    const history: TurnMessage[] = [usr("hello"), asst("hi there"), usr("book me a slot")];
    const out = buildTurnMessages(history, "book me a slot", true);
    assert.deepEqual(out, history);
  });

  test("persist:false appends userMessage in memory when absent from history", () => {
    const history: TurnMessage[] = [usr("hello"), asst("hi there")];
    const out = buildTurnMessages(history, "retry: fix the tagline field", false);
    assert.equal(out.length, 3);
    assert.deepEqual(out[2], { role: "user", content: "retry: fix the tagline field" });
  });

  test("persist:false ordering — appended message is last, prior history untouched", () => {
    const history: TurnMessage[] = [usr("a"), asst("b"), usr("c"), asst("d")];
    const out = buildTurnMessages(history, "e", false);
    assert.deepEqual(out.slice(0, 4), history);
    assert.deepEqual(out[4], { role: "user", content: "e" });
  });

  test("persist:false does not duplicate when history already ends with the same user message", () => {
    const history: TurnMessage[] = [usr("hello"), asst("hi"), usr("same text")];
    const out = buildTurnMessages(history, "same text", false);
    assert.equal(out.length, 3);
    assert.deepEqual(out, history);
  });

  test("persist:true with empty history returns empty (never fabricates a row the DB doesn't have)", () => {
    const out = buildTurnMessages([], "first message", true);
    assert.deepEqual(out, []);
  });

  test("does not mutate the input history array", () => {
    const history: TurnMessage[] = [usr("hello")];
    const frozen = Object.freeze([...history]);
    buildTurnMessages(frozen as TurnMessage[], "next", false);
    assert.deepEqual(frozen, [usr("hello")]);
  });

  // N1 — the ONE production persist:false shape. The copilot retry
  // (runtime.ts:253-265) only fires after the original turn made
  // edit_/update_/add_ tool calls, so the last DB-derived message in the
  // real caller is a user message whose `content` is an ARRAY of
  // tool_result blocks — never a plain string. The dup-guard's
  // `typeof last.content === "string"` check must fall through for this
  // shape (it does — a string check on array content is false), so the
  // synthetic retry message still gets appended instead of being
  // (wrongly) treated as a duplicate.
  test("persist:false with history ending in a tool_result array (real copilot-retry shape) still appends", () => {
    const history: TurnMessage[] = [
      usr("hello"),
      asst("hi there"),
      {
        role: "user",
        content: [
          { type: "tool_result", tool_use_id: "tool_1", content: "field updated" },
        ],
      },
    ];
    const out = buildTurnMessages(history, "retry: fix the tagline field", false);
    assert.equal(out.length, 4);
    assert.deepEqual(out[3], { role: "user", content: "retry: fix the tagline field" });
  });

  // N2 — the property that actually matters for runtime.ts's mid-turn
  // pushes (lines ~542/639): persist:true returns the CALLER'S ARRAY BY
  // REFERENCE, not a copy. A future "defensive copy" refactor of
  // buildTurnMessages would silently break those in-place appends without
  // ever failing the frozen-array non-mutation test above (that test never
  // asserts identity, only that history's own contents are unchanged).
  test("persist:true returns the same array reference as the input (relied on for mid-turn pushes)", () => {
    const history: TurnMessage[] = [usr("hello"), asst("hi there"), usr("book me a slot")];
    const out = buildTurnMessages(history, "book me a slot", true);
    assert.equal(out, history);
  });
});
