import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import GuidesHubPage from "@/app/(public)/guides/page";
import { MarketingNav } from "@/components/landing/marketing-nav";
import { GuidePage } from "@/components/seo/guide-page";
import {
  GOHIGHLEVEL_COLLECTION_PATH,
  GOHIGHLEVEL_DIAGNOSTIC_SLUGS,
} from "@/lib/seo/gohighlevel-discovery";

describe("GoHighLevel guide discovery entry points", () => {
  test("features the collection on the guides hub", () => {
    const html = renderToStaticMarkup(<GuidesHubPage />);

    assert.match(html, new RegExp(`href="${GOHIGHLEVEL_COLLECTION_PATH}"`));
    assert.match(html, /GoHighLevel agency field guide/);
  });

  test("adds both general guides and GoHighLevel diagnostics to Resources", () => {
    const html = renderToStaticMarkup(<MarketingNav />);

    assert.match(html, /href="\/guides"[^>]*>Guides</);
    assert.match(html, new RegExp(`href="${GOHIGHLEVEL_COLLECTION_PATH}"[^>]*>GoHighLevel diagnostics`));
  });

  test("meshes each diagnostic article to three sibling diagnostics and the collection", () => {
    for (const slug of GOHIGHLEVEL_DIAGNOSTIC_SLUGS) {
      const html = renderToStaticMarkup(<GuidePage slug={slug} />);
      const siblingLinks = html.match(/data-ghl-diagnostic-sibling="true"/g) ?? [];

      assert.equal(siblingLinks.length, 3, slug);
      assert.match(html, new RegExp(`href="${GOHIGHLEVEL_COLLECTION_PATH}"`), slug);
      assert.doesNotMatch(html, new RegExp(`data-ghl-diagnostic-sibling="true"[^>]*href="/guides/${slug}"`), slug);
    }
  });

  test("does not inject the diagnostic mesh into unrelated guides", () => {
    const html = renderToStaticMarkup(<GuidePage slug="what-is-speed-to-lead" />);

    assert.doesNotMatch(html, /data-ghl-diagnostic-sibling="true"/);
  });
});
