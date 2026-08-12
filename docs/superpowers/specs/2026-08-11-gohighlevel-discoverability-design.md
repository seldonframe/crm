# GoHighLevel Article Discoverability Design

**Date:** 2026-08-11
**Status:** Approved design
**Branch:** `codex/ghl-discoverability`

## Objective

Make SeldonFrame's ten GoHighLevel diagnostic articles easy to find for both human visitors and search, answer, and generative-engine crawlers.

The articles are already published, canonicalized, available as Markdown, and included in the sitemap. The remaining problem is discovery architecture: the GoHighLevel cluster appears late on a long `/guides` page, the main marketing Resources menu does not link to Guides, high-intent GoHighLevel surfaces do not present the diagnostic set as a coherent path, and each diagnostic article offers no structured path to its siblings.

Success means:

- a visitor can reach the diagnostic collection within two clicks from the homepage;
- the collection has one durable, descriptive URL that can rank and be cited independently;
- all ten articles receive contextual links from the collection and relevant commercial-intent pages;
- every diagnostic article links readers to additional diagnostics without creating a site-wide wall of links;
- crawlers receive consistent HTML, Markdown, structured data, and sitemap discovery paths.

## Canonical collection

Create a server-rendered collection at:

- HTML: `/guides/gohighlevel`
- Markdown: `/guides/gohighlevel.md`

The static collection route takes precedence over the existing dynamic `/guides/[slug]` route. There is no article with the exact slug `gohighlevel`, so this introduces no canonical collision.

The page title should lead with the reader's task, not SeldonFrame's product pitch: **GoHighLevel Agency Troubleshooting and Migration Guides**. Its answer-first introduction should explain that the collection helps an agency diagnose whether a problem belongs to HighLevel, its own configuration, an external provider, or its business model before deciding whether to fix, migrate, or keep the current stack.

The collection should organize existing guides into four intent groups:

1. **Diagnose an operating problem** — the ten newly published complaint-led guides.
2. **Understand pricing and agency economics** — existing pricing, hidden-fee, AI Employee, SaaS Mode, and agency-margin guides.
3. **Compare the alternatives honestly** — existing SeldonFrame, HubSpot, solopreneur, and broad alternatives guides.
4. **Plan migration, ownership, and portability** — existing switching and replacement guides plus the export and sub-account ownership diagnostics.

The same guide registry remains the source of titles and descriptions. A small curated discovery module should contain only ordered slugs and group metadata; it must resolve each slug through `getGuide` so stale or duplicate links fail during tests/build rather than silently rendering.

## Human discovery paths

### Main marketing navigation

Add two server-visible entries to the existing Resources menu:

- `Guides` → `/guides`
- `GoHighLevel diagnostics` → `/guides/gohighlevel`

The Resources links already remain in server-rendered HTML while visually closed. Preserve that behavior so the new links help both people and crawlers without adding another top-level navigation item.

### Guides hub

Add a prominent feature block immediately below the `/guides` introduction and before the generic cluster list. It should summarize the diagnostic collection, name the core problem types, and link to `/guides/gohighlevel` with a descriptive anchor.

Do not duplicate ten full cards above the fold. The feature block advertises one coherent collection; the existing GoHighLevel cluster remains available in the normal cluster list below.

### High-intent GoHighLevel surfaces

Add one contextual collection link to each of these existing pages:

- `/alternative-to-gohighlevel`
- `/tools/gohighlevel-cost-calculator`

The link should be presented as troubleshooting evidence for readers who are evaluating cost or alternatives, not as an unrelated promotional banner. Existing conversion calls to action remain primary.

### Diagnostic article mesh

For only the ten diagnostic guides, render a **More GoHighLevel diagnostics** section after the article body/FAQs and before the final navigation line. Show three sibling articles selected deterministically from the curated diagnostic order, excluding the current page, plus a link to the full collection.

This keeps every article connected while avoiding ten repetitive links on every page. Existing inline editorial links and tool/alternative links remain unchanged.

## Crawler and answer-engine contract

The HTML collection must include:

