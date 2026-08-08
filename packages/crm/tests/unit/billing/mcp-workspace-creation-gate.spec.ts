// packages/crm/tests/unit/billing/mcp-workspace-creation-gate.spec.ts
//
// 2026-08-07 — P0 follow-up to #182 (0d773bcab). #182 fixed the WEB path
// (/clients/new) by (a) making maxFullWorkspacesForTier return 1 for
// `inactive` instead of 0, and (b) adding excludeOrgId to the shared
// owned-workspace-count helper so the operator's own primary org never
// counts against their cap. The SAME bug was still live on a second,
// PRIVATE counter in lib/billing/orgs.ts (`getOwnedWorkspaceCount`, now
// deleted) that counted `organizations.ownerId === userId` — a predicate
// that INCLUDES the operator's own primary org, because both signup
// paths (OAuth/magic-link in packages/crm/auth.ts, email+password in
// src/lib/auth/actions.ts) stamp `organizations.ownerId = user.id` on
// it. So a brand-new user's count was already 1 before they ever created
// a workspace, and the MCP path — POST /api/v1/workspace/create, via
// ensureWorkspaceCreationBillingForUser — denied every first build.
//
// This spec drives `ensureWorkspaceCreationBillingForUser` (now exported
// with an injectable deps seam, mirroring the repo's DI-over-mock.module
// convention — see tests/unit/auth/magic-link-redirect.spec.ts) with NO
// real DB, asserting the exact composition: count (excluding the
// caller's primary org) → gate.
//
// Run:
//   node --import tsx --test tests/unit/billing/mcp-workspace-creation-gate.spec.ts

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import {
  ensureWorkspaceCreationBillingForUser,
  type EnsureWorkspaceCreationBillingDeps,
} from "@/lib/billing/orgs";
import { enforceWorkspaceLimit } from "@/lib/billing/limits";
import { countOwnedWorkspacesFromRows } from "@/lib/web-onboarding/owned-workspace-count";

type BillingUser = Parameters<typeof ensureWorkspaceCreationBillingForUser>[0];

function billingUser(overrides: Partial<BillingUser> = {}): BillingUser {
  return {
    id: "user-1",
    orgId: "org-primary",
    planId: null,
    stripeSubscriptionId: null,
    subscriptionStatus: null,
    name: "Test User",
    email: "test@example.com",
    ...overrides,
  } as BillingUser;
}

/** Real enforceWorkspaceLimit, fake tier resolver — no DB, matches the
 *  pattern already used in tests/unit/billing-workspace-limit.spec.ts. */
function withTier(tier: "inactive" | "builder" | "managed" | "workspace" | "agency") {
  return (params: Parameters<typeof enforceWorkspaceLimit>[0]) =>
    enforceWorkspaceLimit(params, { resolveTier: async () => tier });
}

/** Simulates the shared getOwnedWorkspaceCount's row-then-exclude
 *  semantics via the real, already-tested pure helper, so this spec
 *  exercises the actual exclusion logic rather than re-describing it. */
function ownedCountFromRows(rows: Array<{ orgId: string }>) {
  return async (_userId: string, excludeOrgId?: string | null) =>
    countOwnedWorkspacesFromRows(rows, excludeOrgId);
}

describe("ensureWorkspaceCreationBillingForUser — the MCP-path regression", () => {
  test("REGRESSION: a brand-new user (own primary org only, tier inactive) is ALLOWED their first workspace", async () => {
    const user = billingUser({ orgId: "org-primary" });
    // Signup stamped organizations.ownerId on the primary org; the SHARED
    // counter's row set reflects that shape (org_members owner row for
    // the primary org — or none at all, per both signup paths today).
    const deps: EnsureWorkspaceCreationBillingDeps = {
      getOwnedWorkspaceCount: ownedCountFromRows([{ orgId: "org-primary" }]),
      enforceWorkspaceLimit: withTier("inactive"),
    };

    await assert.doesNotReject(
      () => ensureWorkspaceCreationBillingForUser(user, deps),
      "the operator's own primary org must never count against their first-workspace-free cap",
    );
  });

  test("their SECOND workspace via the MCP path is still denied", async () => {
    const user = billingUser({ orgId: "org-primary" });
    const deps: EnsureWorkspaceCreationBillingDeps = {
      // Primary org + one real tenant workspace already owned.
      getOwnedWorkspaceCount: ownedCountFromRows([
        { orgId: "org-primary" },
        { orgId: "org-tenant-1" },
      ]),
      enforceWorkspaceLimit: withTier("inactive"),
    };

    await assert.rejects(
      () => ensureWorkspaceCreationBillingForUser(user, deps),
      /Each additional workspace requires a paid tier/,
    );
  });

  test("a paying tier (builder, unlimited per the catalog) is unaffected — allows many", async () => {
    const user = billingUser({ orgId: "org-primary" });
    const deps: EnsureWorkspaceCreationBillingDeps = {
      getOwnedWorkspaceCount: ownedCountFromRows([
        { orgId: "org-primary" },
        ...Array.from({ length: 20 }, (_, i) => ({ orgId: `org-tenant-${i}` })),
      ]),
      enforceWorkspaceLimit: withTier("builder"),
    };

    await assert.doesNotReject(() => ensureWorkspaceCreationBillingForUser(user, deps));
  });

  test("a paying tier (managed, cap 1 per the catalog) still blocks the second workspace", async () => {
    const user = billingUser({ orgId: "org-primary" });
    const deps: EnsureWorkspaceCreationBillingDeps = {
      getOwnedWorkspaceCount: ownedCountFromRows([
        { orgId: "org-primary" },
        { orgId: "org-tenant-1" },
      ]),
      enforceWorkspaceLimit: withTier("managed"),
    };

    await assert.rejects(() => ensureWorkspaceCreationBillingForUser(user, deps));
  });

  test("the operator's own primary org never counts, on the password-signup shape (excludeOrgId passed through)", async () => {
    const user = billingUser({ orgId: "org-primary-pw" });
    let capturedExcludeOrgId: string | null | undefined;
    const deps: EnsureWorkspaceCreationBillingDeps = {
      getOwnedWorkspaceCount: async (_userId, excludeOrgId) => {
        capturedExcludeOrgId = excludeOrgId;
        return countOwnedWorkspacesFromRows([{ orgId: "org-primary-pw" }], excludeOrgId);
      },
      enforceWorkspaceLimit: withTier("inactive"),
    };

    await assert.doesNotReject(() => ensureWorkspaceCreationBillingForUser(user, deps));
    assert.equal(capturedExcludeOrgId, "org-primary-pw", "must pass user.orgId as excludeOrgId");
  });

  test("the operator's own primary org never counts, on the OAuth/magic-link shape (excludeOrgId passed through)", async () => {
    const user = billingUser({ orgId: "org-primary-oauth" });
    let capturedExcludeOrgId: string | null | undefined;
    const deps: EnsureWorkspaceCreationBillingDeps = {
      getOwnedWorkspaceCount: async (_userId, excludeOrgId) => {
        capturedExcludeOrgId = excludeOrgId;
        return countOwnedWorkspacesFromRows([{ orgId: "org-primary-oauth" }], excludeOrgId);
      },
      enforceWorkspaceLimit: withTier("inactive"),
    };

    await assert.doesNotReject(() => ensureWorkspaceCreationBillingForUser(user, deps));
    assert.equal(capturedExcludeOrgId, "org-primary-oauth", "must pass user.orgId as excludeOrgId");
  });
});
