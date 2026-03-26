# Customization Guide

Seldon Frame is meant to be forked and adapted to a niche.

## Customization layers

1. `framework.config.ts` (developer defaults)
2. Soul setup (`organizations.soul`, per-org runtime personalization)
3. Manual module extensions (custom routes/actions/integrations)

## Add Stripe

### 1) Install SDK

```bash
pnpm add stripe
```

### 2) Add env

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 3) Add integration service

Create `src/lib/integrations/stripe.ts`:

```ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});
```

### 4) Create webhook endpoint

Create `src/app/api/integrations/stripe/webhook/route.ts` and map invoice/payment events to `activities` or `deals` updates.

## Add SendGrid (email)

### 1) Install SDK

```bash
pnpm add @sendgrid/mail
```

### 2) Add env

```env
SENDGRID_API_KEY=
```

### 3) Service wrapper

Create `src/lib/integrations/sendgrid.ts` and expose typed methods:
- `sendFollowupEmail()`
- `sendTaskReminder()`
- `sendIntakeNotification()`

### 4) Hook into workflows

- On `intake_submissions` insert
- On `activities` task reminders
- On AI-generated drafts approval

## Add Twilio (SMS)

### 1) Install SDK

```bash
pnpm add twilio
```

### 2) Add env

```env
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
```

### 3) Create `src/lib/integrations/twilio.ts`

Expose:
- `sendSms()`
- `sendWhatsApp()`

### 4) Trigger from activity tasks

Add an action that maps overdue tasks to SMS follow-ups.

## Customize labels and voice

- Developer defaults: edit `framework.config.ts`
- Org runtime: run `/setup` wizard and save soul
- Runtime label resolution:
  - Client components: `useLabels()`
  - Server components: `getLabels()`

## Build a niche variant

1. Copy one showcase config from `showcase/`
2. Replace `framework.config.ts`
3. Import matching `soul-template.json`
4. Run matching `seed.sql`
5. Update branding via `soul.branding`

## Extend the headless API

- Base routes under `src/app/api/v1`
- Use `guardApiRequest()` for API key auth + rate limiting
- Always scope DB queries by `org_id`

## Add custom modules

Recommended pattern:

- `src/lib/<module>/actions.ts` for server mutations/queries
- `src/components/<module>/` for UI
- `src/app/(dashboard)/<module>/page.tsx` for route
- Optional API exposure under `src/app/api/v1/<module>`
