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

test("does not borrow an own-business statement from a nearby sentence", () => {
  const result = auditPublicPricingText(
    "SeldonFrame is $29/mo with white-label client portals. Our own business uses a separate workspace.",
  );

  assert.equal(result.ok, false);
});

test("does not borrow an Agency price from an unrelated nearby sentence", () => {
  const result = auditPublicPricingText(
    "SeldonFrame is $29/mo with white-label client portals. Separately, another Agency Pro product costs $99/mo.",
  );

  assert.equal(result.ok, false);
});

test("does not borrow an exclusion from a separate Builder sentence", () => {
  const result = auditPublicPricingText(
    "SeldonFrame is $29/mo with client sub-accounts. Builder does not include white-label resale.",
  );

  assert.equal(result.ok, false);
});

test("rejects an own-business qualification followed by contradictory resale copy", () => {
  const result = auditPublicPricingText(
    "Builder costs 29 dollars for a business you own. It includes white-label client portals.",
  );

  assert.equal(result.ok, false);
});

test("does not allow contradictory resale after a Builder exclusion", () => {
  for (const copy of [
    "Builder is $29/mo and does not include white-label resale, but client sub-accounts are available.",
    "Builder is $29/mo and does not include client sub-accounts; agency resale is available.",
    "Builder is $29/mo with no white-label; client portals are available separately.",
    "Builder is $29/mo and does not include white-label resale, client sub-accounts are available.",
    "Builder is $29/mo and does not include client sub-accounts, white-label portals are included.",
  ]) {
    assert.equal(auditPublicPricingText(copy).ok, false, copy);
  }

  for (const copy of [
    "Builder is $29/mo and does not include white-label resale or client sub-accounts.",
    "Builder is $29/mo and does not include client sub-accounts, white-label resale, or agency resale.",
  ]) {
    assert.equal(auditPublicPricingText(copy).ok, true, copy);
  }
});

test("does not let a Builder clause promise resale beside an Agency price", () => {
  assert.equal(
    auditPublicPricingText("Builder is $29/mo with white-label client sub-accounts; Agency Starter is $99/mo.").ok,
    false,
  );
});

test("does not let unrelated own-business or Agency copy rescue a Builder resale claim", () => {
  for (const copy of [
    "SeldonFrame is $29/mo with white-label client portals. This is for your own workspace. Agency Starter starts at $99/mo.",
    "Builder is $29/mo for your own business with white-label client portals.",
    "SeldonFrame is $29/mo with client sub-accounts. Agency Starter starts at $99/mo. Our own workspace is separate.",
  ]) {
    assert.equal(auditPublicPricingText(copy).ok, false, copy);
  }
});

test("ignores competitor pricing even when SeldonFrame follows", () => {
  assert.equal(
    auditPublicPricingText("GoHighLevel is 29 dollars with white-label client portals. SeldonFrame is an alternative for agencies.").ok,
    true,
  );
});
