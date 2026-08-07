// packages/crm/src/lib/web-onboarding/owned-workspace-count.ts
//
// PATCHED PER PLAN CORRECTION (2026-05-16): tiny helper that resolves the
// number of orgs a user owns, so the route handler can populate the
// existing enforceWorkspaceLimit's `ownedWorkspaceCount` arg without
// reinventing the tier-limit logic.
//
// The "owner" relationship in this codebase is via orgMembers.role === "owner".
//
// 2026-08-07 — excludeOrgId param. This count must mean "workspaces the
// user owns as TENANTS" (the thing enforceWorkspaceLimit caps), never
// the operator's own primary/agency org — that org is where they run
// their business, not a counted workspace. Neither signup path
// (auth/actions.ts password signup, auth.ts OAuth/magic-link adapter)
// currently inserts an org_members row for the primary org itself (both
// only stamp organizations.ownerId), so today this predicate already
// returns 0 for a brand-new user on both paths — verified against
// production: all 10 users created 2026-07-23..08-07 have zero
// owner-role org_members rows. The exclusion is defense-in-depth so a
// future write path that DOES add an org_members row for the primary
// org (e.g. for dashboard-listing consistency) can never silently
// re-introduce the "second workspace" off-by-one against the operator's
// own org.
import { and, eq, isNull, ne } from "drizzle-orm";
import { db } from "@/db";
import { orgMembers, organizations } from "@/db/schema";

/** Pure helper extracted for testability — dedupes by orgId (defensive),
 *  and drops `excludeOrgId` (the caller's own primary/agency org) so it
 *  never counts against their tenant-workspace cap. */
export function countOwnedWorkspacesFromRows(
  rows: Array<{ orgId: string }>,
  excludeOrgId?: string | null,
): number {
  const ids = new Set(rows.map((r) => r.orgId));
  if (excludeOrgId) ids.delete(excludeOrgId);
  return ids.size;
}

/**
 * Count orgs where this user is the owner, excluding their own
 * primary/agency org (`excludeOrgId` — pass the caller's
 * `sessionUser.primaryOrgId`). Returns 0 if the user has no
 * owner-role memberships outside that org.
 */
export async function getOwnedWorkspaceCount(
  userId: string,
  excludeOrgId?: string | null,
): Promise<number> {
  const rows = await db
    .select({ orgId: orgMembers.orgId })
    .from(orgMembers)
    // Join organizations so archived client workspaces (front-office bridge) are
    // excluded from the workspace-limit count — they must not count against the
    // builder's limit / trigger a charge.
    .innerJoin(organizations, eq(organizations.id, orgMembers.orgId))
    .where(
      and(
        eq(orgMembers.userId, userId),
        eq(orgMembers.role, "owner"),
        isNull(organizations.archivedAt),
        excludeOrgId ? ne(orgMembers.orgId, excludeOrgId) : undefined,
      ),
    );

  return countOwnedWorkspacesFromRows(rows, excludeOrgId);
}
