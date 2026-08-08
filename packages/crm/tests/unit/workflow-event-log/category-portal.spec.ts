// SLICE 1-a Commit 3 — portal category per-site persistence tests.
// 2 files, 4 sites.

import { describe, test } from "node:test";

import { assertEmitOrgId, assertOrgIdExpr } from "./emit-site-extractor";

describe("SLICE 1-a — portal/actions.ts (2 sites)", () => {
  test("line 79 portal.message_sent — session.orgId", () => {
    assertOrgIdExpr("src/lib/portal/actions.ts", 79, "session.orgId");
  });
  test("line 156 portal.resource_viewed — session.orgId", () => {
    assertOrgIdExpr("src/lib/portal/actions.ts", 156, "session.orgId");
  });
});

// 2026-08-07 — switched these two sites from line-anchored (assertOrgIdExpr)
// to event-name-anchored (assertEmitOrgId). The product did NOT change: at
// 34a6a430c (the commit that added this spec) auth.ts:165 was
// `{ orgId: org.id }` and auth.ts:261 was `{ orgId: session.orgId }` — the same
// two expressions live today at auth.ts:310 and auth.ts:413. Only the line
// numbers moved, because the file grew above both sites (Measurement-Layer
// trackEvent blocks, and f0518dcd2 "one-click /demo URL" which added a THIRD
// portal.login emit). assertOrgIdExpr resolves "the FIRST emitSeldonEvent at or
// after line N", so line 261 started resolving to the access-code site and the
// refresh-flow assertion failed with got="org.id". The line-165 case was still
// green, but only by accident — it too would have silently asserted the wrong
// call on the next insertion, so it is migrated in the same edit.
// Expected values are unchanged; site identity is strengthened from a line pin
// to event + enclosing function.
// NOTE: the third site (establishPortalDemoSession, auth.ts:478) is not
// asserted here — enclosingFunctionName() currently reports null for it, so it
// cannot be selected by inFunction. Fixing that helper is out of scope.
describe("SLICE 1-a — portal/auth.ts (2 sites)", () => {
  test("portal.login (access-code flow) — org.id", () => {
    assertEmitOrgId(
      "src/lib/portal/auth.ts",
      { event: "portal.login", inFunction: "verifyPortalAccessCodeAction" },
      "org.id",
    );
  });
  test("portal.login (refresh flow) — session.orgId", () => {
    assertEmitOrgId(
      "src/lib/portal/auth.ts",
      { event: "portal.login", inFunction: "establishPortalMagicSession" },
      "session.orgId",
    );
  });
});
