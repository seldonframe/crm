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
});
