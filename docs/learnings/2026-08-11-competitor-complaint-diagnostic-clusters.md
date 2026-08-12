# Competitor complaint diagnostic clusters

## The problem, in one line

A broad competitor-complaint topic needed ten useful search pages without turning anecdotes into facts, attacking every user, or cannibalizing existing comparison and pricing pages.

## The approach

1. Inventory the existing content cluster before choosing titles; reserve broad queries already served by comparison, pricing, switching, and “why users leave” pages.
2. Rank complaint themes using an aggregate review source, then use Reddit only to expose language, scenarios, and operational failure modes that require investigation.
3. Verify product behavior with the competitor's current official documentation; treat support access, wallet flow, transfer rules, deliverability guidance, and workflow behavior as product facts only when that documentation supports them.
4. Turn each complaint into a narrow diagnostic query with an answer-first summary, a platform-versus-setup distinction, a reproducible checklist, and a controlled next action.
5. Add two separate conversion boundaries to every page: `Where SeldonFrame helps` and `Where SeldonFrame cannot help`. The second section is mandatory because many complaints originate in consent, data, providers, agency operations, or business strategy rather than the platform.
6. Register every article in the shared guide object so HTML metadata, Article and FAQ schema, sitemap, and `llms.txt` remain consistent. Add a static dotted Markdown route because Next 16 does not safely support these agent-readable URLs through a dynamic dotted segment.
7. Enforce the shape in tests: approved slugs, long-form copy, source diversity, fit and non-fit headings, FAQs, and physical Markdown route existence.

## Judgment calls

- The cluster did not publish a numeric Reddit ranking. Reddit participation is self-selected and complaint-heavy; its posts were used as attributed experience, not prevalence data.
- The articles did not claim a comparative outage rate, guaranteed deliverability, effortless migration, passive income, or zero provider cost because the research did not establish those claims.
- Broad titles such as “Why agencies leave GoHighLevel” and “Is GoHighLevel hard to learn” were not reused. Narrow troubleshooting intent creates incremental coverage and links upward to existing pages.
- GoHighLevel remains the recommended fit for deep funnels, elaborate campaigns, snapshots, and its larger ecosystem. SeldonFrame is positioned for the narrower AI-front-office job it actually performs.
- Video transcript candidates without usable captions contributed no claims. Search descriptions are not transcript evidence.

## The reusable rule, one line

Build competitor complaint content as an evidence-led diagnostic system: quantify with aggregate reviews, illustrate with labelled anecdotes, verify with primary documentation, and make the non-fit boundary as explicit as the conversion case.

