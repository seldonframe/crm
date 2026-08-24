// 2026-08-23 — fix for the domain-unlock 409 ("Tier 'workspace' is not
// available for new checkout"): the old button hardcoded the frozen
// "workspace" tier from 2026-07-04 and the 2026-07-08 ladder wave missed
// repointing it, so every click 409'd.
//
// v2, same day (Max's first-principles call): a new user unlocking a
// domain should SEE the paid ladder and pick, not be direct-checkout'd
// into one guessed tier. The CTA opens domain-plan-chooser.tsx offering
// Managed $49 FIRST (zero-setup, runs on SF keys, custom domain
// included — the honest first ask for a fresh operator with no API key),
// then the agency tiers for client work.
//
// This module stays the single audit surface: every tier the chooser can
// POST to /api/stripe/checkout is listed here, and
// tests/unit/billing/checkout-tier-gate.spec.ts imports it directly so
// the UI can never drift onto a non-sellable tier again.

import type { TierId } from "@/lib/billing/plans";

/** Order matters — rendered in this order in the chooser dialog. */
export const DOMAIN_UNLOCK_TIERS: readonly TierId[] = [
  "managed",
  "agency_starter",
  "agency_growth",
  "agency_scale",
];
