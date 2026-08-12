import test from "node:test";
import assert from "node:assert/strict";

import {
  AGENCY_HERO_HEADLINE,
  AGENCY_POSITIONING,
  AGENCY_PLAN_FACTS,
  AGENCY_PRICING_CLAIM,
  BUILDER_PRICING_CLAIM,
  HOSTED_AI_POLICY,
  LICENSE_LABEL,
} from "../../../src/lib/marketing/public-claims";

test("public positioning names the agency outcome", () => {
  assert.match(AGENCY_POSITIONING, /agencies/i);
  assert.match(AGENCY_POSITIONING, /AI front offices/i);
  assert.match(AGENCY_POSITIONING, /GoHighLevel/i);
  assert.match(AGENCY_HERO_HEADLINE, /front offices/i);
});
test("public plan facts match the hosted sellable ladder", () => {
  assert.deepEqual(
    AGENCY_PLAN_FACTS.map(({ id, name, priceMonthly }) => ({ id, name, priceMonthly })),
    [
      { id: "builder", name: "Builder", priceMonthly: 29 },
      { id: "managed", name: "Managed", priceMonthly: 49 },
      { id: "agency_starter", name: "Agency Starter", priceMonthly: 99 },
      { id: "agency_growth", name: "Agency Growth", priceMonthly: 199 },
      { id: "agency_scale", name: "Agency Scale", priceMonthly: 299 },
    ],
  );
});

test("public legal and AI claims are explicit", () => {
  assert.equal(LICENSE_LABEL, "AGPL-3.0");
  assert.match(HOSTED_AI_POLICY, /Managed/);
  assert.match(HOSTED_AI_POLICY, /BYOK/);
});

test("public pricing claims distinguish Builder from Agency", () => {
  assert.match(BUILDER_PRICING_CLAIM, /\$29/);
  assert.match(BUILDER_PRICING_CLAIM, /own/i);
  assert.doesNotMatch(BUILDER_PRICING_CLAIM, /white-label/i);

  assert.match(AGENCY_PRICING_CLAIM, /\$99/);
  assert.match(AGENCY_PRICING_CLAIM, /10 client/i);
  assert.match(AGENCY_PRICING_CLAIM, /white-label/i);
});
