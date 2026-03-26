# Showcase Configs

Pick a niche, copy the `framework.config.ts`, optionally import the matching `soul-template.json`, and load `seed.sql` for demo data.

## Included Niches
- coaching
- real-estate
- agency
- ecommerce
- saas

## Quick Start
1. Copy `showcase/<niche>/framework.config.ts` to project root as `framework.config.ts`.
2. Insert `showcase/<niche>/soul-template.json` into `organizations.soul` for your demo org.
3. Run `showcase/<niche>/seed.sql` against your Neon database.
4. Launch with `pnpm dev`.
