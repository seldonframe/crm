// 2026-08-06 — Funnel observability. Pure event builders for the
// signed_up / workspace_created / checkout_started person-funnel, plus a
// thin fire-and-forget capture wrapper. Distinct-id convention for these
// NEW person-funnel events: distinctId = user id when a user is known,
// else orgId; org_id is ALWAYS attached as a property. This is a
// deliberate departure from the existing orgId-keyed events (e.g.
// activation_step_completed in lib/activation/ladder-server.ts) — do not
// change those.
//
// Builders return null (never a half-formed event) when a required id is
// missing, so a caller can distinguish "nothing to send" from "send this"
// without inspecting properties. captureFunnelEvent takes that null
// straight through as a no-op, so call sites can always write
// `captureFunnelEvent(buildXEvent({...}))` without an extra guard.

import { captureServerEvent, getPosthogClient } from "@/lib/analytics/capture";

export type FunnelPropertyValue = string | number | boolean | null;

export type FunnelEvent = {
  event: string;
  distinctId: string;
  /** Flat properties, plus PostHog's nested $set for person-property writes. */
  properties: Record<string, FunnelPropertyValue> & {
    $set?: Record<string, FunnelPropertyValue>;
  };
};

function resolveDistinctId(userId: string | null | undefined, orgId: string | null | undefined): string | null {
  const trimmedUserId = userId?.trim();
  if (trimmedUserId) return trimmedUserId;

  const trimmedOrgId = orgId?.trim();
  if (trimmedOrgId) return trimmedOrgId;

  return null;
}

export type BuildSignedUpEventInput = {
  userId?: string | null;
  orgId?: string | null;
  /** Auth provider, when cheaply available (e.g. "google"). Omitted, not
   *  null, when unknown — keeps the property absent rather than noisy. */
  method?: string | null;
  email?: string | null;
};

/**
 * signed_up — fired once from events.createUser (lib/auth/config.ts).
 * Requires at least orgId to resolve a distinct id (userId preferred);
 * returns null otherwise so the caller never fires a malformed event.
 * email goes under $set so the PostHog person record gets it attached.
 */
export function buildSignedUpEvent(input: BuildSignedUpEventInput): FunnelEvent | null {
  const distinctId = resolveDistinctId(input.userId, input.orgId);
  if (!distinctId || !input.orgId?.trim()) return null;

  const properties: FunnelEvent["properties"] = {
    org_id: input.orgId.trim(),
  };

  if (input.method) {
    properties.method = input.method;
  }

  if (input.email) {
    properties.$set = { email: input.email };
  }

  return { event: "signed_up", distinctId, properties };
}

export type BuildWorkspaceCreatedEventInput = {
  userId?: string | null;
  orgId?: string | null;
  source: string;
  isInternal?: boolean;
};

/**
 * workspace_created — fired from lib/workspace/create-full.ts, the single
 * choke point for every workspace creation path (API route,
 * provisionClientWorkspace, MCP atomic create). Requires orgId; userId
 * (owner/creator) is frequently absent at creation time (anonymous
 * workspace creation), in which case distinct id falls back to orgId.
 */
export function buildWorkspaceCreatedEvent(input: BuildWorkspaceCreatedEventInput): FunnelEvent | null {
  const distinctId = resolveDistinctId(input.userId, input.orgId);
  if (!distinctId || !input.orgId?.trim()) return null;

  const properties: FunnelEvent["properties"] = {
    org_id: input.orgId.trim(),
    source: input.source,
  };

  if (input.isInternal !== undefined) {
    properties.is_internal = input.isInternal;
  }

  return { event: "workspace_created", distinctId, properties };
}

export type BuildCheckoutStartedEventInput = {
  userId?: string | null;
  orgId?: string | null;
  workspaceId?: string | null;
  /** Tier path (new self-service checkout). */
  tier?: string | null;
  /** Legacy priceId path — mutually exclusive with tier in practice, but
   *  the builder doesn't enforce that; callers pass whichever they have. */
  priceId?: string | null;
  isInternal?: boolean;
};

/**
 * checkout_started — fired from app/api/stripe/checkout/route.ts on both
 * the tier path and the legacy priceId path. distinct_id is always the
 * authenticated userId (no anonymous checkout exists), so unlike the other
 * two builders there is no orgId fallback — userId is required.
 */
export function buildCheckoutStartedEvent(input: BuildCheckoutStartedEventInput): FunnelEvent | null {
  const userId = input.userId?.trim();
  const orgId = input.orgId?.trim();
  if (!userId || !orgId) return null;

  const properties: FunnelEvent["properties"] = {
    org_id: orgId,
  };

  if (input.workspaceId) {
    properties.workspace_id = input.workspaceId;
  }

  if (input.tier) {
    properties.tier = input.tier;
  } else if (input.priceId) {
    properties.price_id = input.priceId;
  }

  if (input.isInternal !== undefined) {
    properties.is_internal = input.isInternal;
  }

  return { event: "checkout_started", distinctId: userId, properties };
}

/**
 * Thin fire-and-forget wrapper delegating to captureServerEvent. Accepts
 * the builder's null-on-missing-ids output directly so call sites never
 * need a separate guard. A null payload is expected on legitimate paths
 * (e.g. checkout with no org resolved yet) so this is a SILENT no-op —
 * builders themselves are the right place to warn on genuinely malformed
 * input, not this pass-through.
 */
export function captureFunnelEvent(payload: FunnelEvent | null): void {
  if (!payload) return;

  try {
    captureServerEvent({
      event: payload.event,
      distinctId: payload.distinctId,
      properties: payload.properties,
    });
  } catch (err) {
    console.warn(
      `[funnel] captureFunnelEvent threw (swallowed): ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

/**
 * Alias an anonymous org-keyed distinct id to the user who just claimed
 * ownership of it. Every person-funnel event fired before a user exists
 * (workspace_created) is keyed by orgId; every event fired after
 * (signed_up, checkout_started) is keyed by userId. Without this alias
 * PostHog sees two unrelated persons and the funnel never joins.
 *
 * Fire-and-forget, same posture as captureFunnelEvent: no-ops when either
 * id is missing or when PostHog isn't configured, never throws into the
 * caller's request path. Uses aliasImmediate (not the buffered alias())
 * for the same serverless-safety reason captureServerEvent uses
 * captureImmediate — see capture.ts.
 */
export function aliasOrgToUser(userId: string | null | undefined, orgId: string | null | undefined): void {
  const trimmedUserId = userId?.trim();
  const trimmedOrgId = orgId?.trim();
  if (!trimmedUserId || !trimmedOrgId) return;

  try {
    const ph = getPosthogClient();
    if (!ph) return;

    void ph
      .aliasImmediate({ distinctId: trimmedUserId, alias: trimmedOrgId })
      .catch(() => {
        // Swallow — an alias failure must be invisible to the caller.
      });
  } catch {
    // Never let an alias-construction bug reach the caller's request path.
  }
}
