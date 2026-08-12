import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import GohighlevelCostCalculatorPage from "@/app/(public)/tools/gohighlevel-cost-calculator/page";
import buildSitemap from "@/app/sitemap";
import { AlternativePage } from "@/components/seo/alternative-page";
import { getCompetitor } from "@/lib/seo/alternative-pages";
import { GOHIGHLEVEL_COLLECTION_PATH } from "@/lib/seo/gohighlevel-discovery";

describe("GoHighLevel collection commercial and crawler paths", () => {
  test("links the GoHighLevel alternative page to the diagnostic field guide only for that competitor", () => {
    const gohighlevelHtml = renderToStaticMarkup(
      <AlternativePage competitor={getCompetitor("gohighlevel")} />,
    );
    const hubspotHtml = renderToStaticMarkup(
      <AlternativePage competitor={getCompetitor("hubspot")} />,
    );

    assert.match(gohighlevelHtml, new RegExp(`href="${GOHIGHLEVEL_COLLECTION_PATH}"`));
    assert.match(gohighlevelHtml, /Troubleshoot before you switch/);
    assert.doesNotMatch(hubspotHtml, new RegExp(`href="${GOHIGHLEVEL_COLLECTION_PATH}"`));
  });

  test("links the cost calculator to the diagnostic field guide", () => {
    const html = renderToStaticMarkup(<GohighlevelCostCalculatorPage />);

    assert.match(html, new RegExp(`href="${GOHIGHLEVEL_COLLECTION_PATH}"`));
    assert.match(html, /Diagnose the operating problems behind the bill/);
  });

  test("includes one explicit high-priority collection entry in the sitemap", async () => {
    const entries = await buildSitemap();
    const matching = entries.filter(
      (entry) => String(entry.url) === `https://www.seldonframe.com${GOHIGHLEVEL_COLLECTION_PATH}`,
    );

    assert.equal(matching.length, 1);
    assert.equal(matching[0].changeFrequency, "weekly");
    assert.equal(matching[0].priority, 0.8);
  });
});
