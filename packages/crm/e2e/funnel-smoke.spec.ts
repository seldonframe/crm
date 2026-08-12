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

// Hard production guard for the FLOW tier — this tier creates real data
// (a workspace, a checkout attempt) and must NEVER run against production,
// even if someone sets E2E_FULL=1 by mistake while E2E_BASE_URL still
// points at the production host. This check happens regardless of
// E2E_FULL so the guard can't be bypassed by the same env var that gates
// the tier on.
function isProductionHost(rawBaseUrl: string | undefined): boolean {
  if (!rawBaseUrl) return false;
  try {
    const host = new URL(rawBaseUrl).hostname.toLowerCase();
    return host === "seldonframe.com" || host.endsWith(".seldonframe.com");
  } catch {
    // An unparsable base URL isn't a production host we can identify —
    // fail open on "unknown", not on "safe to mutate".
    return false;
  }
}

function isMarketingHost(rawBaseUrl: string | undefined): boolean {
  if (!rawBaseUrl) return false;
  try {
    const host = new URL(rawBaseUrl).hostname.toLowerCase();
    return (
      host === "seldonframe.com" ||
      host === "www.seldonframe.com" ||
      (host.startsWith("crm-git-") && host.endsWith(".vercel.app"))
    );
  } catch {
    return false;
  }
}

function isProductionMarketingHost(rawBaseUrl: string | undefined): boolean {
  if (!rawBaseUrl) return false;
  try {
    const host = new URL(rawBaseUrl).hostname.toLowerCase();
    return host === "seldonframe.com" || host === "www.seldonframe.com";
  } catch {
    return false;
  }
}

const FLOW_BASE_URL = process.env.E2E_BASE_URL;
const FLOW_IS_PRODUCTION = isProductionHost(FLOW_BASE_URL);

test.describe("render tier (GET-only, safe everywhere)", () => {
  test("GET / is healthy", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    if (isProductionMarketingHost(FLOW_BASE_URL)) {
      expect(new URL(page.url()).pathname).toBe("/");
      await expect(page.getByRole("heading", { name: /Sell AI front offices/i })).toBeVisible();
      await expect(
        page.locator('header[aria-label="Primary navigation"]').getByRole("link", {
          name: "For agencies",
          exact: true,
        }),
      ).toHaveAttribute("href", "/agencies");
    } else {
      expect(new URL(page.url()).pathname).toBe("/login");
      await expect(page.getByRole("heading", { name: "Welcome to SeldonFrame" })).toBeVisible();
    }

    const body = await page.content();
    expect(body).not.toMatch(BROKEN_PAGE_PATTERN);
  });

  test("GET /agencies exposes the agency delivery path", async ({ page }) => {
    test.skip(!isMarketingHost(FLOW_BASE_URL), "marketing surface check requires the marketing host");
    const response = await page.goto("/agencies");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: /Deploy one playbook/i })).toBeVisible();
    await expect(
      page.locator('a[href="/pricing-public"]').filter({ hasText: /See agency plans/i }),
    ).toHaveAttribute("href", "/pricing-public");
  });

  test("GET /docs exposes the agency-first docs hub", async ({ page }) => {
    test.skip(!isMarketingHost(FLOW_BASE_URL), "marketing surface check requires the marketing host");
    const response = await page.goto("/docs");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "SeldonFrame Docs" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Agency delivery loop/i })).toHaveAttribute(
      "href",
      "/docs/getting-started/first-workspace",
    );
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
    // Durable structural sentinels, not marketing copy: the email input
    // (shared shape with /login) plus the submit button text, which is
    // unique to signup-form.tsx ("...email link" vs login's "...email").
    // A marketing-copy sentinel here couples deploy-demo to unrelated
    // landing-copy edits — see BLOCKING review 2026-08-06.
    await expect(page.getByPlaceholder("you@company.com")).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue with email link" })).toBeVisible();

    const body = await page.content();
    expect(body).not.toMatch(BROKEN_PAGE_PATTERN);
  });

  test("GET /login renders the login page", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.status()).toBe(200);
    // Durable structural sentinels — see /signup test above for rationale.
    await expect(page.getByPlaceholder("you@company.com")).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue with email" })).toBeVisible();

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
  // This guard must trigger even when E2E_FULL=1 — it is the last line of
  // defense against accidentally mutating production, not a convenience.
  test.skip(FLOW_IS_PRODUCTION, `refusing to run the data-creating flow tier against production host (${FLOW_BASE_URL})`);

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
