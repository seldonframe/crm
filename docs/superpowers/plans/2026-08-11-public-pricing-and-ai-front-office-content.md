# Public Pricing Truth and AI Front Office Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct every misleading current SeldonFrame agency-pricing claim and publish three canonical AI Front Office articles on `seldonframe.com`.

**Architecture:** Keep product facts in the dependency-free `public-claims.ts` module. Add a semantic public-corpus guard that distinguishes valid Builder claims from agency-resale claims. Add the three articles as normal entries in the existing guide registry so HTML, Markdown, metadata, sitemap, and structured data use the established rendering path.

**Tech Stack:** Next.js App Router, TypeScript, Node test runner with `tsx`, guide registry under `packages/crm/src/lib/seo/guides`, existing sitemap/IndexNow integration, ESLint, pnpm/Turbo.

## Global Constraints

- Builder is `$29/mo` only for workspaces serving businesses the operator owns; Agency Starter is `$99/mo` for 10 client workspaces; Growth is `$199/mo` for 30; Scale is `$299/mo` unlimited.
- The first workspace may be built free.
- Do not rewrite competitor prices or historical reports unless attribution is wrong.
- Do not use a global string replacement; classify each public passage semantically.
- Publish canonical articles on `seldonframe.com` only in this slice; external cross-posting is later.
- Do not change billing, authentication, database, migrations, or entitlement behavior.
- Do not add a second analytics system or send PII.
- Every production change follows TDD: failing test, observed failure, minimal implementation, passing test.

---

### Task 1: Add reusable pricing claim language

**Files:**
- Modify: `packages/crm/src/lib/marketing/public-claims.ts`
- Test: `packages/crm/tests/unit/marketing/public-claims.spec.ts`

**Interfaces:**
- Produces `BUILDER_PRICING_CLAIM` and `AGENCY_PRICING_CLAIM` string constants for marketing and editorial modules.

- [ ] **Step 1: Write the failing test**

Add assertions that the Builder claim contains `$29`, `own`, and excludes `white-label`, while the Agency claim contains `$99`, `10 client`, and `white-label`.

- [ ] **Step 2: Run the test to verify it fails**

Run from `packages/crm`:

```powershell
node --import tsx --test tests/unit/marketing/public-claims.spec.ts
```

Expected: FAIL because the new exports do not exist.

- [ ] **Step 3: Implement the minimal constants**

Add prose constants derived from `AGENCY_PLAN_FACTS`; do not duplicate prices in a second numeric catalog:

```ts
export const BUILDER_PRICING_CLAIM =
  "Builder is $29/mo for businesses you operate yourself; it is BYOK and does not include client sub-accounts or white-label resale." as const;

export const AGENCY_PRICING_CLAIM =
  "Agency plans start at $99/mo for 10 client workspaces with white-label delivery; Growth covers 30 and Scale covers unlimited client workspaces." as const;
```

- [ ] **Step 4: Run the test to verify it passes**

Run the same command. Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add packages/crm/src/lib/marketing/public-claims.ts packages/crm/tests/unit/marketing/public-claims.spec.ts
git commit -m "Add explicit Builder and Agency pricing claims"
```

### Task 2: Add the semantic public pricing guard

**Files:**
- Create: `packages/crm/src/lib/marketing/public-pricing-audit.ts`
- Create: `packages/crm/tests/unit/marketing/public-pricing-audit.spec.ts`

**Interfaces:**
- `auditPublicPricingText(text: string): { ok: boolean; reasons: string[] }`.
- The audit treats `$29`/`29 dollars`/`twenty-nine dollars` as Builder pricing and rejects nearby agency-resale terms unless an explicit Agency distinction is present.

- [ ] **Step 1: Write the failing tests**

Cover these cases:

```ts
assert.equal(auditPublicPricingText("SeldonFrame is $29/mo with unlimited workspaces for your own businesses.").ok, true);
assert.equal(auditPublicPricingText("Agency Starter is $99/mo for 10 client workspaces.").ok, true);
assert.equal(auditPublicPricingText("SeldonFrame is $29/mo with white-label client portals.").ok, false);
assert.equal(auditPublicPricingText("$29 Builder for your own businesses; Agency Starter starts at $99 for client sub-accounts.").ok, true);
assert.equal(auditPublicPricingText("GoHighLevel Agency Pro costs $497/mo.").ok, true);
```

- [ ] **Step 2: Run the tests to verify they fail**

```powershell
node --import tsx --test tests/unit/marketing/public-pricing-audit.spec.ts
```

Expected: FAIL because the audit module does not exist.

- [ ] **Step 3: Implement the minimal audit**

Normalize case and whitespace. Detect a Builder-price token, then detect resale terms within the same sentence or a 180-character window. Permit the text when the window also contains `Agency Starter`, `$99`, `$199`, `$299`, `agency plans`, or an explicit `does not include` boundary. Do not inspect competitor-only sentences that do not mention SeldonFrame or Builder.

- [ ] **Step 4: Run the tests to verify they pass**

Run the same command. Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add packages/crm/src/lib/marketing/public-pricing-audit.ts packages/crm/tests/unit/marketing/public-pricing-audit.spec.ts
git commit -m "Guard public Builder and Agency pricing claims"
```

