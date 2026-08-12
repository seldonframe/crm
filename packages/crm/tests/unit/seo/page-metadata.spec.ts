// buildPageMetadata — the small reusable SEO/GEO metadata helper (the builder
// surface, and any future page, gets per-page Metadata cheaply). These tests pin
// the shape every page depends on: a canonical, an optional Markdown-twin
// alternate (the GEO discoverability hook), and an OpenGraph block that defaults
// its title/description from the page's so a page can pass one set of copy and
// get a coherent <head>. The contract mirrors the hand-rolled blocks already in
// the (public) route group (ai-agents / marketplace), now factored to one place.

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { buildPageMetadata } from "../../../src/lib/seo/page-metadata";
import { getGuide } from "../../../src/lib/seo/guides";
import { renderGuideMarkdown } from "../../../src/lib/seo/guide-markdown";
import * as guidePageModule from "../../../src/app/(public)/guides/[slug]/page";

const generateGuideMetadata = (
  guidePageModule as unknown as {
    generateMetadata: (input: { params: Promise<{ slug: string }> }) => Promise<import("next").Metadata>;
  }
).generateMetadata;

describe("buildPageMetadata", () => {
  test("sets the title and description verbatim", () => {
    const m = buildPageMetadata({
      path: "/build",
      title: "Build & sell an AI agent",
      description: "Do it from your IDE.",
    });
    assert.equal(m.title, "Build & sell an AI agent");
    assert.equal(m.description, "Do it from your IDE.");
  });

  test("sets a canonical from the path", () => {
    const m = buildPageMetadata({ path: "/build", title: "T", description: "D" });
    assert.equal(m.alternates?.canonical, "/build");
  });

  test("normalizes a path with no leading slash to an absolute-from-root canonical", () => {
    const m = buildPageMetadata({ path: "build/keys", title: "T", description: "D" });
    assert.equal(m.alternates?.canonical, "/build/keys");
  });

  test("advertises a Markdown twin alternate when markdownPath is given", () => {
    const m = buildPageMetadata({
      path: "/build",
      title: "T",
      description: "D",
      markdownPath: "/build.md",
    });
    assert.deepEqual(m.alternates?.types, { "text/markdown": "/build.md" });
  });

  test("omits the Markdown alternate entirely when no markdownPath is given", () => {
    const m = buildPageMetadata({ path: "/build/keys", title: "T", description: "D" });
    // No types key at all (not an empty object) — pages without a twin shouldn't
    // advertise one.
    assert.equal(m.alternates?.types, undefined);
  });

  test("builds an OpenGraph block that defaults title/description from the page and is a website at the path", () => {
    const m = buildPageMetadata({
      path: "/build",
      title: "Page Title",
      description: "Page Desc",
    });
    // Next's `openGraph` input is a broad union; read the resolved fields as a
    // record (the route serializes them flat).
    const og = m.openGraph as Record<string, unknown> | undefined;
    assert.equal(og?.url, "/build");
    assert.equal(og?.type, "website");
    assert.equal(og?.title, "Page Title");
    assert.equal(og?.description, "Page Desc");
  });

  test("lets OpenGraph title/description be overridden independently of the <title>", () => {
    const m = buildPageMetadata({
      path: "/build",
      title: "SEO Title | SeldonFrame",
      description: "Page Desc",
      ogTitle: "Share Title",
      ogDescription: "Share Desc",
    });
    const og = m.openGraph as Record<string, unknown> | undefined;
    // The browser-tab/SEO title keeps its suffix…
    assert.equal(m.title, "SEO Title | SeldonFrame");
    // …while the social card uses the cleaner override.
    assert.equal(og?.title, "Share Title");
    assert.equal(og?.description, "Share Desc");
  });
});

describe("canonical AI front office guide publication", () => {
  const slugs = [
    "what-is-an-ai-front-office",
    "ai-front-office-examples",
    "ai-front-office-software-for-agencies",
  ] as const;

  test("each new guide has unique metadata and a canonical Markdown alternate", async () => {
    const metadata = await Promise.all(
      slugs.map((slug) => generateGuideMetadata({ params: Promise.resolve({ slug }) })),
    );

    assert.equal(new Set(metadata.map((item) => String(item.title))).size, slugs.length);
    assert.equal(new Set(metadata.map((item) => String(item.description))).size, slugs.length);

    for (const [index, slug] of slugs.entries()) {
      const item = metadata[index];
      assert.equal(item.alternates?.canonical, `/guides/${slug}`);
      assert.deepEqual(item.alternates?.types, {
        "text/markdown": `/guides/${slug}.md`,
      });
      assert.equal(getGuide(slug).title, item.title);
    }
  });

  test("Markdown twins preserve the HTML canonical and never render an unknown guide", () => {
    for (const slug of slugs) {
      const markdown = renderGuideMarkdown(slug);
      assert.match(markdown, new RegExp(`HTML version: https://www\\.seldonframe\\.com/guides/${slug}(?:\\r?\\n|$)`));
      assert.ok(markdown.length > 500);
      assert.doesNotMatch(markdown, /\b(?:undefined|null)\b/);
    }
  });
});
