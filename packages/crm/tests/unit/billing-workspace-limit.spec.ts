// Phase 1 — enforceWorkspaceLimit per tier.
//
// 2026-08-07 — REWRITTEN for the first-workspace-free P0 fix. Production
// data: every authenticated first-workspace build 402'd for 16 days
// straight (zero successes) because `inactive` (every brand-new user's
// starting tier) capped at 0 full workspaces while the deny message
// itself promised "Your first workspace is free." `inactive` now gets
// the promised 1 free workspace; every other tier reads its cap straight
// off the plans catalog (plans.ts) instead of a second, drifted
// hardcoded table — `builder` in particular used to hardcode 0 here
// while the catalog + TIER_FEATURES both already said -1 (unlimited).
// The tier resolver is injected via `deps` so the gate is
// unit-testable without a DB (mirrors the hasFeature DI pattern).

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { enforceWorkspaceLimit } from "@/lib/billing/limits";
import { getPlan } from "@/lib/billing/plans";
import type { BillingTier } from "@/lib/billing/features";

function withTier(tier: BillingTier) {
  return { resolveTier: async (_orgId: string | null | undefined) => tier };
}

describe("enforceWorkspaceLimit — inactive (the P0 regression)", () => {
  test("REGRESSION: a brand-new user (tier inactive, 0 owned) is allowed their first workspace", async () => {
    const decision = await enforceWorkspaceLimit(
      { userId: "u1", primaryOrgId: "org-1", ownedWorkspaceCount: 0 },
      withTier("inactive"),
    );
    assert.equal(decision.allowed, true, "the first workspace must be free — this is the bug that denied every signup for 16 days");
    if (decision.allowed) assert.equal(decision.tier, "inactive");
  });

  test("blocks the SECOND workspace on inactive, with the upgrade message", async () => {
    const decision = await enforceWorkspaceLimit(
      { userId: "u1", primaryOrgId: "org-1", ownedWorkspaceCount: 1 },
      withTier("inactive"),
    );
    assert.equal(decision.allowed, false);
    if (!decision.allowed) {
      assert.equal(decision.reason, "workspace_limit_reached");
      assert.equal(decision.limit, 1);
      assert.match(decision.message, /first workspace is free/i);
      assert.match(decision.message, /choose a plan/i);
    }
  });

  test("missing primaryOrgId is treated as inactive — still allows the first workspace", async () => {
    const decision = await enforceWorkspaceLimit(
      { userId: "u1", primaryOrgId: null, ownedWorkspaceCount: 0 },
      withTier("inactive"),
    );
    assert.equal(decision.allowed, true);
  });

  test("missing primaryOrgId + 1 already owned is still denied", async () => {
    const decision = await enforceWorkspaceLimit(
      { userId: "u1", primaryOrgId: null, ownedWorkspaceCount: 1 },
      withTier("inactive"),
    );
    assert.equal(decision.allowed, false);
  });
});

describe("enforceWorkspaceLimit — builder (unlimited own workspaces per the catalog)", () => {
  test("catalog sanity: plans.ts says builder.limits.maxOrgs is -1 (unlimited)", () => {
    assert.equal(getPlan("builder")?.limits.maxOrgs, -1);
  });

  test("allows workspaces well past what the old hardcoded 0-cap would have blocked", async () => {
    for (const count of [0, 1, 10, 50]) {
      const decision = await enforceWorkspaceLimit(
        { userId: "u1", primaryOrgId: "org-1", ownedWorkspaceCount: count },
        withTier("builder"),
      );
      assert.equal(decision.allowed, true, `builder must allow ${count} (catalog: unlimited)`);
      if (decision.allowed) assert.equal(decision.tier, "builder");
    }
  });
});

describe("enforceWorkspaceLimit — workspace (1, per the catalog)", () => {
  test("allows the first workspace", async () => {
    const decision = await enforceWorkspaceLimit(
      { userId: "u1", primaryOrgId: "org-1", ownedWorkspaceCount: 0 },
      withTier("workspace"),
    );
    assert.equal(decision.allowed, true);
    if (decision.allowed) assert.equal(decision.tier, "workspace");
  });

  test("blocks the second workspace", async () => {
    const decision = await enforceWorkspaceLimit(
      { userId: "u1", primaryOrgId: "org-1", ownedWorkspaceCount: 1 },
      withTier("workspace"),
    );
    assert.equal(decision.allowed, false);
    if (!decision.allowed) {
      assert.equal(decision.limit, 1);
      assert.equal(decision.tier, "workspace");
    }
  });
});

describe("enforceWorkspaceLimit — managed (1, per the catalog)", () => {
  test("catalog sanity: plans.ts says managed.limits.maxOrgs is 1", () => {
    assert.equal(getPlan("managed")?.limits.maxOrgs, 1);
  });

  test("blocks the second workspace on managed", async () => {
    const decision = await enforceWorkspaceLimit(
      { userId: "u1", primaryOrgId: "org-1", ownedWorkspaceCount: 1 },
      withTier("managed"),
    );
    assert.equal(decision.allowed, false);
    if (!decision.allowed) assert.equal(decision.limit, 1);
  });
});

describe("enforceWorkspaceLimit — agency / agency_starter / agency_growth / agency_scale (unlimited)", () => {
  test("allows workspaces well past the included 10", async () => {
    for (const tier of ["agency", "agency_starter", "agency_growth", "agency_scale"] as const) {
      for (const count of [0, 1, 10, 25, 100]) {
        const decision = await enforceWorkspaceLimit(
          { userId: "u1", primaryOrgId: "org-1", ownedWorkspaceCount: count },
          withTier(tier),
        );
        assert.equal(decision.allowed, true, `${tier} must allow ${count}`);
        if (decision.allowed) assert.equal(decision.tier, tier);
      }
    }
  });
});
