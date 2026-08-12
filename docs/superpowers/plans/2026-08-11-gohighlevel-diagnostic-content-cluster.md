# GoHighLevel Diagnostic Content Cluster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ten publish-ready, evidence-led GoHighLevel diagnostic guides with canonical HTML pages, Markdown alternates, sitemap and `llms.txt` discovery, and explicit SeldonFrame fit boundaries.

**Architecture:** Each article is a pure `Guide` data module consumed by the existing shared HTML, schema, Markdown, sitemap, and `llms.txt` renderers. Static dotted Markdown routes are added because Next 16 cannot safely represent these URLs with a dynamic dotted segment. Registry and unit-test updates make discovery and editorial requirements executable.

**Tech Stack:** TypeScript, Next.js 16 App Router, Node test runner, existing SeldonFrame guide content engine.

## Global Constraints

- Do not modify auth, billing runtime, booking, messaging dispatch, migrations, or `proxy.ts`.
- Do not add dependencies.
- Every factual platform claim must be supported by an official HighLevel source or explicitly framed as anecdotal community experience.
- Every article must contain `Where SeldonFrame helps` and `Where SeldonFrame cannot help` sections.
- Preserve GoHighLevel as the recommended fit for funnel-heavy, campaign-heavy, snapshot-dependent agencies.
- Do not claim that SeldonFrame removes provider usage, compliance, sender-reputation, carrier, outage, or migration work.
- Builder is for a business the operator owns; agency resale starts with Agency Starter. Reuse public claim constants where pricing appears.
- Validation must not be weakened to obtain a pass.

---

### Task 1: Add the editorial contract tests

**Files:**
- Modify: `packages/crm/tests/unit/seo/guides.spec.ts`

**Interfaces:**
- Consumes: `GUIDES`, `getGuide`, and the repository filesystem.
- Produces: a ten-slug contract enforcing registration, six sections, four FAQs, long-form copy, named fit/non-fit sections, official and community evidence, and static Markdown routes.

- [x] **Step 1: Add the ten expected slugs and assertions**

Add one test that loops over the approved slugs. For each guide, assert `cluster === "gohighlevel"`, at least six sections, at least four FAQs, at least 800 whitespace-delimited words across dek/sections/FAQ, exact fit and non-fit H2s, a `help.gohighlevel.com` or `gohighlevel.com` source, a Reddit or G2 source, and an existing `src/app/guides/<slug>.md/route.ts` file.

- [x] **Step 2: Run the focused test and verify the new contract fails**

Run: `cd packages/crm && node --import tsx --test tests/unit/seo/guides.spec.ts`

Expected: FAIL because the ten guide slugs and Markdown routes do not exist.

### Task 2: Draft onboarding, SaaS-operations, and support guides

**Files:**
- Create: `packages/crm/src/lib/seo/guides/gohighlevel-client-onboarding-takes-too-long.ts`
- Create: `packages/crm/src/lib/seo/guides/gohighlevel-agency-model-not-passive-saas.ts`
- Create: `packages/crm/src/lib/seo/guides/gohighlevel-support-problems.ts`

**Interfaces:**
- Consumes: `Guide`, public pricing claim constants where required, existing GoHighLevel guides for internal links.
- Produces: three complete `guide: Guide` exports.

- [x] **Step 1: Write each answer-first article**

Use six or more sections: quick answer/evidence, platform-versus-setup diagnosis, action plan, `Where SeldonFrame helps`, `Where SeldonFrame cannot help`, and decision/next steps. Cite G2, relevant Reddit threads, HighLevel Agency Launchpad, support options, and pricing documentation.

- [x] **Step 2: Check article-specific truth boundaries**

Confirm the onboarding guide does not compete with the broad `is-gohighlevel-hard-to-learn` keyword; the SaaS guide does not imply software acquires clients; and the support guide acknowledges HighLevel's documented 24/7 support while distinguishing access from resolution experience.

### Task 3: Draft reliability, email, and SMS guides

**Files:**
- Create: `packages/crm/src/lib/seo/guides/gohighlevel-bugs-and-outages.ts`
- Create: `packages/crm/src/lib/seo/guides/why-gohighlevel-emails-go-to-spam.ts`
- Create: `packages/crm/src/lib/seo/guides/gohighlevel-sms-not-delivering.ts`

**Interfaces:**
- Consumes: `Guide` and official HighLevel reliability, email-deliverability, phone, and A2P documentation.
- Produces: three complete diagnostic guides.

- [x] **Step 1: Write reliability as an incident-classification playbook**

