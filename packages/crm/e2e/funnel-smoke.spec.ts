// packages/crm/e2e/funnel-smoke.spec.ts
//
// Two-tier funnel smoke.
//
// RENDER tier — always runs, strictly GET-only, safe against ANY
// environment including production. No mutation, no auth, no
// destructive calls. This is what CI and the post-deploy gate run.
//
// FLOW tier — creates a real workspace via the public atomic-create
// endpoint. Gated behind E2E_FULL=1 so it can never run by default
// (in CI or locally) and never against production. Only point
// E2E_BASE_URL at a disposable environment when running this tier.

import { test, expect } from "@playwright/test";

const BROKEN_PAGE_PATTERN = /Application error|missingsecret/i;

test.describe("render tier (GET-only, safe everywhere)", () => {
  test("GET / renders the marketing landing page", async ({ page, request }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    // Stable structural sentinel from the fixed marketing nav
    // (src/components/landing/marketing-nav.tsx) — not marketing copy,
    // won't churn with headline/positioning rewrites.
    await expect(page.getByLabel("SeldonFrame — home")).toBeVisible();

    const body = await page.content();
    expect(body).not.toMatch(BROKEN_PAGE_PATTERN);
    void request;
  });

  test("GET /api/auth/providers exposes at least one provider (AUTH_SECRET sentinel)", async ({
    request,
  }) => {
    // NextAuth's own providers endpoint 500s (or returns a non-JSON error
    // page) when AUTH_SECRET is missing — this is the exact incident class
    // this test guards against.
    const response = await request.get("/api/auth/providers");
    expect(response.status()).toBe(200);

    const body = (await response.json()) as Record<string, unknown>;
    expect(typeof body).toBe("object");
    expect(Object.keys(body).length).toBeGreaterThan(0);
  });

  test("GET /signup renders the signup page", async ({ page }) => {
    const response = await page.goto("/signup");
    expect(response?.status()).toBe(200);
    // Unique to /signup (login shares the same h1 but not this subline).
    await expect(
      page.getByText("Your website, booking, CRM, and AI receptionist", { exact: false })
    ).toBeVisible();

    const body = await page.content();
    expect(body).not.toMatch(BROKEN_PAGE_PATTERN);
  });

  test("GET /login renders the login page", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.status()).toBe(200);
    // Unique to /login (signup shares the same h1 but not this subline).
    await expect(
      page.getByText("The operating system for your business.", { exact: false })
    ).toBeVisible();

    const body = await page.content();
    expect(body).not.toMatch(BROKEN_PAGE_PATTERN);
  });

  test("GET /pricing renders the pricing page", async ({ page }) => {
    const response = await page.goto("/pricing");
    expect(response?.status()).toBe(200);
    // Present in both the flag-off (Accordion) and SF_TIER_LADDER-on
    // (details/summary) renderings — see src/app/pricing/page.tsx.
    await expect(page.getByText("Frequently asked", { exact: false }).first()).toBeVisible();

    const body = await page.content();
    expect(body).not.toMatch(BROKEN_PAGE_PATTERN);
  });
});

test.describe("flow tier (creates data — E2E_FULL=1 only, disposable envs only)", () => {
  test.skip(process.env.E2E_FULL !== "1", "set E2E_FULL=1 to run the data-creating flow tier");

  test("create-full workspace -> public workspace page -> checkout route is alive", async ({
    request,
  }) => {
    // 1. POST /api/v1/workspaces/create-full — minimal valid payload.
    const createResponse = await request.post("/api/v1/workspaces/create-full", {
      data: {
        business_name: `E2E Smoke Test Co ${Date.now()}`,
        city: "Phoenix",
        state: "AZ",
        phone: "+16025551234",
        services: ["HVAC repair"],
        business_description: "Playwright funnel smoke test workspace.",
      },
    });
    expect(createResponse.status()).toBe(200);

    const created = (await createResponse.json()) as {
      status: string;
      workspace_id?: string;
      slug?: string;
    };
    expect(created.status).toBe("ready");
    expect(created.slug).toBeTruthy();

    // 2. GET the public workspace page for the new slug.
    const workspaceResponse = await request.get(`/w/${created.slug}`);
    expect(workspaceResponse.status()).toBe(200);

    // 3. POST /api/stripe/checkout unauthenticated — asserts the route is
    // ALIVE (any deliberate 4xx/redirect is fine; a 5xx is not). We don't
    // attempt an authenticated checkout or an agent LLM conversation here
    // (needs live keys/session) — that's out of scope for this smoke.
    const checkoutResponse = await request.post("/api/stripe/checkout", {
      data: { tier: "builder" },
    });
    expect(checkoutResponse.status()).toBeLessThan(500);
    expect(checkoutResponse.status()).toBeGreaterThanOrEqual(400);
  });
});
