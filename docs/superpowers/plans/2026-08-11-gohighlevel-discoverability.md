# GoHighLevel Article Discoverability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a canonical GoHighLevel guide collection and a focused internal-link mesh so visitors and crawlers can discover the ten diagnostic articles within two clicks.

**Architecture:** A pure `gohighlevel-discovery.ts` module owns curated groups, diagnostic membership, sibling selection, and Markdown rendering while resolving all content through the existing guide registry. Server-rendered Next.js routes and existing marketing components consume that model; focused tests pin the data contract, metadata/schema, visible links, and sitemap entry.

**Tech Stack:** Next.js 16.2 App Router, React server components, TypeScript, Node test runner, Testing Library server rendering, Vercel-compatible route handlers.

## Global Constraints

- Do not rewrite or expand the ten diagnostic articles.
- Do not add complaint statistics, Reddit quotations, or new competitor claims.
- Keep one existing guide registry; curated discovery data contains ordered slugs only.
- Keep the discovery model free of React and Next.js imports.
- Keep the collection and all discovery links server-rendered.
- Add no dependency, migration, authentication, billing, or workflow-runtime change.
- Do not deploy automatically; deployment remains a separately authorized action.

## File map

- Create `packages/crm/src/lib/seo/gohighlevel-discovery.ts`: curated collection groups, diagnostic membership, sibling selection, Markdown renderer, and collection constants.
- Create `packages/crm/src/app/(public)/guides/gohighlevel/page.tsx`: canonical HTML collection, metadata, visible grouped links, and JSON-LD.
- Create `packages/crm/src/app/guides/gohighlevel.md/route.ts`: Markdown alternate route using the pure renderer.
- Create `packages/crm/tests/unit/seo/gohighlevel-discovery.spec.ts`: pure model and Markdown contract.
- Create `packages/crm/tests/unit/seo/gohighlevel-discovery-render.spec.tsx`: server-rendered route, guide mesh, and source-link contract.
- Modify `packages/crm/src/components/seo/guide-page.tsx`: diagnostic sibling section.
- Modify `packages/crm/src/app/(public)/guides/page.tsx`: featured collection link before the cluster grid.
- Modify `packages/crm/src/components/landing/marketing-nav.tsx`: Resources links for Guides and diagnostics.
- Modify `packages/crm/src/components/seo/alternative-page.tsx`: GoHighLevel-only diagnostic collection callout.
- Modify `packages/crm/src/app/(public)/tools/gohighlevel-cost-calculator/page.tsx`: diagnostic collection link.
- Modify `packages/crm/src/app/sitemap.ts`: explicit collection URL.
- Modify `packages/crm/tests/unit/sitemap-priority.spec.ts`: sitemap assertion.

---

### Task 1: Pure discovery model and Markdown collection

**Files:**
- Create: `packages/crm/tests/unit/seo/gohighlevel-discovery.spec.ts`
- Create: `packages/crm/src/lib/seo/gohighlevel-discovery.ts`

**Interfaces:**
- Consumes: `getGuide(slug: string): Guide` from `@/lib/seo/guides`.
- Produces: `GOHIGHLEVEL_COLLECTION_PATH`, `GOHIGHLEVEL_COLLECTION_MARKDOWN_PATH`, `GOHIGHLEVEL_DIAGNOSTIC_SLUGS`, `GOHIGHLEVEL_COLLECTION_GROUPS`, `resolvedGohighlevelGroups()`, `isGohighlevelDiagnostic(slug)`, `gohighlevelDiagnosticSiblings(slug, limit?)`, and `renderGohighlevelCollectionMarkdown()`.

- [ ] **Step 1: Write failing pure-model tests**

Create tests that import the planned exports and assert:

