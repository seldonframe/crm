# Public Pricing Truth and AI Front Office Content Design

**Date:** 2026-08-11
**Status:** Approved design
**Branch:** `codex/public-pricing-claims`

## Objective

Make every public SeldonFrame pricing statement distinguish the $29 Builder plan from the agency plans that begin at $99, then publish a canonical three-article “AI Front Office” cluster on `seldonframe.com`.

The result should strengthen agency conversion and entity clarity without erasing valid Builder claims, rewriting historical competitor prices, or creating articles that compete with existing SeldonFrame guides.

## Product-fact boundary

The sellable hosted ladder remains:

| Plan | Monthly price | Public audience claim |
|---|---:|---|
| Builder | $29 | Workspaces for businesses the operator owns; BYOK |
| Managed | $49 | One managed workspace using SeldonFrame’s keys |
| Agency Starter | $99 | 10 client workspaces; white-label and client portals |
| Agency Growth | $199 | 30 client workspaces; white-label and client portals |
| Agency Scale | $299 | Unlimited client workspaces; white-label and client portals |

The first workspace may be built free. Builder may be described as unlimited only when the copy clearly says those are workspaces for businesses the operator owns. Client sub-accounts, client portals, agency white-label delivery, and resale belong to the Agency plans and must not be represented as $29 capabilities.

Competitor prices, dated historical reporting, and numerical examples that are not SeldonFrame plan claims remain outside this repair unless their surrounding attribution is itself wrong.

## Architecture

### Canonical public claims

Extend the dependency-free public claims module with two prose-ready facts derived from the current plan catalog:

- a Builder statement that names the $29 price and the own-business boundary;
- an Agency statement that names the $99 starting price, client-workspace entitlement, and white-label outcome.

Shared templates and new articles should interpolate these facts instead of restating the ladder independently. Longer editorial passages may add context, but they must preserve the same entitlement boundary.

### Semantic pricing regression

Add a public-content regression that inspects rendered or exported SeldonFrame-owned copy, not competitor quotations. It should fail when a $29 SeldonFrame statement is presented near agency resale capabilities without an explicit Agency-plan distinction.

The guard should cover these concepts:

- agency or agencies;
- client sub-account or client workspace;
- white-label or whitelabel;
- branded client portal;
- resell, resale, or per-client delivery.

The regression must permit:

- $29 Builder copy that explicitly limits the plan to businesses the operator owns;
- $99–$299 Agency copy;
- competitor and marketplace price reporting with clear attribution;
- historical design documents that are not published product claims.

The test should enumerate the public corpus intentionally rather than scanning build output or every repository document. Any narrow exception must name the file and explain why it is safe.

## Public sweep

Repair current SeldonFrame claims in this order:

1. Shared marketing and SEO components.
2. README, quick-start, and public documentation.
3. High-intent calculators and comparison pages.
4. Agency, white-label, BYOK, marketplace, and GoHighLevel guides.
5. Remaining public guides that mention current SeldonFrame pricing.

Each passage should be classified before editing:

- **valid Builder claim:** retain, clarifying “businesses you operate” when necessary;
- **misleading agency claim:** replace with Agency Starter at $99 and the relevant client limit;
- **mixed-audience claim:** state both boundaries briefly;
- **competitor or historical price:** retain with attribution and date context;
- **retired internal note:** leave outside the public regression unless it renders publicly.

This is a semantic edit, not a global string replacement.

## Canonical article cluster

All three articles publish first on `seldonframe.com` through the existing guide registry and rendering system. Each receives an HTML page, the existing clean Markdown representation, canonical metadata, sitemap inclusion, and the guide template’s structured data.

### 1. What Is an AI Front Office?

**Intent:** definitional and entity-establishing.
**Primary question:** What is an AI front office, and how is it different from a chatbot, receptionist, CRM, or automation bundle?

Required sections:

- concise answer-first definition;
- the five connected surfaces: website, conversations, CRM, booking/intake, and agent;
- how a lead becomes a booked job through the shared data model;
- front office versus chatbot, answering service, CRM, and GoHighLevel-style toolkit;
- ownership, portability, BYOK, and human handoff;
- who should and should not use one;
- a disclosed SeldonFrame example with the correct Builder/Agency boundary.

