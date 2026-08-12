import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  GOHIGHLEVEL_COLLECTION_GROUPS,
  GOHIGHLEVEL_DIAGNOSTIC_SLUGS,
  gohighlevelDiagnosticSiblings,
  isGohighlevelDiagnostic,
  renderGohighlevelCollectionMarkdown,
  resolvedGohighlevelGroups,
} from "@/lib/seo/gohighlevel-discovery";

const EXPECTED_DIAGNOSTICS = [
  "gohighlevel-client-onboarding-takes-too-long",
  "gohighlevel-agency-model-not-passive-saas",
  "gohighlevel-support-problems",
  "gohighlevel-bugs-and-outages",
  "why-gohighlevel-emails-go-to-spam",
  "gohighlevel-sms-not-delivering",
  "gohighlevel-wallets-and-rebilling",
  "gohighlevel-workflow-problems",
  "can-you-export-gohighlevel",
  "who-owns-a-gohighlevel-subaccount",
] as const;

describe("GoHighLevel guide discovery model", () => {
  test("pins the ten complaint-led diagnostics in editorial order", () => {
    assert.deepEqual(GOHIGHLEVEL_DIAGNOSTIC_SLUGS, EXPECTED_DIAGNOSTICS);
    assert.equal(new Set(GOHIGHLEVEL_DIAGNOSTIC_SLUGS).size, 10);
    for (const slug of EXPECTED_DIAGNOSTICS) assert.equal(isGohighlevelDiagnostic(slug), true);
    assert.equal(isGohighlevelDiagnostic("what-is-speed-to-lead"), false);
  });

  test("resolves four unique intent groups through the guide registry", () => {
    const groups = resolvedGohighlevelGroups();
    assert.equal(groups.length, 4);
    assert.deepEqual(groups[0].guides.map((guide) => guide.slug), EXPECTED_DIAGNOSTICS);

    for (const group of groups) {
      assert.ok(group.guides.length > 0, `${group.id}: empty group`);
      assert.equal(
        new Set(group.guides.map((guide) => guide.slug)).size,
        group.guides.length,
        `${group.id}: duplicate guide`,
      );
    }

    assert.deepEqual(
      groups.map((group) => group.heading),
      GOHIGHLEVEL_COLLECTION_GROUPS.map((group) => group.heading),
    );
  });

  test("returns three deterministic diagnostic siblings and never the current guide", () => {
    const current = EXPECTED_DIAGNOSTICS[0];
    const siblings = gohighlevelDiagnosticSiblings(current);

    assert.equal(siblings.length, 3);
    assert.equal(new Set(siblings.map((guide) => guide.slug)).size, 3);
    assert.ok(siblings.every((guide) => guide.slug !== current));
    assert.deepEqual(siblings, gohighlevelDiagnosticSiblings(current));
    assert.deepEqual(gohighlevelDiagnosticSiblings("what-is-speed-to-lead"), []);
  });

  test("renders one agent-readable Markdown collection from the same groups", () => {
    const markdown = renderGohighlevelCollectionMarkdown();

    for (const slug of EXPECTED_DIAGNOSTICS) {
      assert.match(markdown, new RegExp(`https://www\\.seldonframe\\.com/guides/${slug}`));
    }
    for (const heading of [
      "Diagnose an operating problem",
      "Understand pricing and agency economics",
      "Compare the alternatives honestly",
      "Plan migration, ownership, and portability",
    ]) {
      assert.match(markdown, new RegExp(`## ${heading}`));
    }
    assert.match(markdown, /https:\/\/www\.seldonframe\.com\/alternative-to-gohighlevel/);
    assert.match(markdown, /https:\/\/www\.seldonframe\.com\/tools\/gohighlevel-cost-calculator/);
    assert.match(markdown, /not a replacement for every HighLevel funnel, campaign, snapshot, or ecosystem workflow/i);
    assert.doesNotMatch(markdown, /\b(?:undefined|null)\b/);
  });
});
