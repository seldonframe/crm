// Ephemeral-turn message assembly (Never-Lies L2b follow-up, 2026-08-06).
//
// executeTurn (./runtime.ts, "use server") builds its Anthropic messages
// array from DB history. For a persist:false turn (e.g. the copilot route's
// synthetic vision-retry coaching instruction — route.ts) the user turn is
// deliberately NEVER inserted into agentTurns, so the DB-derived history has
// no row for it. The model still needs to see the turn, so it has to be
// appended IN MEMORY instead.
//
// Pulled out of runtime.ts (a "use server" module — Turbopack rejects any
// non-async export from one) so this decision is a plain, synchronous, unit-
// testable pure function, mirroring how bindingToCtxBooking was extracted to
// ./booking/binding-ctx for the same reason.

export type TurnMessageContent =
  | string
  | Array<
      | { type: "text"; text: string }
      | { type: "tool_use"; id: string; name: string; input: unknown }
      | { type: "tool_result"; tool_use_id: string; content: string; is_error?: boolean }
    >;

export type TurnMessage = {
  role: "user" | "assistant";
  content: TurnMessageContent;
};

/**
 * Assemble the final in-memory messages array executeTurn sends to Anthropic.
 *
 * `history` is the DB-derived conversation converted to Anthropic message
 * shape, in turn order. When `persist` is true, executeTurn has already
 * inserted the current user turn into agentTurns BEFORE selecting history,
 * so `history` already ends with it — this function returns it unchanged.
 * When `persist` is false, no such row exists, so this function appends
 * `{ role: "user", content: userMessage }` after the existing history.
 *
 * Guarded against duplication either way: if `history` already ends with a
 * plain-string user message equal to `userMessage`, it is never appended
 * twice.
 */
export function buildTurnMessages(
  history: TurnMessage[],
  userMessage: string,
  persist: boolean,
): TurnMessage[] {
  const last = history[history.length - 1];
  const historyAlreadyEndsWithThisMessage =
    last !== undefined &&
    last.role === "user" &&
    typeof last.content === "string" &&
    last.content === userMessage;

  if (persist || historyAlreadyEndsWithThisMessage) {
    return history;
  }

  return [...history, { role: "user", content: userMessage }];
}