### 2. AI Front Office Examples: 7 Service-Business Workflows

**Intent:** concrete, quotable examples for searchers and answer engines.
**Primary question:** What does an AI front office actually do in a real service business?

Required workflows:

1. missed-call recovery;
2. after-hours answering and booking;
3. speed-to-lead qualification;
4. quote or estimate intake;
5. appointment confirmation and no-show reduction;
6. review requests and response handling;
7. dormant-customer reactivation.

Each example must name the trigger, action, system of record, human handoff, and measurable business outcome. Avoid invented performance statistics. Link to relevant existing guides and calculators instead of duplicating them.

### 3. AI Front Office Software for Agencies: An Evaluation Checklist

**Intent:** commercial evaluation for agencies selling managed AI front offices.
**Primary question:** What should an agency verify before choosing the software underneath its client offer?

Required criteria:

- client isolation and permissions;
- agency branding and custom domains;
- client portals;
- reusable deployment and cloning;
- voice, chat, SMS, CRM, booking, and intake integration;
- BYOK and telephony ownership;
- testing, evaluations, receipts, and human escalation;
- data export and portability;
- billing shape and margin predictability;
- open-source and self-hosting trade-offs.

The SeldonFrame section must be clearly disclosed as vendor-authored. It should state Agency Starter at $99 for 10 client workspaces and distinguish Builder at $29 as the own-business plan.

## Editorial and search requirements

- Lead with direct answers rather than keyword-heavy introductions.
- Use original explanations, examples, and decision frameworks; do not manufacture statistics.
- Cite primary sources for external factual claims and date unstable price comparisons.
- Include a visible vendor disclosure wherever SeldonFrame is evaluated.
- Use one canonical URL per article and no indexable parameter variants.
- Link the three articles to one another and to the most relevant existing guides, tools, pricing page, agency page, docs, and GitHub repository.
- Avoid pages whose main content differs only by a swapped industry name.
- Preserve natural language; repeated pricing facts should be concise rather than copied as identical promotional paragraphs.

## Publication and cross-posting

The initial release publishes only on `seldonframe.com`. The new URLs enter the existing sitemap and IndexNow workflow after deployment.

External versions for Medium, DEV, and LinkedIn are a later release. They should be prepared only after the canonical pages are live and indexable, use the platform’s canonical-link mechanism where available, and be adapted rather than copied blindly. No external publishing is part of this implementation slice.

## Analytics

PostHog remains the source of truth for acquisition and article-assisted product journeys. The implementation should verify that visits and CTA transitions are observable with the existing analytics setup. New telemetry is necessary only if the current page and CTA events cannot distinguish these article URLs; do not add a second analytics system or send PII.

Success should be reviewed by article landing sessions, engaged visits, assisted pricing/signup transitions, and search impressions—not by raw page count.

## Error handling and operational safety

- Missing guide registry entries, duplicate slugs, broken internal links, or absent metadata must fail automated checks.
- A pricing-regression exception must be explicit and reviewable; silent skips are not allowed.
- IndexNow delivery remains fail-soft and must not block deployment.
- Publishing must not require billing, authentication, database, or migration changes.

## Verification and acceptance

The slice is accepted when:

1. Current public SeldonFrame pricing copy respects the Builder/Agency boundary.
2. The semantic regression fails on a deliberately misleading `$29 + white-label/client` fixture and passes valid Builder, Agency, and competitor examples.
3. All three new guides resolve through the guide registry and render both HTML and Markdown content.
4. Article titles, descriptions, canonicals, structured data, and sitemap entries are correct and unique.
5. Internal links resolve to existing public routes.
6. Changed-file lint and TypeScript pass.
7. Targeted guide, metadata, sitemap, and pricing-claim tests pass.
8. The production CRM build succeeds.
9. No external cross-post is published in this slice.

Repository-wide baseline failures unrelated to these files should be reported separately and must not be hidden by the new test runner.

## Out of scope

- Medium, DEV, LinkedIn, X, Reddit, or Hacker News publishing;
- paid link acquisition or bulk outreach;
- new programmatic vertical page families;
- automated AI-written article generation;
- pricing, billing, entitlement, authentication, or database behavior changes;
- retroactive rewriting of non-public historical specifications.