```ts
const expectedDiagnostics = [
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

assert.deepEqual(GOHIGHLEVEL_DIAGNOSTIC_SLUGS, expectedDiagnostics);
assert.equal(new Set(GOHIGHLEVEL_DIAGNOSTIC_SLUGS).size, 10);

const groups = resolvedGohighlevelGroups();
assert.equal(groups.length, 4);
assert.deepEqual(groups[0].guides.map((guide) => guide.slug), expectedDiagnostics);
for (const group of groups) {
  assert.equal(new Set(group.guides.map((guide) => guide.slug)).size, group.guides.length);
}

const siblings = gohighlevelDiagnosticSiblings(expectedDiagnostics[0]);
assert.equal(siblings.length, 3);
assert.ok(siblings.every((guide) => guide.slug !== expectedDiagnostics[0]));
assert.deepEqual(siblings, gohighlevelDiagnosticSiblings(expectedDiagnostics[0]));
assert.deepEqual(gohighlevelDiagnosticSiblings("what-is-speed-to-lead"), []);

const markdown = renderGohighlevelCollectionMarkdown();
for (const slug of expectedDiagnostics) {
  assert.match(markdown, new RegExp(`https://www\\.seldonframe\\.com/guides/${slug}`));
}
for (const heading of [
  "Diagnose an operating problem",
  "Understand pricing and agency economics",
  "Compare the alternatives honestly",
  "Plan migration, ownership, and portability",
]) assert.match(markdown, new RegExp(`## ${heading}`));
```

- [ ] **Step 2: Run the test and verify RED**

Run from `packages/crm`:

```bash
node --import tsx --test tests/unit/seo/gohighlevel-discovery.spec.ts
```

Expected: FAIL because `@/lib/seo/gohighlevel-discovery` does not exist.

- [ ] **Step 3: Implement the pure discovery module**

Define exact collection constants and four `as const` group records. The diagnostic group uses the ten exact slugs above. Use existing registry slugs for the remaining groups:

```ts
export const GOHIGHLEVEL_COLLECTION_PATH = "/guides/gohighlevel";
export const GOHIGHLEVEL_COLLECTION_MARKDOWN_PATH = "/guides/gohighlevel.md";
export const GOHIGHLEVEL_COLLECTION_TITLE = "GoHighLevel Agency Troubleshooting and Migration Guides";
export const GOHIGHLEVEL_COLLECTION_DESCRIPTION =
  "Diagnose GoHighLevel agency problems, understand the real cost, compare alternatives honestly, and plan migration or offboarding without guessing.";

export const GOHIGHLEVEL_COLLECTION_GROUPS = [
  { id: "diagnose", heading: "Diagnose an operating problem", description: "...", slugs: GOHIGHLEVEL_DIAGNOSTIC_SLUGS },
  { id: "economics", heading: "Understand pricing and agency economics", description: "...", slugs: ["how-much-does-gohighlevel-cost", "gohighlevel-pricing-plans-explained", "hidden-gohighlevel-fees", "is-gohighlevel-ai-employee-worth-it", "gohighlevel-saas-mode-vs-flat-pricing", "why-agencies-leave-gohighlevel"] },
  { id: "compare", heading: "Compare the alternatives honestly", description: "...", slugs: ["gohighlevel-vs-seldonframe", "gohighlevel-vs-hubspot", "best-gohighlevel-alternatives", "best-gohighlevel-alternative-for-solopreneurs", "is-gohighlevel-worth-it-for-small-business"] },
  { id: "migration", heading: "Plan migration, ownership, and portability", description: "...", slugs: ["can-you-export-gohighlevel", "who-owns-a-gohighlevel-subaccount", "how-to-switch-from-gohighlevel", "how-to-replace-gohighlevel", "do-i-need-gohighlevel"] },
] as const;
```

Resolve slugs with `getGuide`, not duplicated title/description copy. For siblings, rotate forward through the diagnostic list, exclude current, and return up to `limit = 3`. Render Markdown from the resolved group data and include the canonical HTML URL, comparison URL, calculator URL, and the honest product-fit boundary from the spec.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the command from Step 2. Expected: all tests pass with `fail 0`.

- [ ] **Step 5: Commit the model slice**

```bash
git add packages/crm/src/lib/seo/gohighlevel-discovery.ts packages/crm/tests/unit/seo/gohighlevel-discovery.spec.ts
git commit -m "feat(seo): model GoHighLevel guide discovery"
```

### Task 2: Canonical HTML and Markdown collection routes

**Files:**
- Create: `packages/crm/tests/unit/seo/gohighlevel-discovery-render.spec.tsx`
- Create: `packages/crm/src/app/(public)/guides/gohighlevel/page.tsx`
- Create: `packages/crm/src/app/guides/gohighlevel.md/route.ts`

**Interfaces:**
- Consumes all collection constants and `resolvedGohighlevelGroups()` from Task 1.
- Produces a server-rendered `GohighlevelGuidesPage`, exported `metadata`, and a Markdown `GET(req)` route.

- [ ] **Step 1: Read the repository's bundled Next.js route and metadata guidance**

Read the relevant Next 16.2 docs under `node_modules/.pnpm/next@*/node_modules/next/dist/docs/` for App Router pages, route handlers, and metadata before writing route code. Confirm the project uses `proxy.ts`; do not add middleware.

- [ ] **Step 2: Write failing route/render tests**

Import the planned page and route. Assert metadata and rendered output:

```tsx
assert.equal(metadata.alternates?.canonical, "/guides/gohighlevel");
assert.deepEqual(metadata.alternates?.types, { "text/markdown": "/guides/gohighlevel.md" });