### Task 3: Enumerate and repair shared core surfaces

**Files:**
- Modify: `packages/crm/src/components/landing/marketing-faq-section.tsx`
- Modify: `packages/crm/src/components/landing/marketing-pricing-section.tsx`
- Modify: `packages/crm/src/app/(public)/tools/ai-receptionist-cost-calculator/page.tsx`
- Modify: `packages/crm/src/app/(public)/tools/gohighlevel-cost-calculator/page.tsx`
- Test: `packages/crm/tests/unit/landing/marketing-faq.spec.ts`
- Test: `packages/crm/tests/unit/landing/marketing-pricing.spec.ts`
- Create: `packages/crm/tests/unit/marketing/public-pricing-corpus.spec.ts`

**Interfaces:**
- The corpus test imports the shared marketing surfaces and audits only SeldonFrame-owned rendered text.

- [ ] **Step 1: Write the failing corpus assertions**

Add representative render assertions for the FAQ, pricing section, and both calculators. Assert that agency-facing copy includes Agency Starter `$99` and that no rendered agency paragraph claims `$29` includes client sub-accounts or white-label resale.

- [ ] **Step 2: Run the tests to verify they fail**

```powershell
node --import tsx --test tests/unit/marketing/public-pricing-corpus.spec.ts tests/unit/landing/marketing-faq.spec.ts tests/unit/landing/marketing-pricing.spec.ts
```

Expected: FAIL on the stale calculator/FAQ wording.

- [ ] **Step 3: Repair the copy using the claim constants**

Use `BUILDER_PRICING_CLAIM` and `AGENCY_PRICING_CLAIM` in shared copy. For calculator answers, state Builder pricing only for own-business use and link agency visitors to the `$99` starting tier. Preserve calculator intent and existing disclosure language.

- [ ] **Step 4: Run the tests to verify they pass**

