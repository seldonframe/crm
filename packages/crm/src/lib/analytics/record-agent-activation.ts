// 2026-08-07 — Imperative shell for the activation-moment events (see
// agent-activation.ts for the pure builders + the "why"). This is the ONE
// place every real conversation-creation call site calls into: it does the
// DB reads the pure builders need (prior-conversation count for the
// idempotent workspace_activated fire, and a best-effort deployment lookup
// for is_deployed_client_agent), then fires both events through
// captureFunnelEvent — the same fire-and-forget/catch-swallowing delivery
// funnel.ts's signed_up/workspace_created/checkout_started use.
//
// Call sites (every real inbound path that inserts an agentConversations
// row): run-channel-turn.ts (sms/email), the public agent turn route (web),
// voice/transcript.ts (voice), copilot/ensure-agent.ts (copilot). Each
// calls this ONCE, right after a successful insert — never on a reused
// existing conversation.
//
// NOT called: eval-runner/run-deployed-agent-evals (eval traffic, not real
// conversations), the /agents replay-test endpoint (status="test"), and the
// marketplace MCP turn route (runs a DB-free stateless turn — no
// agentConversations row exists to key an activation event off of).
//
// OPTIMISTIC-PATH GUARD: this function must never fail a conversation. Every
// DB read and every capture call is wrapped so a PostHog or Postgres hiccup
// here is invisible to the caller — logged, never thrown.

import {
  buildAgentConversationStartedEvent,
  buildWorkspaceActivatedEvent,
  shouldFireWorkspaceActivated,
} from "@/lib/analytics/agent-activation";
import { captureFunnelEvent } from "@/lib/analytics/funnel";

export type RecordAgentConversationStartedInput = {
  orgId: string;
  agentId: string;
  conversationId: string;
  /** "web" | "sms" | "email" | "voice" | "copilot". */
  channel: string;
};

/**
 * Count every agentConversations row for this org (including the one just
 * inserted) and check whether the org is a deployment's client org. Both
 * reads are best-effort: a thrown error yields `null` counts /
 * `isDeployedClientAgent: undefined` rather than propagating, so a DB
 * hiccup degrades to "skip workspace_activated this time, omit the
 * deployment flag" instead of breaking the conversation that triggered it.
 */
async function loadActivationContext(
  orgId: string,
): Promise<{ conversationCountForOrg: number | null; isDeployedClientAgent: boolean | undefined }> {
  let conversationCountForOrg: number | null = null;
  let isDeployedClientAgent: boolean | undefined;

  try {
    const { db } = await import("@/db");
    const { agentConversations, deployments } = await import("@/db/schema");
    const { eq, sql } = await import("drizzle-orm");

    const [countRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(agentConversations)
      .where(eq(agentConversations.orgId, orgId));
    conversationCountForOrg = countRow?.count ?? null;

    const [deploymentRow] = await db
      .select({ id: deployments.id })
      .from(deployments)
      .where(eq(deployments.clientOrgId, orgId))
      .limit(1);
    isDeployedClientAgent = Boolean(deploymentRow);
  } catch (err) {
    console.warn(
      `[activation] loadActivationContext threw (swallowed): ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return { conversationCountForOrg, isDeployedClientAgent };
}

/**
 * Fire agent_conversation_started (always) and workspace_activated (only on
 * the org's very first conversation ever). Fire-and-forget: never throws,
 * never awaited by callers beyond "started" (callers may still `await` it
 * to keep request-scoped serverless functions alive long enough to flush,
 * matching the captureImmediate posture elsewhere).
 */
export async function recordAgentConversationStarted(
  input: RecordAgentConversationStartedInput,
): Promise<void> {
  try {
    const { conversationCountForOrg, isDeployedClientAgent } = await loadActivationContext(
      input.orgId,
    );

    // conversationCountForOrg counts the row already inserted, so "1" means
    // this IS the first conversation — translate to the 0-based "prior
    // count" shouldFireWorkspaceActivated expects. A null read (DB hiccup)
    // becomes NaN, which shouldFireWorkspaceActivated treats as "don't fire".
    const priorCount =
      conversationCountForOrg === null ? Number.NaN : conversationCountForOrg - 1;
    const isFirst = shouldFireWorkspaceActivated(priorCount);

    captureFunnelEvent(
      buildAgentConversationStartedEvent({
        orgId: input.orgId,
        agentId: input.agentId,
        conversationId: input.conversationId,
        channel: input.channel,
        isDeployedClientAgent,
        isFirstConversationForWorkspace: isFirst,
      }),
    );

    if (isFirst) {
      captureFunnelEvent(
        buildWorkspaceActivatedEvent({
          orgId: input.orgId,
          agentId: input.agentId,
          conversationId: input.conversationId,
          channel: input.channel,
        }),
      );
    }
  } catch (err) {
    console.warn(
      `[activation] recordAgentConversationStarted threw (swallowed): ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}
