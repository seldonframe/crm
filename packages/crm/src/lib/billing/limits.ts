// 2026-06-18 pricing migration — workspace-creation gate for the
// builder / workspace / agency ladder.
//
// The old Free-tier hard caps (50 contacts / 100 agent runs) are gone:
// there is no free tier, and the paid tiers are flat (unlimited
// contacts/runs). enforceContactLimit / enforceAgentRunLimit are kept
// as always-allow shims so existing call sites (the public intake POST,
// the agent dispatcher) keep compiling and never block.
//
// enforceWorkspaceLimit is the live gate:
//   inactive (no plan)    = 1 full workspace — "first workspace is free
//                           forever" (CLAUDE.md §1). This was a live
//                           P0: the constant below returned 0 for
//                           `inactive`, so `0 < 0` was false and EVERY
//                           brand-new user's first build was denied with
//                           a 402 before any work happened — while the
//                           deny message itself said "Your first
//                           workspace is free." Fixed 2026-08-07.
//   builder / everything else = read straight from the plans catalog
//                           (plans.ts), which is the single source of
//                           truth `maxSubAccountsForTier` already uses.
//
// The tier resolver is injectable via `deps` so the gate is
// unit-testable without a DB (mirrors hasFeature's DI pattern).

import { normalizeTierId, type BillingTier } from "./features";
import { resolveTierForWorkspace } from "./tier-resolver";
import { getPlan } from "./plans";

export type LimitDecision =
  | { allowed: true; tier: BillingTier }
  | {
      allowed: false;
      tier: BillingTier;
      reason: "contact_limit_reached" | "agent_run_limit_reached" | "workspace_limit_reached";
      message: string;
      upgradeUrl: string;
      used: number;
      limit: number;
    };

export type WorkspaceLimitDeps = {
  /** Resolve the effective tier for an org. Injected in tests; the
   *  production default walks the agency chain via tier-resolver. */
  resolveTier: (orgId: string | null | undefined) => Promise<BillingTier>;
};

const defaultDeps: WorkspaceLimitDeps = {
  resolveTier: async (orgId) => normalizeTierId(await resolveTierForWorkspace(orgId)),
};

/** Full-workspace allowance per tier. `inactive` (no plan) gets the
 *  magic first-run allowance of 1 — the first workspace is free forever
 *  (CLAUDE.md §1) — every other tier reads its cap straight off the
 *  plans catalog (`getPlan(tier).limits.maxOrgs`), mirroring
 *  `maxSubAccountsForTier` below so this file never drifts from
 *  plans.ts again. `getPlan` has no "inactive" entry (it isn't a
 *  sellable/grandfathered plan), hence the explicit branch. -1 =
 *  unlimited. */
function maxFullWorkspacesForTier(tier: BillingTier): number {
  if (tier === "inactive") return 1;
  return getPlan(tier)?.limits.maxOrgs ?? 0;
}

/**
 * @deprecated No free tier → no contact hard cap. Always allows. Kept
 * so the public intake POST + contact-create paths keep compiling.
 */
export async function enforceContactLimit(orgId: string): Promise<LimitDecision> {
  const tier = normalizeTierId(await resolveTierForWorkspace(orgId));
  return { allowed: true, tier };
}

/**
 * @deprecated No free tier → no agent-run hard cap. Always allows.
 */
export async function enforceAgentRunLimit(orgId: string): Promise<LimitDecision> {
  const tier = normalizeTierId(await resolveTierForWorkspace(orgId));
  return { allowed: true, tier };
}

/**
 * Workspace-creation cap. `inactive` (no plan) gets the magic
 * first-workspace-free allowance of 1 (CLAUDE.md §1); every other tier
 * (builder, workspace, agency, and the new sellable ladder) reads its
 * cap straight from the plans catalog (`getPlan(tier).limits.maxOrgs`)
 * — see `maxFullWorkspacesForTier` above. -1 there means unlimited.
 * Future cap changes belong in plans.ts, not here. The acting org's
 * tier is resolved from its primary org (walking the agency chain for
 * managed workspaces).
 */
export async function enforceWorkspaceLimit(
  params: {
    userId: string;
    primaryOrgId: string | null | undefined;
    ownedWorkspaceCount: number;
  },
  deps: WorkspaceLimitDeps = defaultDeps,
): Promise<LimitDecision> {
  const tier = params.primaryOrgId
    ? await deps.resolveTier(params.primaryOrgId)
    : "inactive";

  const cap = maxFullWorkspacesForTier(tier);

  if (cap === -1) return { allowed: true, tier };
  if (params.ownedWorkspaceCount < cap) return { allowed: true, tier };

  // Over (or at) the cap. 2026-06-22 magic first-run: the first workspace is
  // free on us, so the over-cap copy leads with that and points at the BYOK
  // + plan upgrade as the path to more — not a scolding "you're capped".
  //
  // 2026-08-07: dropped the dead `tier === "builder"` branch here — since
  // builder's cap now comes straight from the catalog (-1, unlimited), it
  // can never reach this deny path, and the branch's copy ("Builder
  // includes landing pages only") had drifted false anyway (builder has
  // sold full front-office workspaces since the 2026-07-08 pricing ladder;
  // see plans.ts).
  const message =
    tier === "workspace"
      ? `Your first workspace is free. Add your Anthropic key and upgrade to spin up more client workspaces.`
      : `Your first workspace is free. Choose a plan to add more.`;

  return {
    allowed: false,
    tier,
    reason: "workspace_limit_reached",
    message,
    upgradeUrl: "/settings/billing",
    used: params.ownedWorkspaceCount,
    limit: cap,
  };
}

// ─── 2026-07-08 pricing ladder — sub-account (client-workspace handoff) gate ───
//
// Counted unit: `organizations.parent_agency_id` attachment (archivedAt
// IS NULL) — see lib/billing/orgs.ts::fetchAgencyAttachedWorkspaceIds.
// Enforced at attachWorkspaceToAgency and any flow that auto-attaches.
// -1 = unlimited. Pure core (this file) has no DB import, so it stays
// unit-testable without a circular import back to orgs.ts (which
// already imports enforceWorkspaceLimit from here).

export type SubAccountLimitDecision =
  | { ok: true }
  | {
      ok: false;
      reason: "subaccount_limit_reached";
      used: number;
      limit: number;
    };

/** Sub-account allowance per tier, read straight from the catalog's
 *  `limits.maxSubAccounts` (single source of truth — plans.ts). */
export function maxSubAccountsForTier(tier: BillingTier): number {
  const plan = getPlan(tier);
  return plan?.limits.maxSubAccounts ?? 0;
}

/** Pure gate: does attaching one more client workspace exceed the
 *  tier's sub-account cap? -1 = unlimited (always allows). */
export function enforceSubAccountLimit(params: {
  tier: BillingTier;
  currentCount: number;
}): SubAccountLimitDecision {
  const limit = maxSubAccountsForTier(params.tier);
  if (limit === -1) return { ok: true };
  if (params.currentCount < limit) return { ok: true };
  return {
    ok: false,
    reason: "subaccount_limit_reached",
    used: params.currentCount,
    limit,
  };
}

/** @deprecated No free tier → no free-usage banner. Always null. Kept
 *  so the dashboard banner caller keeps compiling. */
export async function getFreeTierUsageBannerData(_orgId: string): Promise<null> {
  return null;
}
