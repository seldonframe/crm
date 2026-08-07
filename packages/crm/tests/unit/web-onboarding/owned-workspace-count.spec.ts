// packages/crm/tests/unit/web-onboarding/owned-workspace-count.spec.ts
//
// PATCHED PER PLAN CORRECTION (2026-05-16): we no longer test a parallel
// tier-limit decision helper — that machinery lives in lib/billing/limits.ts
// and is already covered there. This file only tests the small Drizzle
// helper that counts how many orgs the user owns. The result feeds the
// existing enforceWorkspaceLimit's `ownedWorkspaceCount` arg.
//
// We mock the db dependency rather than spinning up a real DB — keep this
// fully unit-testable. The shape we mock matches the actual query.
import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { countOwnedWorkspacesFromRows } from "../../../src/lib/web-onboarding/owned-workspace-count";

describe("countOwnedWorkspacesFromRows", () => {
  test("returns 0 when the user owns no orgs", () => {
    assert.equal(countOwnedWorkspacesFromRows([]), 0);
  });

  test("returns the count of rows when the user owns N orgs", () => {
    const rows = [{ orgId: "a" }, { orgId: "b" }, { orgId: "c" }];
    assert.equal(countOwnedWorkspacesFromRows(rows), 3);
  });

  test("deduplicates if the same orgId appears twice (defensive)", () => {
    const rows = [{ orgId: "a" }, { orgId: "a" }, { orgId: "b" }];
    assert.equal(countOwnedWorkspacesFromRows(rows), 2);
  });

  // 2026-08-07 — F2: the count must mean "workspaces owned as TENANTS",
  // never the operator's own primary/agency org. excludeOrgId is the
  // caller's sessionUser.primaryOrgId on BOTH signup shapes (password
  // signup via auth/actions.ts, OAuth/magic-link via auth.ts) — neither
  // path currently writes an org_members row for the user's own primary
  // org (both only stamp organizations.ownerId), so this is verified
  // defense-in-depth: if a future write path ever adds one, the operator's
  // own org must still never count against their workspace cap.
  describe("excludeOrgId — the operator's own primary/agency org never counts", () => {
    test("a user whose only 'owned' row is their own primary org counts as 0 (password-signup shape)", () => {
      const primaryOrgId = "org-primary";
      const rows = [{ orgId: primaryOrgId }];
      assert.equal(countOwnedWorkspacesFromRows(rows, primaryOrgId), 0);
    });

    test("a user whose only 'owned' row is their own primary org counts as 0 (OAuth/magic-link shape)", () => {
      // Same predicate, same exclusion — the shape of the row set is
      // identical regardless of which signup path created the org; only
      // the caller-supplied excludeOrgId (sessionUser.primaryOrgId)
      // differs per request, not per signup path.
      const primaryOrgId = "org-primary-oauth";
      const rows = [{ orgId: primaryOrgId }];
      assert.equal(countOwnedWorkspacesFromRows(rows, primaryOrgId), 0);
    });

    test("a real tenant workspace still counts once the primary org is excluded", () => {
      const primaryOrgId = "org-primary";
      const rows = [{ orgId: primaryOrgId }, { orgId: "org-tenant-1" }];
      assert.equal(countOwnedWorkspacesFromRows(rows, primaryOrgId), 1);
    });

    test("no excludeOrgId provided — behaves exactly as before (no exclusion)", () => {
      const rows = [{ orgId: "a" }, { orgId: "b" }];
      assert.equal(countOwnedWorkspacesFromRows(rows, null), 2);
      assert.equal(countOwnedWorkspacesFromRows(rows, undefined), 2);
    });
  });
});
