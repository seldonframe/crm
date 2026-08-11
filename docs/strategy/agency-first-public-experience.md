# Agency-first public experience

## Decision

SeldonFrame's primary public audience is agencies and independent operators who sell and operate AI front offices for local-service businesses.

The positioning is:

> SeldonFrame is the agent-native, open-source alternative to GoHighLevel for agencies serving local businesses.

The agency is the customer. The service business is the deployment target.

## Customer job

An agency needs to turn a client's website and business facts into a branded, working front office that it can deploy, operate, and resell. The deliverable is not an abstract agent. It is a client workspace containing a website, booking flow, intake, CRM, follow-up, and an agent that can act across the client's channels.

## Message hierarchy

1. Outcome: sell and deploy AI front offices in minutes.
2. Deliverable: website, booking, CRM, intake, agent, and client portal in one workspace.
3. Agency advantage: repeatable delivery, white-label branding, owned data, and room for agency margin.
4. Mechanism: agent-native MCP/API, Brain/Soul, guardrails, evals, and deployable workspaces.
5. Openness: AGPL-3.0, portable data, and no platform lock-in.

Technology appears after the agency outcome. Builders and self-hosters remain important secondary audiences and get dedicated paths through `/build`, GitHub, and developer documentation.

## Surface roles

| Surface | Job | Primary CTA |
| --- | --- | --- |
| `/` | Make the agency value legible in one screen | Build your first client front office |
| `/agencies` | Explain delivery workflow, white-labeling, and economics | See agency plans |
| `/docs` | Help an agency reach first deployment without guessing | Build your first workspace |
| GitHub README | Help a technical agency install, evaluate, self-host, or contribute | Install the MCP |

## Promise contract

The public surfaces must agree on the following facts:

- License: AGPL-3.0 for the repository.
- Hosted plan ladder: Builder $29/mo, Managed $49/mo, Agency Starter $99/mo, Agency Growth $199/mo, Agency Scale $299/mo.
- Hosted Managed includes managed AI; Builder and Agency plans are BYOK.
- The first workspace can be built free; paid plans unlock the relevant hosted capacity and agency features. No copy should call this a trial unless it explains the exact boundary.
- “Live” means the workspace has a public URL and its configured public surface is reachable. A first booking is a separate activation milestone.
- “Minutes” is a directional promise backed by the onboarding funnel; it is not a guarantee for every provider, industry, or customization.

## Proof loop

The first proof story is an agency onboarding a real HVAC, dental, or medspa client:

`client URL → workspace build → brand/customize → eval → publish → first test booking → client handoff`

Product and marketing measurement use the canonical lifecycle events already defined in the onboarding funnel. The homepage should eventually show proof from real workspaces and first-booking outcomes rather than feature counts alone.

## Out of scope for this slice

- Rebuilding the application shell or dashboard.
- Changing plan prices or billing behavior.
- Creating an automated outbound email system.
- Rewriting the entire SEO comparison library.
- Claiming features that are only roadmap items.