const html = renderToStaticMarkup(<GohighlevelGuidesPage />);
for (const slug of GOHIGHLEVEL_DIAGNOSTIC_SLUGS) {
  assert.match(html, new RegExp(`href="/guides/${slug}"`));
}
assert.match(html, /"@type":"CollectionPage"/);
assert.match(html, /"@type":"ItemList"/);
assert.match(html, /"@type":"BreadcrumbList"/);

const response = GET(new Request("https://www.seldonframe.com/guides/gohighlevel.md"));
assert.equal(response.status, 200);
assert.match(response.headers.get("content-type") ?? "", /^text\/markdown/);
```

- [ ] **Step 3: Run route tests and verify RED**

```bash
node --import tsx --test tests/unit/seo/gohighlevel-discovery-render.spec.tsx
```

Expected: FAIL because the page and route modules do not exist.

- [ ] **Step 4: Implement the HTML collection page**

Use `MarketplaceNav`, `MarketplaceFooter`, `MarketplaceStyles`, `MKT`, and `Link`. Export metadata with canonical and Markdown alternate. Render Home → Guides → GoHighLevel breadcrumbs, answer-first intro, four visible groups, and guide cards sourced from `resolvedGohighlevelGroups()`.

Emit three JSON-LD scripts:

```ts
const collectionLd = { "@context": "https://schema.org", "@type": "CollectionPage", name: GOHIGHLEVEL_COLLECTION_TITLE, description: GOHIGHLEVEL_COLLECTION_DESCRIPTION, url: `${BASE}${GOHIGHLEVEL_COLLECTION_PATH}` };
const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", itemListElement: allVisibleGuides.map((guide, index) => ({ "@type": "ListItem", position: index + 1, name: guide.title, url: `${BASE}/guides/${guide.slug}` })) };
const breadcrumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [/* Home, Guides, GoHighLevel */] };
```

- [ ] **Step 5: Implement the Markdown route**

Follow existing guide Markdown route headers. Call `renderGohighlevelCollectionMarkdown()`, log `surface: "guide"`, set `Content-Type: text/markdown; charset=utf-8`, advertise the HTML alternate in `Link`, and preserve the existing cache policy.

- [ ] **Step 6: Run route and model tests and verify GREEN**

```bash
node --import tsx --test tests/unit/seo/gohighlevel-discovery.spec.ts tests/unit/seo/gohighlevel-discovery-render.spec.tsx
```

Expected: both files pass with `fail 0`.

- [ ] **Step 7: Commit the route slice**

```bash
git add packages/crm/src/app packages/crm/tests/unit/seo/gohighlevel-discovery-render.spec.tsx
git commit -m "feat(seo): add GoHighLevel guide collection"
```

### Task 3: Visitor entry points and article sibling mesh

**Files:**
- Modify: `packages/crm/tests/unit/seo/gohighlevel-discovery-render.spec.tsx`
- Modify: `packages/crm/src/app/(public)/guides/page.tsx`
- Modify: `packages/crm/src/components/landing/marketing-nav.tsx`
- Modify: `packages/crm/src/components/seo/guide-page.tsx`

**Interfaces:**
- Consumes `GOHIGHLEVEL_COLLECTION_PATH`, `isGohighlevelDiagnostic`, and `gohighlevelDiagnosticSiblings`.
- Produces server-visible entry links and a diagnostic-only sibling section.

- [ ] **Step 1: Add failing discovery-link tests**

Render `GuidesHubPage`, `MarketingNav`, and `GuidePage`. Assert:

```tsx
const guidesHtml = renderToStaticMarkup(<GuidesHubPage />);
assert.ok(guidesHtml.indexOf('href="/guides/gohighlevel"') < guidesHtml.indexOf("Speed to lead & follow-up"));

