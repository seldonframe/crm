# Demo Deployment Guide (Step 17)

This repository includes a prepared deployment path for a public read-only demo.

## Target

- Host: `demo.<your-domain>.com`
- Platform: Vercel
- Database: Neon
- Demo profile: coaching soul + showcase seed

## 1) Create Neon database

- Create a Neon project/database
- Copy connection string into Vercel env as `DATABASE_URL`

## 2) Configure Vercel project env vars

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL=https://demo.<your-domain>.com`
- `NEXT_PUBLIC_APP_URL=https://demo.<your-domain>.com`
- `ANTHROPIC_API_KEY` (optional)

## 3) Apply schema + seed

```bash
pnpm db:generate
pnpm db:push
```

Then run showcase seed SQL from `showcase/coaching/seed.sql`.

## 4) Configure custom domain

- In Vercel project settings, add `demo.<your-domain>.com`
- Set DNS records as instructed by Vercel

## 5) Enable read-only demo behavior

Set env var:

```env
NEXT_PUBLIC_DEMO_READONLY=true
```

Then in route actions/mutations, gate writes when this is enabled.

## 6) Verify deployment

- `/login` works
- first login routes to `/setup` if soul not complete
- `/dashboard`, `/contacts`, `/deals`, `/activities`, `/forms` render
- `/forms/[orgSlug]/[formSlug]` accepts public submission

## Automation note

A GitHub workflow scaffold can deploy on push once `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` are configured.
