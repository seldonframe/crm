// packages/crm/tests/unit/billing/webhook-max-workspaces.spec.ts
//
// 2026-08-07 — the LAST copy of the retired workspace-cap table.
//
// #182 (0d773bcab) killed the hardcoded table in lib/billing/limits.ts by
// deriving from the plans catalog (`getPlan(tier).limits.maxOrgs`); #183
// (e293f2f3c) killed the second copy in lib/billing/orgs.ts. A THIRD copy
// survived in the Stripe webhook, written three times verbatim:
//
//     const maxWorkspaces = tier === "agency" ? -1 : tier === "workspace" ? 1 : 0;
//
// It never learned the 2026-07-08 pricing ladder, so every currently
// sellable tier — builder / managed / agency_starter / agency_growth /
// agency_scale — fell into the `: 0` branch and persisted a cap of 0 into
// `organizations.subscription.maxWorkspaces`, while the real gate
// (enforceWorkspaceLimit → maxFullWorkspacesForTier) read builder and the
// agency_* ladder as UNLIMITED from the catalog.
//
// This spec pins the invariant that closes the class: the persisted value
// is the catalog value, for every tier, and the -1 unlimited sentinel
// survives the round trip into JSONB and back out to its consumer.
//
// Run:
//   node --import tsx --test tests/unit/billing/webhook-max-workspaces.spec.ts

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { maxFullWorkspacesForTier } from "@/lib/billing/limits";
import { getPlan } from "@/lib/billing/plans";
import { getMaxOrgs } from "@/lib/billing/entitlements";
import { TIER_FEATURES, type BillingTier } from "@/lib/billing/features";

const WEBHOOK_SRC = readFileSync(
  fileURLToPath(new URL("../../../src/app/api/stripe/webhook/route.ts", import.meta.url)),
  "utf8",
);

/** What the retired table persisted, per tier — the BEFORE column. Kept
 *  literal (not re-derived) so this table can never silently agree with a
 *  regression that reintroduces it. */
const RETIRED_TABLE: Record<BillingTier, number> = {
  inactive: 0,
  builder: 0,
  managed: 0,
  agency_starter: 0,
  agency_growth: 0,
  agency_scale: 0,
  workspace: 1,
  agency: -1,
};

/** What the catalog says the cap actually is — the AFTER column.
 *  `inactive` is not a sellable plan (no catalog entry); its 1 is the
 *  "first workspace is free forever" allowance the gate grants. */
const CATALOG_CAP: Record<BillingTier, number> = {
  inactive: 1,
  builder: -1,
  managed: 1,
  agency_starter: -1,
  agency_growth: -1,
  agency_scale: -1,
  workspace: 1,
  agency: -1,
};

const ALL_TIERS = Object.keys(TIER_FEATURES) as BillingTier[];

describe("webhook workspace cap — the catalog is the only source", () => {
  test("every tier in TIER_FEATURES is covered by this spec's before/after table", () => {
    assert.deepEqual(
      [...ALL_TIERS].sort(),
      (Object.keys(CATALOG_CAP) as BillingTier[]).sort(),
      "a new tier was added without deciding what maxWorkspaces it persists",
    );
  });

  for (const tier of ALL_TIERS) {
    test(`${tier}: persists the catalog cap ${CATALOG_CAP[tier]} (the retired table said ${RETIRED_TABLE[tier]})`, () => {
      assert.equal(maxFullWorkspacesForTier(tier), CATALOG_CAP[tier]);
    });
  }

  test("every sellable tier's cap is read straight off plans.ts, not restated", () => {
    for (const tier of ALL_TIERS) {
      const plan = getPlan(tier);
      if (!plan) {
        // Only `inactive` has no catalog entry.
        assert.equal(tier, "inactive");
        continue;
      }
      assert.equal(
        maxFullWorkspacesForTier(tier),
        plan.limits.maxOrgs,
        `${tier} must equal getPlan("${tier}").limits.maxOrgs`,
      );
    }
  });

  test("the 2026-07-08 ladder tiers are no longer capped at 0 (the actual bug)", () => {
    for (const tier of ["builder", "agency_starter", "agency_growth", "agency_scale"] as const) {
      assert.equal(RETIRED_TABLE[tier], 0, "precondition: the retired table capped this tier at 0");
      assert.equal(maxFullWorkspacesForTier(tier), -1, `${tier} is unlimited per the catalog`);
    }
    // managed is a real cap of 1, not unlimited — the retired table got it
    // wrong in the other direction (0).
    assert.equal(RETIRED_TABLE.managed, 0);
    assert.equal(maxFullWorkspacesForTier("managed"), 1);
  });

  test("no PAYING tier that the retired table got right is changed by the fix", () => {
    // The two tiers the retired table happened to know about must persist
    // exactly what they persisted before — this fix is not allowed to move
    // a grandfathered subscriber's cap.
    assert.equal(maxFullWorkspacesForTier("workspace"), RETIRED_TABLE.workspace);
    assert.equal(maxFullWorkspacesForTier("agency"), RETIRED_TABLE.agency);
  });
});

