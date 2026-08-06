# Funnel smoke (Playwright)

`funnel-smoke.spec.ts` is a small, deliberately narrow end-to-end suite covering
the signup/login/pricing funnel plus the AUTH_SECRET sentinel
(`/api/auth/providers`).

## Two tiers

- **RENDER tier** — GET-only, no auth, no writes. Safe to run against
  production. Runs by default.
- **FLOW tier** — creates a real workspace via
  `POST /api/v1/workspaces/create-full`. Gated behind `E2E_FULL=1` and
  **must never run against production** — only point it at a disposable
  environment.

## Running locally

```bash
# once, to fetch the browser binary
npx playwright install chromium

# RENDER tier against local dev (next dev on :3000)
pnpm --filter @seldonframe/crm exec playwright test

# RENDER tier against a deployed URL
E2E_BASE_URL=https://your-preview.vercel.app pnpm --filter @seldonframe/crm exec playwright test

# FLOW tier — disposable environments ONLY
E2E_FULL=1 E2E_BASE_URL=https://your-disposable-env pnpm --filter @seldonframe/crm exec playwright test
```

## CI gates

- `.github/workflows/ci.yml` — `e2e-smoke` job runs the RENDER tier only,
  and only when the `E2E_BASE_URL` repository variable is configured
  (`vars.E2E_BASE_URL`). `E2E_FULL` is never set in CI.
- `.github/workflows/deploy-demo.yml` — after a successful deploy, runs
  the RENDER tier against the deployed URL (or
  `https://app.seldonframe.com` as a fallback) as a post-deploy smoke.
