// 2026-08-23 — fix for the domain-unlock 409 ("Tier 'workspace' is not
// available for new checkout"). domain-upgrade-button.tsx (2026-07-04)
// hardcoded tier:"workspace"; the 2026-07-08 pricing ladder froze that
// tier (Plan.sellable=false) and repointed pricing-shell + upgrade-modal
// but missed this button, so every domain-unlock click 409'd from Jul 8
// on. The tier now depends on workspace context:
//   - operator on their OWN workspace → "builder" ($29 — the catalog
//     grants limits.customDomain on Builder)
//   - agency operator switched INTO a client workspace →
//     "agency_starter" ($99 — client domains are the whitelabel
//     deliverable; Max's pricing call, 2026-08-23)
// Kept in a plain module (no "use client", no JSX) so
// tests/unit/billing/checkout-tier-gate.spec.ts can import the REAL
// values the button POSTs — the audit list can't drift again.

import type { TierId } from "@/lib/billing/plans";

export const DOMAIN_UNLOCK_TIER_OWN_WORKSPACE: TierId = "builder";
export const DOMAIN_UNLOCK_TIER_CLIENT_WORKSPACE: TierId = "agency_starter";

export function domainUnlockTier(isInsideClientWorkspace: boolean): TierId {
  return isInsideClientWorkspace
    ? DOMAIN_UNLOCK_TIER_CLIENT_WORKSPACE
    : DOMAIN_UNLOCK_TIER_OWN_WORKSPACE;
}
