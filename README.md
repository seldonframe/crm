# Seldon Frame

Open source CRM framework for developers and builders.

Fork it, customize it for a niche, deploy it for clients, and charge setup + maintenance.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/seldon-frame&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL,NEXT_PUBLIC_APP_URL,ANTHROPIC_API_KEY)

## Why this exists

Most open source CRMs are positioned as products. Seldon Frame is positioned as a framework:

- Framework, not fixed product
- Multi-tenant from day one (`org_id` on core data)
- Soul System onboarding that reshapes labels, pipeline, fields, voice, and branding
- AI-native with graceful degradation when `ANTHROPIC_API_KEY` is not configured
- One-click deploy path with Vercel + Neon
- Niche variants via config and soul templates

## Tech stack

- Next.js App Router + React + Tailwind + shadcn/ui
- Neon Postgres + Drizzle ORM
- NextAuth v5 (Auth.js) with credentials + optional OAuth
- Anthropic Claude for optional AI features
- pnpm

### Why this stack

- Neon over Supabase: serverless Postgres + branching + no lock-in on app/auth architecture
- Drizzle over Prisma: lightweight, type-safe, fast in serverless contexts
- NextAuth over platform auth: provider flexibility and portable architecture
- Claude over OpenAI: strong structured output and instruction following for CRM intelligence

## Features

### Soul System
- Multi-step setup wizard at `/setup`
- AI generation when key exists, rule-based fallback otherwise
- Stored in `organizations.soul` (`jsonb`)
- Runtime label + branding resolution via `useSoul()`, `useLabels()`, and `getLabels()`

### Core CRM modules
- Contacts list + detail timeline
- Deals list + kanban board + stage updates
- Activities feed + quick logging
- Intake forms (internal and public)
- Settings sections (profile, pipeline, fields, team, webhooks, API)
- Headless API under `/api/v1`

### API
- API key verification (`x-api-key`)
- Org scoping via `x-org-id`
- Rate limiting guard
- CRUD routes for contacts, deals, activities, forms submissions, and webhooks

## Quick start

```bash
pnpm install
cp .env.example .env.local
pnpm db:generate
pnpm dev
```

Open `http://localhost:3000`.

## Environment

See `.env.example`.

Required for core app:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

Optional:
- `GOOGLE_*`, `GITHUB_*`
- `ANTHROPIC_API_KEY`

## Project structure

- `framework.config.ts` developer-level deployment defaults
- `src/lib/soul/*` soul generation/resolution/template engine
- `src/db/schema/*` multi-tenant schema
- `src/app/(dashboard)/*` CRM UI routes
- `src/app/api/v1/*` headless routes
- `showcase/*` niche packs

## Showcase gallery

See `showcase/README.md` and each niche directory:
- `showcase/coaching`
- `showcase/real-estate`
- `showcase/agency`
- `showcase/ecommerce`
- `showcase/saas`

## Contributing

1. Fork repository
2. Create feature branch
3. Keep changes scoped and typed
4. Run `pnpm lint && pnpm build`
5. Open PR

## License

MIT