Run the same command. Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add packages/crm/src/components/landing packages/crm/src/app/(public)/tools packages/crm/tests/unit/landing packages/crm/tests/unit/marketing/public-pricing-corpus.spec.ts
git commit -m "Repair pricing claims on core public surfaces"
```

### Task 4: Sweep agency and marketplace guides

**Files:**
- Modify: `packages/crm/src/lib/seo/guides/ai-marketplace-fees-compared.ts`
- Modify: `packages/crm/src/lib/seo/guides/how-do-ai-agents-get-paid.ts`
- Modify: `packages/crm/src/lib/seo/guides/how-to-get-ai-agency-clients.ts`
- Modify: `packages/crm/src/lib/seo/guides/how-to-make-money-selling-ai-agents.ts`
- Modify: `packages/crm/src/lib/seo/guides/how-to-price-an-ai-receptionist-service.ts`
- Modify: `packages/crm/src/lib/seo/guides/run-client-ai-on-your-own-keys.ts`
- Modify: `packages/crm/src/lib/seo/guides/why-agencies-leave-gohighlevel.ts`
- Modify: `packages/crm/src/lib/seo/guides/white-label-ai-front-office-without-agency-pro.ts`
- Modify: `packages/crm/src/lib/seo/guides/white-label-ai-agents.ts`
- Test: `packages/crm/tests/unit/seo/guides.spec.ts`
- Test: `packages/crm/tests/unit/marketing/public-pricing-corpus.spec.ts`

**Interfaces:**
- Every changed guide remains a `Guide` registry entry and is checked through `getGuide` plus `renderGuideMarkdown`.

- [ ] **Step 1: Add failing guide-corpus assertions**

Enumerate these agency-intent slugs, render their title/body/FAQ text, and run `auditPublicPricingText` against each SeldonFrame-owned passage. Assert the audit returns `ok: true`.

- [ ] **Step 2: Run the tests to verify they fail**

```powershell
node --import tsx --test tests/unit/marketing/public-pricing-corpus.spec.ts tests/unit/seo/guides.spec.ts
```

Expected: FAIL on `$29` claims that also promise client delivery or white-label.

- [ ] **Step 3: Repair each passage semantically**

Use the Builder claim only for own-business examples. In agency passages, state Agency Starter at `$99/mo` and client capacity first; mention Builder as a separate solo/operator path only when useful. Keep GMV, BYOK, and competitor claims intact when their current context is accurate.

- [ ] **Step 4: Run the tests to verify they pass**

Run the same command. Expected: PASS with no guide registry regressions.

- [ ] **Step 5: Commit**

```powershell
git add packages/crm/src/lib/seo/guides packages/crm/tests/unit/seo/guides.spec.ts packages/crm/tests/unit/marketing/public-pricing-corpus.spec.ts
git commit -m "Align agency guide pricing with the current ladder"
```

### Task 5: Publish the definitional article

**Files:**
- Create: `packages/crm/src/lib/seo/guides/what-is-an-ai-front-office.ts`
- Modify: `packages/crm/src/lib/seo/guides/index.ts`
- Test: `packages/crm/tests/unit/seo/guides.spec.ts`

**Interfaces:**
- Exports `guide: Guide` with slug `what-is-an-ai-front-office`, cluster `ai-agents`, direct answer, sources, FAQ, and internal links through existing Markdown syntax.

- [ ] **Step 1: Write the failing registry test**

Assert the new slug resolves, has a non-empty answer-first opening, contains the five connected surfaces, includes a vendor disclosure, and states the Builder/Agency distinction.

- [ ] **Step 2: Run the test to verify it fails**

```powershell
node --import tsx --test tests/unit/seo/guides.spec.ts
```

Expected: FAIL because the slug is not registered.

- [ ] **Step 3: Add the guide and registry import**

Write original, cited content with sections for definition, workflow, comparison boundaries, ownership/BYOK, handoff, fit, and a disclosed SeldonFrame example. Do not invent performance statistics.

- [ ] **Step 4: Run guide rendering tests**

```powershell
node --import tsx --test tests/unit/seo/guides.spec.ts tests/unit/marketing/public-pricing-corpus.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add packages/crm/src/lib/seo/guides/what-is-an-ai-front-office.ts packages/crm/src/lib/seo/guides/index.ts packages/crm/tests/unit/seo/guides.spec.ts
git commit -m "Publish the AI front office definition guide"
```

### Task 6: Publish workflow examples and agency checklist articles

**Files:**
- Create: `packages/crm/src/lib/seo/guides/ai-front-office-examples.ts`
- Create: `packages/crm/src/lib/seo/guides/ai-front-office-software-for-agencies.ts`
- Modify: `packages/crm/src/lib/seo/guides/index.ts`
- Test: `packages/crm/tests/unit/seo/guides.spec.ts`

**Interfaces:**
- Both files export `guide: Guide`; slugs are `ai-front-office-examples` and `ai-front-office-software-for-agencies`.

- [ ] **Step 1: Write failing registry and content tests**

Assert the examples guide contains exactly the seven required workflow headings and each names a trigger, action, system of record, handoff, and outcome. Assert the agency checklist contains all ten criteria from the approved design and the correct Agency/Builder pricing boundary.

- [ ] **Step 2: Run tests to verify they fail**

```powershell
node --import tsx --test tests/unit/seo/guides.spec.ts
```

Expected: FAIL because both slugs are absent.

- [ ] **Step 3: Add both guides and registry imports**

Use concise answer-first sections, original examples, existing internal links, primary citations where external facts appear, and an explicit vendor disclosure in the checklist article.

- [ ] **Step 4: Run guide, Markdown, and pricing tests**

```powershell
node --import tsx --test tests/unit/seo/guides.spec.ts tests/unit/marketing/public-pricing-corpus.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add packages/crm/src/lib/seo/guides/ai-front-office-examples.ts packages/crm/src/lib/seo/guides/ai-front-office-software-for-agencies.ts packages/crm/src/lib/seo/guides/index.ts packages/crm/tests/unit/seo/guides.spec.ts
git commit -m "Publish AI front office examples and agency checklist"
```

### Task 7: Verify metadata, sitemap, links, and publication plumbing

**Files:**
- Test: `packages/crm/tests/unit/seo/page-metadata.spec.ts`
- Test: `packages/crm/tests/unit/sitemap-priority.spec.ts`
- Test: `packages/crm/tests/unit/marketplace/md-analytics.spec.ts`
- Test: `packages/crm/tests/unit/seo/guides.spec.ts`
- Inspect: `packages/crm/src/app/sitemap.ts`
- Inspect: `packages/crm/src/lib/seo/indexnow.ts`
- Inspect: `packages/crm/src/components/analytics/analytics-identity-bridge.tsx`

- [ ] **Step 1: Add failing assertions for all three slugs**

Assert unique titles/descriptions, canonical URLs under `/guides/`, Markdown route parity, sitemap inclusion, and no broken internal links.

- [ ] **Step 2: Run tests to verify they fail**

```powershell
node --import tsx --test tests/unit/seo/guides.spec.ts tests/unit/seo/page-metadata.spec.ts tests/unit/sitemap-priority.spec.ts tests/unit/marketplace/md-analytics.spec.ts
```

Expected: FAIL until the registry and metadata fixtures include all three URLs.

- [ ] **Step 3: Implement only required registry/sitemap changes**

Use the existing guide-derived sitemap and IndexNow sweep. Do not add a second publisher or change cron behavior.

- [ ] **Step 4: Run tests to verify they pass**

Run the same command. Expected: PASS, with existing page/Markdown analytics behavior preserved and no new PII fields.

- [ ] **Step 5: Commit**

```powershell
git add packages/crm/tests/unit/seo packages/crm/tests/unit/sitemap-priority.spec.ts packages/crm/src/app/sitemap.ts packages/crm/src/lib/seo/indexnow.ts
git commit -m "Verify canonical article publication plumbing"
```

### Task 8: Run quality gates and prepare the canonical release

**Files:**
- Inspect: all files changed in Tasks 1–7

- [ ] **Step 1: Run focused tests and changed-file lint**

```powershell
node --import tsx --test tests/unit/marketing/public-claims.spec.ts tests/unit/marketing/public-pricing-audit.spec.ts tests/unit/marketing/public-pricing-corpus.spec.ts tests/unit/seo/guides.spec.ts tests/unit/seo/page-metadata.spec.ts tests/unit/sitemap-priority.spec.ts
$changedFiles = @(git diff --name-only origin/main...HEAD -- packages/crm/src packages/crm/tests | Where-Object { $_ -match '\\.(ts|tsx)$' })
pnpm exec eslint @changedFiles
pnpm typecheck
```

- [ ] **Step 2: Run the complete unit suite in Windows-safe batches**

Use the repository’s `node --import tsx --test` runner with batches of at most 40 files. Record any pre-existing generated-block or shell-tool failures separately.

- [ ] **Step 3: Run the production build**

```powershell
$env:Path = 'C:\Program Files\Git\usr\bin;C:\Program Files\Git\bin;' + $env:Path
pnpm build
```

- [ ] **Step 4: Inspect the rendered canonical URLs**

Verify the three article pages, their `.md` twins, canonical tags, JSON-LD, and sitemap entries in a disposable preview deployment.

- [ ] **Step 5: Commit the final QA adjustments**

```powershell
git add .
git commit -m "Verify canonical AI front office content release"
```

- [ ] **Step 6: Push and open a ready PR**

```powershell
git push -u origin codex/public-pricing-claims
$prBody = "## What changed`n- repaired current SeldonFrame agency pricing claims`n- published three canonical AI Front Office guides`n- added semantic pricing and publication regressions`n`n## Validation`n- focused tests, changed-file lint, typecheck, complete unit batches, and production build"
gh pr create --base main --title "Repair public pricing claims and publish AI front office guides" --body $prBody
```

Keep external cross-posting out of this PR. After the canonical pages are deployed and indexable, prepare platform-specific versions with canonical links in a separate change.