- a canonical URL for `/guides/gohighlevel`;
- a `text/markdown` alternate pointing to `/guides/gohighlevel.md`;
- `CollectionPage` JSON-LD describing the collection;
- an `ItemList` JSON-LD whose items point to the canonical article URLs in visible order;
- `BreadcrumbList` JSON-LD for Home → Guides → GoHighLevel;
- descriptive headings and visible anchor text matching each intent group.

The Markdown collection must be generated from the same curated groups and guide registry as the HTML page. It should include:

- the collection title and answer-first introduction;
- grouped article titles, canonical URLs, and descriptions;
- links to the GoHighLevel comparison and cost calculator;
- a short factual boundary explaining that SeldonFrame is a focused AI-front-office alternative, not a replacement for every HighLevel funnel, campaign, snapshot, or ecosystem workflow.

Add the HTML collection explicitly to `sitemap.ts` with weekly change frequency and a priority at least equal to the main Guides hub. Individual articles remain in the existing guide loop. The Markdown alternate does not need a separate sitemap URL because it is advertised from the canonical HTML page.

No new article claims, complaint prevalence estimates, or competitor facts are introduced in this slice. The existing source-backed articles provide the information gain; this work improves retrieval and navigation only.

## Data and component boundaries

Use one dependency-light discovery module under `packages/crm/src/lib/seo/` to own:

- the exact ten diagnostic slugs;
- the four collection groups and their ordered slugs;
- validation/resolution helpers;
- deterministic sibling selection for a diagnostic article;
- Markdown collection rendering, either directly or through a focused renderer module.

The module must not import React or Next.js. Server components consume its resolved data. This gives tests a pure interface and prevents the HTML and Markdown collections from drifting.

UI changes should reuse the existing marketing/guide visual language and server components. Do not add client state, a new search system, a CMS, or a second guide registry.

## Testing strategy

Implementation follows test-first development.

### Pure discovery tests

Add focused unit tests that fail before production code exists and prove:

- the diagnostic set contains exactly the ten published slugs with no duplicates;
- every collection slug resolves through the guide registry;
- every diagnostic guide appears in the `Diagnose an operating problem` group;
- sibling selection excludes the current guide, returns three unique diagnostics, and is deterministic;
- no collection group contains duplicate slugs;
- the Markdown collection contains all ten canonical URLs and the four intent headings.

### Render and link tests

Add source/render assertions proving:

- `/guides/gohighlevel` emits canonical, Markdown alternate, CollectionPage, ItemList, and BreadcrumbList metadata/schema;
- `/guides` links prominently to the collection before the generic cluster grid;
- the main Resources menu includes both Guides and GoHighLevel diagnostics as server-visible links;
- the alternative page and GoHighLevel calculator each link to the collection;
- each diagnostic article renders the sibling section and the full-collection link;
- a non-diagnostic guide does not render the diagnostic sibling section;
- `sitemap.ts` includes the collection URL.

Prefer behavior or rendered-output assertions over snapshots and avoid tests coupled to incidental CSS.

### Repository gate

After the focused tests pass, run:

- relevant SEO/navigation unit tests;
- `node_modules/.bin/tsc -p tsconfig.json --noEmit` from `packages/crm`;
- `bash scripts/check-use-server.sh src`;
- `node scripts/check-migrations-journaled.mjs`;
- `pnpm build` from the repository root.

The slice adds no migration, dependency, authentication, billing, or runtime workflow changes.

## Production verification

After merge, push, and deployment are separately authorized, verify:

- `/guides/gohighlevel` returns HTTP 200 and contains links to all ten diagnostics;
- `/guides/gohighlevel.md` returns HTTP 200 with `text/markdown`;
- the canonical and Markdown alternate tags are present;
- all ten diagnostic pages still return HTTP 200 and expose sibling links;
- `/guides`, `/alternative-to-gohighlevel`, and `/tools/gohighlevel-cost-calculator` link to the collection;
- the live sitemap contains `/guides/gohighlevel`;
- core production smoke routes remain green.

## Non-goals

- Rewriting or expanding the ten articles.
- Adding new complaint research, unverifiable claims, or Reddit quotations.
- Placing all ten article links in the global footer or primary top-level navigation.
- Building site-wide search, faceted filtering, personalization, or analytics instrumentation.
- Changing current pricing or product-positioning boundaries.
- Automatically deploying as part of implementation; deployment remains an explicit follow-up action.
