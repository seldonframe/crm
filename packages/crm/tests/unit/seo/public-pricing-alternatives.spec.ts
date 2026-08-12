import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { AlternativePage } from "../../../src/components/seo/alternative-page";
import { SeldonFrameVsPage } from "../../../src/components/seo/seldonframe-vs-page";
import { COMPETITORS, getCompetitor, pairAudience, sfPriceAnchor, sfPriceAnchorMonthlyPrice } from "../../../src/lib/seo/alternative-pages";
import { renderVsMarkdown } from "../../../src/lib/seo/alternative-markdown";
import { VS_PAIRS, vsSlug } from "../../../src/lib/seo/alternative-pages-extras";
import { auditPublicPricingText } from "../../../src/lib/marketing/public-pricing-audit";

function renderSoftwareApplicationJsonLd(html: string): Record<string, unknown> {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const script = scripts
    .map((match) => JSON.parse(match[1]) as Record<string, unknown>)
    .find((value) => value["@type"] === "SoftwareApplication");
  assert.ok(script, "comparison page is missing SoftwareApplication JSON-LD");
  return script;
}

test("audience anchors state the Builder boundary and the Agency entry price", () => {
  const agency = sfPriceAnchor("agency");
  assert.match(agency, /Agency Starter starts at \$99\/mo for client workspaces/i);
  assert.match(agency, /Builder is \$29\/mo .*no client resale or white-label/i);
  assert.match(sfPriceAnchor("solo"), /Builder is \$29\/mo .*no client resale or white-label/i);
  assert.match(sfPriceAnchor("mixed"), /Builder is \$29\/mo .*no client resale or white-label/i);
  assert.match(sfPriceAnchor("mixed"), /Agency plans start at \$99\/mo for client workspaces and white-label delivery/i);
  for (const audience of ["agency", "solo", "mixed"] as const) {
    assert.equal(auditPublicPricingText(sfPriceAnchor(audience)).ok, true, `${audience} anchor failed public pricing audit`);
  }
});

for (const c of COMPETITORS) {
  test(`${c.slug} alternative page uses its audience-aware structured-data offer`, () => {
    const html = renderToStaticMarkup(createElement(AlternativePage, { competitor: c }));
    const ld = renderSoftwareApplicationJsonLd(html);
    const offers = ld.offers as Record<string, unknown>;
    assert.equal(offers.price, String(sfPriceAnchorMonthlyPrice(c.audience)));
    assert.equal(offers.name, c.audience === "agency" ? "Agency Starter" : "Builder");
    assert.equal(offers.description, sfPriceAnchor(c.audience));
    assert.match(html, new RegExp(escapeRegExp(sfPriceAnchor(c.audience))));
  });

  test(`${c.slug} flagship comparison page uses its audience-aware structured-data offer`, () => {
    const html = renderToStaticMarkup(createElement(SeldonFrameVsPage, { competitor: c }));
    const ld = renderSoftwareApplicationJsonLd(html);
    const offers = ld.offers as Record<string, unknown>;
    assert.equal(offers.price, String(sfPriceAnchorMonthlyPrice(c.audience)));
    assert.equal(offers.name, c.audience === "agency" ? "Agency Starter" : "Builder");
    assert.equal(offers.description, sfPriceAnchor(c.audience));
    assert.match(html, new RegExp(escapeRegExp(sfPriceAnchor(c.audience))));
  });
}

for (const pair of VS_PAIRS) {
  test(`${vsSlug(pair)} Markdown keeps the resolved pair audience anchor explicit`, () => {
    const a = getCompetitor(pair.a);
    const b = getCompetitor(pair.b);
    const audience = pairAudience(a.audience, b.audience);
    const markdown = renderVsMarkdown(pair, a, b);
    assert.match(markdown, new RegExp(escapeRegExp(sfPriceAnchor(audience))));
    // The full document also contains competitor pricing and historical
    // comparison facts. Audit the SeldonFrame anchor itself so those
    // unrelated numbers cannot mask a regression in our audience boundary.
    assert.equal(auditPublicPricingText(sfPriceAnchor(audience)).ok, true, `${vsSlug(pair)} anchor failed public pricing audit`);
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
