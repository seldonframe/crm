// PostHog person-funnel event builders — pure functions so payload shape,
// the distinct-id fallback rule, and the null-on-missing-ids contract are
// unit-testable without a network call. Mirrors llm-capture.spec.ts's
// prototype-patch pattern for captureFunnelEvent (no DI seam in
// captureServerEvent — see capture.ts).
//
// Run:
//   node --import tsx --test tests/unit/analytics/funnel-events.spec.ts

import { describe, test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test_key_funnel_events";

import { PostHog } from "posthog-node";
import {
  buildSignedUpEvent,
  buildWorkspaceCreatedEvent,
  buildCheckoutStartedEvent,
  captureFunnelEvent,
  aliasOrgToUser,
} from "../../../src/lib/analytics/funnel";

describe("buildSignedUpEvent", () => {
  test("distinct_id = userId when userId present, org_id always attached", () => {
    const result = buildSignedUpEvent({ userId: "user-1", orgId: "org-1", email: "a@b.com" });
    assert.deepEqual(result, {
      event: "signed_up",
      distinctId: "user-1",
      properties: {
        org_id: "org-1",
        $set: { email: "a@b.com" },
      },
    });
  });

  test("distinct_id falls back to orgId when userId is missing", () => {
    const result = buildSignedUpEvent({ orgId: "org-1" });
    assert.equal(result?.distinctId, "org-1");
  });

  test("returns null when both userId and orgId are missing", () => {
    const result = buildSignedUpEvent({});
    assert.equal(result, null);
  });

  test("method is included when provided, omitted when absent", () => {
    const withMethod = buildSignedUpEvent({ userId: "user-1", orgId: "org-1", method: "google" });
    assert.equal(withMethod?.properties.method, "google");

    const withoutMethod = buildSignedUpEvent({ userId: "user-1", orgId: "org-1" });
    assert.equal("method" in (withoutMethod?.properties ?? {}), false);
  });

  test("email is omitted from $set when not provided", () => {
    const result = buildSignedUpEvent({ userId: "user-1", orgId: "org-1" });
    assert.equal("$set" in (result?.properties ?? {}), false);
  });
});

describe("buildWorkspaceCreatedEvent", () => {
  test("distinct_id = userId when present, org_id always attached", () => {
    const result = buildWorkspaceCreatedEvent({ userId: "user-1", orgId: "org-1", source: "mcp_atomic" });
    assert.deepEqual(result, {
      event: "workspace_created",
      distinctId: "user-1",
      properties: { org_id: "org-1", source: "mcp_atomic" },
    });
  });

  test("distinct_id falls back to orgId when userId is missing", () => {
    const result = buildWorkspaceCreatedEvent({ orgId: "org-1", source: "mcp_atomic" });
    assert.equal(result?.distinctId, "org-1");
  });

  test("returns null when orgId is missing", () => {
    const result = buildWorkspaceCreatedEvent({ userId: "user-1", source: "mcp_atomic" });
    assert.equal(result, null);
  });

  test("is_internal passes through when provided", () => {
    const result = buildWorkspaceCreatedEvent({ orgId: "org-1", source: "mcp_atomic", isInternal: true });
    assert.equal(result?.properties.is_internal, true);
  });

  test("is_internal omitted when not provided", () => {
    const result = buildWorkspaceCreatedEvent({ orgId: "org-1", source: "mcp_atomic" });
    assert.equal("is_internal" in (result?.properties ?? {}), false);
  });
});

describe("buildCheckoutStartedEvent", () => {
  test("distinct_id = userId (required), org_id + workspace_id attached", () => {
    const result = buildCheckoutStartedEvent({
      userId: "user-1",
      orgId: "org-1",
      workspaceId: "ws-1",
      tier: "workspace",
    });
    assert.deepEqual(result, {
      event: "checkout_started",
      distinctId: "user-1",
      properties: { org_id: "org-1", workspace_id: "ws-1", tier: "workspace" },
    });
  });

  test("returns null when userId is missing", () => {
    const result = buildCheckoutStartedEvent({ orgId: "org-1", workspaceId: "ws-1", tier: "workspace" });
    assert.equal(result, null);
  });

  test("returns null when orgId is missing", () => {
    const result = buildCheckoutStartedEvent({ userId: "user-1", workspaceId: "ws-1", tier: "workspace" });
    assert.equal(result, null);
  });

  test("workspace_id omitted entirely when absent", () => {
    const result = buildCheckoutStartedEvent({ userId: "user-1", orgId: "org-1", tier: "workspace" });
    assert.equal("workspace_id" in (result?.properties ?? {}), false);
  });

  test("price_id used instead of tier for the legacy path", () => {
    const result = buildCheckoutStartedEvent({
      userId: "user-1",
      orgId: "org-1",
      workspaceId: "ws-1",
      priceId: "price_123",
    });
    assert.equal(result?.properties.price_id, "price_123");
    assert.equal("tier" in (result?.properties ?? {}), false);
  });

  test("is_internal passes through when provided", () => {
    const result = buildCheckoutStartedEvent({
      userId: "user-1",
      orgId: "org-1",
      workspaceId: "ws-1",
      tier: "workspace",
      isInternal: true,
    });
    assert.equal(result?.properties.is_internal, true);
  });
});

describe("captureFunnelEvent", () => {
  type CapturedEvent = {
    distinctId: string;
    event: string;
    properties?: Record<string, unknown>;
  };

  let captured: CapturedEvent[] = [];
  const originalCaptureImmediate = PostHog.prototype.captureImmediate;

  beforeEach(() => {
    captured = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (PostHog.prototype as any).captureImmediate = async function (event: CapturedEvent) {
      captured.push(event);
      return undefined;
    };
  });

  afterEach(() => {
    PostHog.prototype.captureImmediate = originalCaptureImmediate;
  });

  test("delegates to captureServerEvent with the built payload", () => {
    captureFunnelEvent(buildSignedUpEvent({ userId: "user-1", orgId: "org-1" }));
    assert.equal(captured.length, 1);
    assert.equal(captured[0].event, "signed_up");
    assert.equal(captured[0].distinctId, "user-1");
  });

  test("no-ops silently when given null (malformed input upstream)", () => {
    captureFunnelEvent(null);
    assert.equal(captured.length, 0);
  });
});

describe("aliasOrgToUser", () => {
  type AliasCall = { distinctId: string; alias: string };

  let aliased: AliasCall[] = [];
  const originalAliasImmediate = PostHog.prototype.aliasImmediate;

  beforeEach(() => {
    aliased = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (PostHog.prototype as any).aliasImmediate = async function (data: AliasCall) {
      aliased.push(data);
      return undefined;
    };
  });

  afterEach(() => {
    PostHog.prototype.aliasImmediate = originalAliasImmediate;
  });

  test("delegates to the posthog-node client with {distinctId: userId, alias: orgId}", () => {
    aliasOrgToUser("user-1", "org-1");
    assert.equal(aliased.length, 1);
    assert.deepEqual(aliased[0], { distinctId: "user-1", alias: "org-1" });
  });

  test("no-ops when userId is missing", () => {
    aliasOrgToUser(null, "org-1");
    assert.equal(aliased.length, 0);
  });

  test("no-ops when orgId is missing", () => {
    aliasOrgToUser("user-1", null);
    assert.equal(aliased.length, 0);
  });

  test("no-ops when both are missing", () => {
    aliasOrgToUser(undefined, undefined);
    assert.equal(aliased.length, 0);
  });
});
