# GoHighLevel Diagnostic Content Cluster Design

**Approved:** 2026-08-11

## Objective

Publish ten evidence-led diagnostic guides for GoHighLevel agency users. Each guide must answer a narrow operational complaint, help the reader determine whether the cause is HighLevel, agency configuration, or an external provider, and state where SeldonFrame is and is not a suitable alternative.

## Editorial position

The cluster is not an anti-GoHighLevel campaign. HighLevel remains a strong fit for agencies that need deep funnels, elaborate email and SMS campaigns, snapshots, and its large implementation ecosystem. SeldonFrame is the narrower alternative for agencies selling an AI-first front office to service businesses: site, conversations, CRM, intake, booking, agents, and follow-up in an opinionated workspace.

The research indicates that the dominant complaint is operational complexity rather than one missing feature. G2's review synthesis repeatedly surfaces learning curve, unintuitive operation, missing features, and support. Reddit discussions add recurring accounts of setup time, client support burden, troubleshooting, billing confusion, deliverability, workflow mistakes, and offboarding risk. Reddit is anecdotal evidence and must be labelled as such; HighLevel documentation is the authority for product behavior.

## The ten guides

1. `gohighlevel-client-onboarding-takes-too-long` — reduce the learning and onboarding burden without pretending every advanced feature is necessary.
2. `gohighlevel-agency-model-not-passive-saas` — price the implementation, support, compliance, and reporting work that software does not remove.
3. `gohighlevel-support-problems` — give agencies a reproducible evidence-and-escalation checklist.
4. `gohighlevel-bugs-and-outages` — separate local configuration failures from incidents and create a client-safe continuity plan.
5. `why-gohighlevel-emails-go-to-spam` — diagnose authentication, reputation, list, content, volume, and provider issues.
6. `gohighlevel-sms-not-delivering` — diagnose A2P 10DLC, consent, carrier filtering, number health, and workflow conditions.
7. `gohighlevel-wallets-and-rebilling` — explain wallets, agency-first charges, rebilling, markup eligibility, and margin controls.
8. `gohighlevel-workflow-problems` — diagnose duplicate, late, missing, and misrouted automation.
9. `can-you-export-gohighlevel` — publish an asset-by-asset portability matrix and migration sequence.
10. `who-owns-a-gohighlevel-subaccount` — explain practical control, transfer authorization, offboarding, and client-contract safeguards.

## Required article shape

Every guide is a `Guide` data module in `packages/crm/src/lib/seo/guides/`, registered in the existing GoHighLevel cluster. Every guide must contain:

- An answer-first dek that resolves the title question before exposition.
- At least six substantial sections and approximately 900 or more words of reader-facing copy.
- A section that distinguishes a platform problem from a setup, provider, or business-model problem.
- A concrete diagnostic checklist, decision sequence, or operating playbook.
- A section named `Where SeldonFrame helps`.
- A section named `Where SeldonFrame cannot help`.
- At least four concise FAQs suitable for `FAQPage` structured data.
- At least one official HighLevel source and one independent/community source.
- Internal links to the closest existing GoHighLevel guide and `/alternative-to-gohighlevel`.
- A static `/guides/<slug>.md` route rendering from the same guide object as HTML.

The existing renderer supplies canonical metadata, Article and FAQ schema, the author byline, sitemap inclusion, `llms.txt` inclusion, and Markdown rendering once the guide is registered.

## Evidence policy

- Product behavior, pricing mechanics, support channels, transfer rules, and export limitations use current HighLevel documentation.
- Aggregated complaint prevalence uses review-platform summaries such as G2.
- Reddit material is introduced as a report, example, or practitioner account, never as a representative statistic.
- No outage rate, deliverability rate, savings percentage, setup-time promise, or migration guarantee may be invented.
- Email and SMS guides must say explicitly that switching platforms cannot repair poor consent, list hygiene, sender reputation, spammy content, or carrier compliance.
- Reliability content must say explicitly that SeldonFrame cannot promise zero outages.
- Portability content must say explicitly that SeldonFrame cannot automatically convert every HighLevel asset.

## Search and answer-engine design

Titles mirror the natural-language diagnostic query. The dek is the extractable answer. H2s express follow-up questions and decision criteria. FAQ answers remain self-contained. Sources are named and linked. The HTML and Markdown twins use the same data so search crawlers and generative systems receive one consistent factual corpus.

To prevent cannibalization, the new guides do not retarget the existing broad queries `why agencies leave gohighlevel`, `is gohighlevel hard to learn`, `hidden gohighlevel fees`, or `how to switch from gohighlevel`. They serve narrower troubleshooting and operational queries and link upward to those pages.

## Validation contract

- New unit assertions identify all ten slugs and enforce the required article shape.
- `tests/unit/seo/guides.spec.ts` passes with `fail 0`.
- TypeScript reports no non-`.next/` errors.
- `check-use-server.sh` passes.
- Migration journal reports zero new orphans; this change adds no migration.
- Regression grep confirms no booking, messaging dispatch, billing runtime, authentication, or migration files changed.
- `pnpm build` from the repository root completes successfully.
- Live route verification is deferred until the branch is deployed; local verification must prove the HTML registry, sitemap source, `llms.txt` source, and all ten Markdown route modules resolve.

