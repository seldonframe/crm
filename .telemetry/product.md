# Product: SeldonFrame

**Last updated:** 2026-08-10
**Method:** codebase scan + signup-to-paid implementation

## Product Identity
- **One-liner:** Operators turn a business description or website into a live client front office with a website, CRM, booking, intake, and AI receptionist.
- **Category:** b2b-saas / AI business operating system
- **Product type:** B2B SaaS with agency multi-tenancy
- **Collaboration:** hybrid; single operators and agencies manage client workspaces

## Business Model
- **Monetization:** freemium onboarding with paid self-service and agency tiers
- **Pricing tiers:** Builder, Managed, Agency Starter, Agency Growth, Agency Scale
- **Billing integration:** Stripe Checkout and Stripe Billing webhooks

## Tech Stack
- **Primary language:** TypeScript
- **Framework:** Next.js App Router
- **Database:** PostgreSQL via Drizzle ORM
- **Background jobs:** Vercel/Workflow and scheduled routes
- **HTTP client patterns:** native `fetch` with server actions and route handlers
- **Module organization:** pnpm monorepo; CRM package owns the product surface

## Value Mapping

### Primary Value Action
**Workspace goes live** — the operator has a client-facing front office accepting real inquiries or bookings. If this drops to zero, the product has failed.

### Core Features
1. **Workspace build** — converts URL or business input into a configured workspace.
2. **Booking and CRM** — turns visitor intent into appointments and follow-up work.
3. **Go-live surfaces** — publishes the workspace on a share link or custom domain.

### Supporting Features
1. **Agency hierarchy** — lets an agency manage client workspaces under one account.
2. **Billing and entitlements** — converts successful onboarding into paid capacity.

## Entity Model

### Users
- **ID format:** UUID
- **Roles:** owner, member, operator/admin variants
- **Multi-account:** yes

### Workspaces
- **ID format:** UUID organization ID
- **Hierarchy:** workspace may belong to a parent agency organization

## Group Hierarchy

```
Agency
└── Workspace
```

| Group Type | Parent | Where Actions Happen |
|------------|--------|----------------------|
| agency | none | cross-client operations and billing |
| workspace | agency or none | build, booking, CRM, and go-live |

**Default event level:** workspace
**Admin actions at:** agency or user level

## Current State
- **Existing tracking:** PostHog browser/server capture, GA4 web analytics, database event log
- **Documentation:** partial; current-state audit exists under `.telemetry/`
- **Known issues:** signup-to-checkout plan loss, sparse lifecycle identity, no authoritative GA conversion events

## Integration Targets
| Destination | Purpose | Priority |
|-------------|---------|----------|
| PostHog | product lifecycle, cohorts, attribution, workspace/agency groups | primary |
| GA4 | server-side conversion counters and Key Events | secondary |
| database event log | operational compatibility and internal reporting | preserve |
