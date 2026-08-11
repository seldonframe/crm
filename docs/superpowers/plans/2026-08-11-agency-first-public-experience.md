# Agency-first public experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align SeldonFrame's public website, `/docs`, and GitHub README around agencies selling AI front offices to local-service businesses.

**Architecture:** Keep the existing landing components and routes, but replace conflicting claims with one agency-first message hierarchy. Centralize the public positioning and hosted plan facts in a dependency-free marketing module, then reuse those facts in the homepage metadata, hero, docs, and README. Fix known license/pricing/API-key contradictions and add lightweight consistency tests.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest-compatible repository unit runner, Markdown documentation, pnpm/Turbo.

## Global Constraints

- Preserve the current onboarding, Stripe, PostHog, and GA changes from `a07cf9d7f`.
- Do not change plan prices or billing behavior in this slice.
- The repository license is AGPL-3.0; do not describe the repo as MIT.
- Hosted Managed uses SeldonFrame-managed AI; Builder and Agency plans are BYOK.
- The primary buyer is an agency; builders and self-hosters remain secondary paths.
- Do not claim roadmap-only capabilities as shipped.

---

### Task 1: Add the public positioning contract

**Files:**
- Create: `packages/crm/src/lib/marketing/public-claims.ts`
- Create: `packages/crm/tests/unit/marketing/public-claims.spec.ts`
- Modify: `packages/crm/src/app/(public)/home-copy.ts`

**Interfaces:**
- Produces `AGENCY_POSITIONING`, `AGENCY_HERO_HEADLINE`, `AGENCY_HERO_SUBHEAD`, `AGENCY_PLAN_FACTS`, and `LICENSE_LABEL` for public surfaces.

- [ ] **Step 1: Write the failing test**

Assert that the positioning names agencies and AI front offices, the plan facts contain exactly Builder/Managed/Agency Starter/Agency Growth/Agency Scale with prices 29/49/99/199/299, and the license label is `AGPL-3.0`.

- [ ] **Step 2: Run the focused test**

Run `pnpm test:unit -- packages/crm/tests/unit/marketing/public-claims.spec.ts` and confirm it fails because the module does not exist.

- [ ] **Step 3: Implement the contract**

Use a plain TypeScript module with readonly data and no React or server imports. Update `POSITIONING_ONE_LINER` to consume the canonical agency positioning and avoid introducing a second pricing claim.

- [ ] **Step 4: Run the focused test**

Run the same command and confirm it passes.

- [ ] **Step 5: Commit**

Commit as `feat(marketing): add agency public positioning contract`.

### Task 2: Reframe the homepage for agency conversion

**Files:**
- Modify: `packages/crm/src/components/landing/marketing-hero.tsx`
- Modify: `packages/crm/src/components/landing/marketing-build-steps.tsx`
- Modify: `packages/crm/src/components/landing/marketing-nav.tsx`
- Modify: `packages/crm/src/app/(public)/unified-landing.tsx`
- Modify: `packages/crm/src/app/(public)/agencies/page.tsx`
- Modify: `packages/crm/src/components/landing/marketing-footer.tsx`
- Modify: `packages/crm/src/app/(marketing)/marketing-shell.tsx`

**Interfaces:**
- Consumes the Task 1 positioning contract.
- Preserves existing CTA routing, pricing event hooks, and landing-mode behavior.

- [ ] **Step 1: Replace hero copy**

Use the approved agency promise: “Sell AI front offices. Deploy them in minutes.” Explain the client deliverable and make “Build your first client front office” the primary CTA while preserving the existing form target.

- [ ] **Step 2: Make the build loop agency-specific**

Change the build-step examples to `client URL → workspace → brand/customize → eval → publish → handoff`, while retaining the existing describe/record UI and reduced-motion behavior.

- [ ] **Step 3: Improve navigation and section order**

Expose `/agencies`, `/docs`, `/build`, pricing, and GitHub through accessible navigation or resource links. Put the agency proof/economics section before lower-priority builder/marketplace material.

- [ ] **Step 4: Correct legal and pricing language**

Replace MIT footer language with AGPL-3.0 and remove any stale “$19”, “$297”, or contradictory hosted-key statements in the touched marketing surfaces.

- [ ] **Step 5: Run lint on touched files**

Run `pnpm --filter @seldonframe/crm lint` and fix only issues introduced by this task.

- [ ] **Step 6: Commit**

Commit as `feat(marketing): make agency front offices the primary story`.

### Task 3: Repair the docs information architecture and claims