const navHtml = renderToStaticMarkup(<MarketingNav />);
assert.match(navHtml, /href="\/guides"[^>]*>Guides</);
assert.match(navHtml, /href="\/guides\/gohighlevel"[^>]*>GoHighLevel diagnostics</);

const diagnosticHtml = renderToStaticMarkup(<GuidePage slug="gohighlevel-workflow-problems" />);
assert.match(diagnosticHtml, /More GoHighLevel diagnostics/);
assert.match(diagnosticHtml, /href="\/guides\/gohighlevel"/);
assert.equal((diagnosticHtml.match(/data-ghl-diagnostic-sibling=/g) ?? []).length, 3);

const ordinaryHtml = renderToStaticMarkup(<GuidePage slug="what-is-speed-to-lead" />);
assert.doesNotMatch(ordinaryHtml, /More GoHighLevel diagnostics/);
```

- [ ] **Step 2: Run the render test and verify RED**

Run the Task 2 render-test command. Expected: FAIL on missing navigation, feature, and sibling links.

- [ ] **Step 3: Add Resources and Guides-hub entry points**

Add `{ href: "/guides", label: "Guides" }` and `{ href: GOHIGHLEVEL_COLLECTION_PATH, label: "GoHighLevel diagnostics" }` to `RESOURCE_LINKS`. Add one feature block below the `/guides` intro, with a descriptive CTA to the collection before `clusters.map`.

- [ ] **Step 4: Add the diagnostic sibling section**

In `GuidePage`, compute siblings once. For diagnostic guides only, render a heading, three cards with `data-ghl-diagnostic-sibling`, article titles/descriptions, and a final collection link. Keep it after FAQs and before Sources/final related links so it is contextual and visible.

- [ ] **Step 5: Run the render test and verify GREEN**

Run the Task 2 render-test command. Expected: all render assertions pass.

- [ ] **Step 6: Commit the internal-link slice**

```bash
git add packages/crm/src/app/'(public)'/guides/page.tsx packages/crm/src/components/landing/marketing-nav.tsx packages/crm/src/components/seo/guide-page.tsx packages/crm/tests/unit/seo/gohighlevel-discovery-render.spec.tsx
git commit -m "feat(seo): expose GoHighLevel diagnostics across guides"
```

### Task 4: Commercial-intent links and sitemap

**Files:**
- Modify: `packages/crm/tests/unit/seo/gohighlevel-discovery-render.spec.tsx`
- Modify: `packages/crm/tests/unit/sitemap-priority.spec.ts`
- Modify: `packages/crm/src/components/seo/alternative-page.tsx`
- Modify: `packages/crm/src/app/(public)/tools/gohighlevel-cost-calculator/page.tsx`
- Modify: `packages/crm/src/app/sitemap.ts`

**Interfaces:**
- Consumes `GOHIGHLEVEL_COLLECTION_PATH`.
- Produces contextual links from two high-intent pages and one explicit sitemap entry.

- [ ] **Step 1: Add failing high-intent and sitemap tests**

Render the GoHighLevel and a non-GoHighLevel `AlternativePage`, and the calculator page:

```tsx
const ghl = renderToStaticMarkup(<AlternativePage competitor={getCompetitor("gohighlevel")} />);
assert.match(ghl, /href="\/guides\/gohighlevel"/);
const hubspot = renderToStaticMarkup(<AlternativePage competitor={getCompetitor("hubspot")} />);
assert.doesNotMatch(hubspot, /href="\/guides\/gohighlevel"/);
const calculator = renderToStaticMarkup(<GohighlevelCostCalculatorPage />);
assert.match(calculator, /href="\/guides\/gohighlevel"/);
```

Extend the sitemap test:

```ts
assert.ok(urls.has("https://www.seldonframe.com/guides/gohighlevel"));
```

- [ ] **Step 2: Run tests and verify RED**

```bash
node --import tsx --test tests/unit/seo/gohighlevel-discovery-render.spec.tsx tests/unit/sitemap-priority.spec.ts
```

Expected: FAIL because the three links/entry are absent.

- [ ] **Step 3: Implement contextual links**

On `AlternativePage`, render a GoHighLevel-only callout near the existing `More on ${c.name}` section, linking to the collection with troubleshooting language. On the calculator page, extend the existing related-links paragraph with `Troubleshoot GoHighLevel agency problems` pointing to the collection.

- [ ] **Step 4: Add the explicit sitemap entry**

Immediately after the `/guides` hub entry, add:

```ts
entries.push({
  url: `${base}/guides/gohighlevel`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.7,
});
```

- [ ] **Step 5: Run focused tests and verify GREEN**

Run the command from Step 2. Expected: all tests pass with `fail 0`.

- [ ] **Step 6: Commit the high-intent slice**

```bash
git add packages/crm/src/components/seo/alternative-page.tsx packages/crm/src/app/'(public)'/tools/gohighlevel-cost-calculator/page.tsx packages/crm/src/app/sitemap.ts packages/crm/tests/unit
git commit -m "feat(seo): connect GoHighLevel discovery entry points"
```

### Task 5: Full verification and handoff

**Files:**
- Modify only if a verification failure reveals an in-scope defect.

**Interfaces:**
- Consumes the complete implementation.
- Produces fresh evidence that the branch is safe to merge; no deployment.

- [ ] **Step 1: Run focused discovery and existing guide tests**

```bash
node --import tsx --test tests/unit/seo/gohighlevel-discovery.spec.ts tests/unit/seo/gohighlevel-discovery-render.spec.tsx tests/unit/seo/guides.spec.ts tests/unit/seo/page-metadata.spec.ts tests/unit/sitemap-priority.spec.ts
```

Expected: `fail 0`.

- [ ] **Step 2: Run TypeScript and repository checks**

From `packages/crm`:

```bash
node_modules/.bin/tsc -p tsconfig.json --noEmit
bash scripts/check-use-server.sh src
node scripts/check-migrations-journaled.mjs
```

Expected: no TypeScript errors, async-only server exports, and `0 orphans`.

- [ ] **Step 3: Run the root production build**

From the repository root:

```bash
pnpm build
```

Expected: 4/4 Turbo tasks pass and the route list includes `/guides/gohighlevel` and `/guides/gohighlevel.md`.

- [ ] **Step 4: Review scope and diff hygiene**

```bash
git diff --check origin/main...HEAD
git diff --stat origin/main...HEAD
git status --short --branch
```

Confirm no migration, auth, billing, messaging dispatch, booking runtime, dependency manifest, or unrelated file changed.

- [ ] **Step 5: Resolve any failure at its owning task**

Do not make an opportunistic verification commit. If a check fails, return to the task that owns the failing behavior, repeat that task's RED/GREEN cycle, stage the exact files named in that task, and use that task's commit command before rerunning Task 5 from Step 1.

- [ ] **Step 6: Hand off without deploying**

Report branch, commits, checks, and the separately authorized next actions: merge, push, production deploy, and live endpoint verification.
