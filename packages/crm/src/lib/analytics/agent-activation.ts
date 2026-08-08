// 2026-08-07 — Activation-moment PostHog events. A funnel audit found:
// 234 visitors → 10 signups → 12 workspaces → 2 workspaces that EVER held an
// agent conversation → 0 paid, ever. Agents auto-provision on workspace
// creation, yet almost nobody reaches a first conversation — that gap
// (workspace exists, agent never talks) was invisible in analytics. PR #175
// instrumented the funnel's two ends (signed_up, workspace_created,
// checkout_started); this module instruments the middle.
//
// Pure event builders ONLY — no DB, no PostHog client, no "use server". The
// DB-touching orchestration (counting prior conversations, firing these
// through captureFunnelEvent) lives in record-agent-activation.ts, which is
// the imperative shell every conversation-creation call site invokes.
//
// Distinct-id convention: same as workspace_created (funnel.ts) — orgId is
// the ONLY id available at conversation-start time for anonymous end-
// customer channels (sms/email/web/voice), so distinctId = orgId always.
// There is no userId fallback here (unlike buildSignedUpEvent) because the
// person talking to the agent is essentially never the SF operator/user.
//
// Builders return null (never a half-formed event) when a required id is
// missing, mirroring funnel.ts's contract — callers always write
// `captureFunnelEvent(buildXEvent({...}))` without an extra guard.

import type { FunnelEvent } from "@/lib/analytics/funnel";

export type BuildAgentConversationStartedEventInput = {
  orgId: string;
  agentId: string;
  conversationId: string;
  /** "web" | "sms" | "email" | "voice" | "copilot" — whatever the call site's
   *  channel concept is named; kept as a plain string so a new channel never
   *  needs a type change here. */
  channel: string;
  /** True when this conversation resolved through a deployment's client-org
   *  bridge (a deployed client agent); false for a workspace/operator's own
   *  agent. Omitted (not false) when the call site has no cheap signal to
   *  determine it, so "unknown" stays distinguishable from "known false" in
   *  PostHog. */
  isDeployedClientAgent?: boolean;
  isFirstConversationForWorkspace: boolean;
};

/**
 * agent_conversation_started — fired once per new agentConversations row
 * (never on turns within an existing conversation). Every real inbound path
 * that starts a conversation calls this via record-agent-activation.ts:
 * run-channel-turn.ts (sms/email), the public agent turn route (web),
 * voice/transcript.ts (voice), copilot/ensure-agent.ts (copilot).
 */
export function buildAgentConversationStartedEvent(
  input: BuildAgentConversationStartedEventInput,
): FunnelEvent | null {
  const orgId = input.orgId?.trim();
  const agentId = input.agentId?.trim();
  const conversationId = input.conversationId?.trim();
  const channel = input.channel?.trim();

  if (!orgId || !agentId || !conversationId || !channel) {
    // A brand-new agentConversations row always has all four by insert time —
    // a missing one here is malformed input, not a quiet path.
    console.warn(
      "[activation] buildAgentConversationStartedEvent: missing org/agent/conversation id or channel — event dropped",
    );
    return null;
  }

  const properties: FunnelEvent["properties"] = {
    org_id: orgId,
    agent_id: agentId,
    conversation_id: conversationId,
    channel,
    is_first_conversation_for_workspace: input.isFirstConversationForWorkspace,
  };

  if (input.isDeployedClientAgent !== undefined) {
    properties.is_deployed_client_agent = input.isDeployedClientAgent;
  }

  return { event: "agent_conversation_started", distinctId: orgId, properties };
}

export type BuildWorkspaceActivatedEventInput = {
  orgId: string;
  agentId: string;
  conversationId: string;
  channel: string;
};

/**
 * workspace_activated — the actual activation metric. Fired ONCE per
 * workspace: the first time any conversation starts in it, ever. Idempotency
 * is decided by shouldFireWorkspaceActivated below (a prior-conversation
 * count, computed by the imperative shell) — this builder just shapes the
 * payload once the caller has already decided to fire.
 */
export function buildWorkspaceActivatedEvent(
  input: BuildWorkspaceActivatedEventInput,
): FunnelEvent | null {
  const orgId = input.orgId?.trim();
  const agentId = input.agentId?.trim();
  const conversationId = input.conversationId?.trim();
  const channel = input.channel?.trim();

  if (!orgId || !agentId || !conversationId || !channel) {
    console.warn(
      "[activation] buildWorkspaceActivatedEvent: missing org/agent/conversation id or channel — event dropped",
    );
    return null;
  }

  return {
    event: "workspace_activated",
    distinctId: orgId,
    properties: {
      org_id: orgId,
      agent_id: agentId,
      conversation_id: conversationId,
      channel,
    },
  };
}

/**
 * The pure idempotency decision for workspace_activated: fire iff the
 * conversation just inserted is the ONLY conversation this org has ever had
 * (i.e. a prior-count of 0, where "prior" means the count taken AFTER the
 * new row was inserted — see record-agent-activation.ts). A non-finite count
 * (a failed/garbled DB read) defaults to "do not fire" — under-firing a
 * marketing event is a safe failure, double-firing it is not idempotent.
 */
export function shouldFireWorkspaceActivated(conversationCountForOrg: number): boolean {
  return Number.isFinite(conversationCountForOrg) && conversationCountForOrg === 0;
}