**Files:**
- Modify: `packages/crm/src/app/docs/page.tsx`
- Modify: `packages/crm/src/app/docs/getting-started/what-is-seldonframe/page.tsx`
- Modify: `packages/crm/src/app/docs/getting-started/first-workspace/page.tsx`
- Modify: `packages/crm/src/app/docs/getting-started/connect-claude-code/page.tsx`
- Modify: `packages/crm/src/app/docs/billing/pricing/page.tsx`
- Modify: `packages/crm/src/app/docs/billing/tiers/page.tsx`
- Modify: `packages/crm/src/app/(marketing)/docs/quickstart/page.tsx`
- Modify: `packages/crm/src/app/(marketing)/docs/mcp-servers/page.tsx`

**Interfaces:**
- Docs links must resolve to existing article routes or external URLs.
- Pricing and BYOK copy must match the Task 1 contract and the current billing implementation.

- [ ] **Step 1: Rewrite the docs homepage hero**

Describe the agency job and add three explicit entry points: agency operator, client workspace operator, and builder/API developer. Replace stale anchor-only “popular” cards with real article routes where those routes exist.

- [ ] **Step 2: Rewrite getting-started content**

Make the first workspace guide agency-led: create a client workspace, brand it, configure booking/CRM, run agent evals, publish, and hand off. Keep the direct operator path available.

- [ ] **Step 3: Correct pricing and plan tiers**

Use the five current hosted plans and remove the retired Builder $19 / Workspace $49 / Agency $297 ladder. Explain Managed versus BYOK and distinguish free building from paid hosted capacity without calling it an undefined trial.

- [ ] **Step 4: Correct quickstart and integration prerequisites**

Hosted users should not be told an Anthropic key is required. Self-hosting documentation may require a provider key. Correct MIT references to AGPL-3.0 and keep provider-specific keys in integration/self-hosting sections.

- [ ] **Step 5: Verify links and copy**

Run a repository search for `open source under MIT`, `Builder ($19`, `Agency ($297`, `Workspace ($49`, and `Anthropic API key` in hosted quickstarts. The first three must return no results; the remaining occurrences must be explicitly self-hosted/provider setup references.

- [ ] **Step 6: Commit**

Commit as `docs: align public docs with agency-first product contract`.

### Task 4: Rewrite the GitHub README for agencies and builders

**Files:**
- Modify: `README.md`

**Interfaces:**
- README links must point to the existing website, `/agencies`, `/build`, `/docs`, and license files.

- [ ] **Step 1: Replace the opening promise**

Lead with agencies selling AI front offices, then explain that SeldonFrame is AGPL-3.0, MCP-native, and open source.

- [ ] **Step 2: Add an agency golden path**

Show the concrete flow: install MCP, paste a client URL, create workspace, customize, run evals, publish, and hand off. Keep the existing technical MCP snippets and live demos as proof.

- [ ] **Step 3: Reorder technical detail**

Move the agent model, Brain, guardrails, money rails, self-hosting, and contribution details after the agency outcome. Preserve accurate shipped/roadmap labels.

- [ ] **Step 4: Normalize commercial language**

Use the current five-plan names/prices and agency 0% GMV claim only where it is already implemented. Remove conflicting “first workspace free forever” or trial language where it would contradict the hosted billing contract.

- [ ] **Step 5: Validate Markdown links and claims**

Run a local link/heading check using the repository’s existing scripts if available, then run `rg` checks for stale license and retired pricing phrases.

- [ ] **Step 6: Commit**

Commit as `docs: position GitHub for agency builders`.

### Task 5: Verify the public-surface slice

**Files:**
- Modify only files required by verification fixes.

- [ ] **Step 1: Run focused unit tests**

Run `pnpm test:unit -- packages/crm/tests/unit/marketing/public-claims.spec.ts`.

- [ ] **Step 2: Run typecheck and lint**

Run `pnpm typecheck` and `pnpm lint` from the worktree root. Record unrelated baseline failures separately from new failures.

- [ ] **Step 3: Run the CRM production build**

Run `pnpm build:crm` and verify that the public homepage, `/agencies`, `/docs`, `/docs/getting-started/first-workspace`, and `/docs/billing/tiers` compile.

- [ ] **Step 4: Run browser smoke verification**

Run `pnpm e2e:smoke` if the environment supports the existing Playwright setup. Verify visible agency headline, primary CTA target, `/agencies`, `/docs`, and GitHub links.

- [ ] **Step 5: Review the final diff**

Run `git diff --check`, inspect the changed-file list, and ensure no telemetry, billing, auth, generated, or unrelated user changes entered the branch.

- [ ] **Step 6: Commit verification fixes**

Commit only genuine verification fixes as `chore: verify agency public surfaces`.

