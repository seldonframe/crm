// packages/crm/playwright.config.ts
//
// Funnel smoke coverage — a small, deliberately narrow Playwright suite
// (see e2e/funnel-smoke.spec.ts). RENDER tier is GET-only and safe to
// run against production; FLOW tier writes data and is gated behind
// E2E_FULL=1 inside the spec itself, never by this config.

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