Separate configuration, provider, and platform incidents. Include evidence capture, status checking, client communication, rollback, and continuity steps. State that no platform promises zero outages.

- [x] **Step 2: Write email and SMS as channel-specific decision trees**

Email must cover SPF, DKIM, DMARC, reputation, list quality, content, and volume. SMS must cover consent, A2P registration, carrier filtering, number health, workflow filters, and logs. Neither article may imply a platform switch bypasses external rules.

### Task 4: Draft billing, workflow, export, and ownership guides

**Files:**
- Create: `packages/crm/src/lib/seo/guides/gohighlevel-wallets-and-rebilling.ts`
- Create: `packages/crm/src/lib/seo/guides/gohighlevel-workflow-problems.ts`
- Create: `packages/crm/src/lib/seo/guides/can-you-export-gohighlevel.ts`
- Create: `packages/crm/src/lib/seo/guides/who-owns-a-gohighlevel-subaccount.ts`

**Interfaces:**
- Consumes: `Guide`, HighLevel wallet/rebilling, workflow, contact export, cancellation, and sub-account transfer documentation.
- Produces: four complete diagnostic guides.

- [x] **Step 1: Explain billing and workflow mechanics without sensationalism**

Use the wallet guide to map who is charged, what rebilling changes, and where markup is available. Use the workflow guide to diagnose re-entry, trigger filters, waits, time zones, stale test contacts, and integration failures.

- [x] **Step 2: Publish an asset-level portability and control model**

The export guide must distinguish CSV-exportable records, transferable sub-account assets, reconnect-required integrations, and non-portable history/configuration. The ownership guide must distinguish legal ownership from practical administrative control and explain transfer authorization and contract safeguards.

### Task 5: Register the cluster and add Markdown twins

**Files:**
- Modify: `packages/crm/src/lib/seo/guides/index.ts`
- Create: `packages/crm/src/app/guides/<each-new-slug>.md/route.ts` for all ten slugs.

**Interfaces:**
- Consumes: ten `guide` exports and `renderGuideMarkdown(slug)`.
- Produces: canonical registry discovery, sitemap/`llms.txt` inclusion, and ten explicit Markdown endpoints.

- [x] **Step 1: Import and append all ten guides in the GoHighLevel registry block**

Keep the articles adjacent to existing GoHighLevel guides so the hub cluster remains coherent.

- [x] **Step 2: Add ten static dotted Markdown routes**

Each route must log an explicit Markdown fetch, call `renderGuideMarkdown` with its fixed slug, return UTF-8 Markdown, and advertise the HTML alternate in the `Link` header.

- [x] **Step 3: Run the focused guide suite**

Run: `cd packages/crm && node --import tsx --test tests/unit/seo/guides.spec.ts`

Expected: all guide tests pass with `fail 0`.

### Task 6: Review the corpus for SEO/AEO/GEO quality

**Files:**
- Modify only the ten new guide modules if corrections are needed.

**Interfaces:**
- Consumes: rendered Markdown for all ten guides.
- Produces: a non-cannibalizing, source-labelled, internally linked corpus.

- [x] **Step 1: Render and inspect all ten Markdown articles**

Use `renderGuideMarkdown` to confirm every article has one H1, answer-first dek, descriptive H2s, self-contained FAQs, sources, and internal next steps.

- [x] **Step 2: Run a claim and duplication audit**

Search for unsupported absolutes (`always`, `never`, `guaranteed`, invented percentages), missing anecdote labels, raw HTML, duplicate titles, and accidental targeting of existing broad primary keywords. Correct each finding in the source guide.

### Task 7: Record the reusable approach and run the merge gate

**Files:**
- Create: `docs/learnings/2026-08-11-competitor-complaint-diagnostic-clusters.md`

**Interfaces:**
- Consumes: the implemented cluster and validation output.
- Produces: a reusable evidence-to-content method and one objective pass/fail verdict.

- [x] **Step 1: Write the learning note**

Capture the evidence hierarchy, platform-versus-setup distinction, cannibalization avoidance, explicit non-fit section, and static Markdown-twin requirement.

- [ ] **Step 2: Run package build and merge-gate checks**

Run `pnpm build` from the repository root. Run the focused guide unit suite, TypeScript, use-server hygiene, migration journal check, and forbidden-path regression grep. Any non-`.next/` TypeScript error or altered forbidden file fails the gate.

- [ ] **Step 3: Inspect the final diff and status**

Confirm only the specification, plan, learning note, guide tests, ten guide modules, registry, and ten Markdown routes changed. Do not merge, push, or deploy without a separate user request.