describe("the unlimited sentinel round-trips", () => {
  test("unlimited is the integer -1, never Infinity (JSONB must survive JSON.stringify)", () => {
    const cap = maxFullWorkspacesForTier("builder");
    assert.equal(cap, -1);
    assert.ok(Number.isInteger(cap), "the persisted cap must be a finite integer");
    // Number.POSITIVE_INFINITY serializes to null — persisting it would
    // erase the cap entirely on the way into organizations.subscription.
    assert.equal(JSON.stringify({ maxWorkspaces: cap }), '{"maxWorkspaces":-1}');
    assert.equal(
      JSON.parse(JSON.stringify({ maxWorkspaces: cap })).maxWorkspaces,
      -1,
      "the sentinel must survive a JSONB round trip unchanged",
    );
    assert.equal(JSON.stringify({ x: Number.POSITIVE_INFINITY }), '{"x":null}');
  });

  test("-1 is read back as unlimited by its consumer (entitlements.getMaxOrgs)", () => {
    for (const tier of ["builder", "agency", "agency_starter", "agency_growth", "agency_scale"] as const) {
      assert.equal(maxFullWorkspacesForTier(tier), -1);
      assert.equal(getMaxOrgs(getPlan(tier) ?? null), Number.POSITIVE_INFINITY, tier);
    }
  });

  test("a finite cap is read back verbatim, not turned into a sentinel", () => {
    for (const tier of ["managed", "workspace"] as const) {
      assert.equal(maxFullWorkspacesForTier(tier), 1);
      assert.equal(getMaxOrgs(getPlan(tier) ?? null), 1, tier);
    }
  });
});

describe("stripe webhook route — the retired table is gone", () => {
  test("no copy of the `tier === \"agency\" ? -1 : tier === \"workspace\" ? 1 : 0` table survives", () => {
    assert.ok(
      !/tier === "agency" \? -1/.test(WEBHOOK_SRC),
      "the hardcoded workspace-cap table is back in src/app/api/stripe/webhook/route.ts",
    );
  });

  test("every maxWorkspaces value written by the route is derived from maxFullWorkspacesForTier", () => {
    assert.ok(
      /from "@\/lib\/billing\/limits"/.test(WEBHOOK_SRC),
      "the route must import the catalog-derived cap helper",
    );
    // Every assignment of the local `maxWorkspaces` (and the inactive
    // literal in the cancel branch) must call the helper. Count the
    // assignment sites and require each one to be a helper call.
    const assignments = WEBHOOK_SRC.match(/maxWorkspaces(?::| =|\s*=)\s*[^,\n]+/g) ?? [];
    const valueSites = assignments.filter(
      (line) => !/maxWorkspaces,/.test(line) && !/previousMaxWorkspaces|nextMaxWorkspaces/.test(line),
    );
    assert.ok(valueSites.length >= 3, `expected the route to set maxWorkspaces, found ${valueSites.length}`);
    for (const site of valueSites) {
      assert.match(
        site,
        /maxFullWorkspacesForTier\(/,
        `a maxWorkspaces value is not catalog-derived: ${site}`,
      );
    }
  });
});
