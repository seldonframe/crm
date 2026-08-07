// Auth secret hardening — resolveAuthSecret is a pure function extracted
// from auth.ts so the resolution order (AUTH_SECRET wins over
// NEXTAUTH_SECRET, whitespace-only treated as missing, trims surrounding
// whitespace, both absent -> undefined) is unit-testable without booting
// NextAuth.
//
// Run:
//   node --import tsx --test tests/unit/auth/resolve-auth-secret.spec.ts

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { resolveAuthSecret } from "../../../auth";

describe("resolveAuthSecret", () => {
  test("AUTH_SECRET wins over NEXTAUTH_SECRET when both are set", () => {
    const result = resolveAuthSecret({
      AUTH_SECRET: "auth-secret-value",
      NEXTAUTH_SECRET: "nextauth-secret-value",
    });
    assert.equal(result, "auth-secret-value");
  });

  test("falls back to NEXTAUTH_SECRET when AUTH_SECRET is absent", () => {
    const result = resolveAuthSecret({
      NEXTAUTH_SECRET: "nextauth-secret-value",
    });
    assert.equal(result, "nextauth-secret-value");
  });

  test("whitespace-only AUTH_SECRET is treated as missing, falls through", () => {
    const result = resolveAuthSecret({
      AUTH_SECRET: "   ",
      NEXTAUTH_SECRET: "nextauth-secret-value",
    });
    assert.equal(result, "nextauth-secret-value");
  });

  test("whitespace-only NEXTAUTH_SECRET (and no AUTH_SECRET) resolves to undefined", () => {
    const result = resolveAuthSecret({
      NEXTAUTH_SECRET: "   ",
    });
    assert.equal(result, undefined);
  });

  test("trims surrounding whitespace from AUTH_SECRET", () => {
    const result = resolveAuthSecret({
      AUTH_SECRET: "  auth-secret-value  ",
    });
    assert.equal(result, "auth-secret-value");
  });

  test("trims surrounding whitespace from NEXTAUTH_SECRET fallback", () => {
    const result = resolveAuthSecret({
      NEXTAUTH_SECRET: "\tnextauth-secret-value\n",
    });
    assert.equal(result, "nextauth-secret-value");
  });

  test("both absent resolves to undefined", () => {
    const result = resolveAuthSecret({});
    assert.equal(result, undefined);
  });
});
