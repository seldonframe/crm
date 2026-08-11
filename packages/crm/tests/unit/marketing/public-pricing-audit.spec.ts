import test from "node:test";
import assert from "node:assert/strict";

import { auditPublicPricingText } from "../../../src/lib/marketing/public-pricing-audit";

test("allows the Builder price when it is scoped to an owned business", () => {
  assert.equal(
    auditPublicPricingText(
      "SeldonFrame is $29/mo with unlimited workspaces for your own businesses.",
    ).ok,
    true,
  );
});

test("allows an Agency plan claim", () => {
  assert.equal(
    auditPublicPricingText("Agency Starter is $99/mo for 10 client workspaces.").ok,
    true,
  );
});

test("rejects Builder pricing paired with white-label delivery", () => {
  const result = auditPublicPricingText(
    "SeldonFrame is $29/mo with white-label client portals.",
  );

  assert.equal(result.ok, false);
  assert.ok(result.reasons.length > 0);
});

test("allows an explicit Builder and Agency distinction", () => {
  assert.equal(
    auditPublicPricingText(
      "$29 Builder for your own businesses; Agency Starter starts at $99 for client sub-accounts.",
    ).ok,
    true,
  );
});

test("uses the nearby context window across sentence punctuation", () => {
  assert.equal(
    auditPublicPricingText(
      "SeldonFrame Builder is $29/mo. Agency Starter starts at $99/mo for client workspaces.",
    ).ok,
    true,
  );
  assert.equal(
    auditPublicPricingText(
      "SeldonFrame Builder is $29/mo. White-label client portals are included.",
    ).ok,
    false,
  );
});

test("ignores competitor-only pricing claims", () => {
  assert.equal(
    auditPublicPricingText("GoHighLevel Agency Pro costs $497/mo.").ok,
    true,
  );
});

test("recognizes long-form Builder price tokens", () => {
  assert.equal(
    auditPublicPricingText("Builder costs 29 dollars for a business you operate.").ok,
    true,
  );
  assert.equal(
    auditPublicPricingText("SeldonFrame starts at twenty-nine dollars with white-label resale.").ok,
    false,
  );
});

test("allows an explicit exclusion boundary", () => {
  assert.equal(
    auditPublicPricingText(
      "Builder is $29/mo and does not include client sub-accounts or white-label resale.",
    ).ok,
    true,
  );
});
