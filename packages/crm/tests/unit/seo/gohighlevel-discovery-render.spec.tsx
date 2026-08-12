import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import GohighlevelGuidesPage, {
  metadata,
} from "@/app/(public)/guides/gohighlevel/page";
import { GET } from "@/app/guides/gohighlevel.md/route";
import {
  GOHIGHLEVEL_COLLECTION_MARKDOWN_PATH,
  GOHIGHLEVEL_COLLECTION_PATH,
  GOHIGHLEVEL_DIAGNOSTIC_SLUGS,
} from "@/lib/seo/gohighlevel-discovery";

describe("GoHighLevel guide collection routes", () => {
  test("publishes canonical metadata and a Markdown alternate", () => {
    assert.equal(metadata.alternates?.canonical, GOHIGHLEVEL_COLLECTION_PATH);
    assert.deepEqual(metadata.alternates?.types, {
      "text/markdown": GOHIGHLEVEL_COLLECTION_MARKDOWN_PATH,
    });
  });

  test("renders every diagnostic and the collection structured data", () => {
    const html = renderToStaticMarkup(<GohighlevelGuidesPage />);

    for (const slug of GOHIGHLEVEL_DIAGNOSTIC_SLUGS) {
      assert.match(html, new RegExp(`href="/guides/${slug}"`));
    }

    assert.match(html, /"@type":"CollectionPage"/);
    assert.match(html, /"@type":"ItemList"/);
    assert.match(html, /"@type":"BreadcrumbList"/);
    assert.match(html, /Diagnose an operating problem/);
    assert.match(html, /Compare the alternatives honestly/);
    assert.match(html, /\.sf-ghl-group-grid\{grid-template-columns:1fr!important\}/);
  });

  test("serves the same collection as agent-readable Markdown", async () => {
    const response = GET(new Request("https://www.seldonframe.com/guides/gohighlevel.md"));
    const markdown = await response.text();

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/markdown/);
    assert.match(
      response.headers.get("link") ?? "",
      /<https:\/\/www\.seldonframe\.com\/guides\/gohighlevel>; rel="alternate"; type="text\/html"/,
    );
    for (const slug of GOHIGHLEVEL_DIAGNOSTIC_SLUGS) {
      assert.match(markdown, new RegExp(`https://www\\.seldonframe\\.com/guides/${slug}`));
    }
  });
});
