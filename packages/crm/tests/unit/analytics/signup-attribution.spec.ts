// 2026-08-23 — signup attribution helpers (lib/analytics/signup-attribution)
// plus the buildSignedUpEvent attribution extension (lib/analytics/funnel).
// Pure-function tests, no DB, no PostHog client.

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import {
  HEAR_ABOUT_OPTIONS,
  extractUtmParams,
  normalizeHearAbout,
  parsePosthogCookieValue,
  posthogCookieName,
} from "@/lib/analytics/signup-attribution";
import { buildSignedUpEvent } from "@/lib/analytics/funnel";

describe("normalizeHearAbout — allowlist clamp", () => {
  test("accepts every declared option value verbatim", () => {
    for (const option of HEAR_ABOUT_OPTIONS) {
      assert.equal(normalizeHearAbout(option.value), option.value);
    }
  });

  test("trims and lowercases before matching", () => {
    assert.equal(normalizeHearAbout("  YouTube "), "youtube");
    assert.equal(normalizeHearAbout("GITHUB"), "github");
  });

  test("rejects free text, empty, and non-strings", () => {
    assert.equal(normalizeHearAbout("my cousin's newsletter"), null);
    assert.equal(normalizeHearAbout(""), null);
    assert.equal(normalizeHearAbout(null), null);
    assert.equal(normalizeHearAbout(undefined), null);
    assert.equal(normalizeHearAbout(42), null);
    assert.equal(normalizeHearAbout({ value: "youtube" }), null);
  });
});

describe("posthogCookieName", () => {
  test("builds ph_<key>_posthog from the project key", () => {
    assert.equal(posthogCookieName("phc_abc123"), "ph_phc_abc123_posthog");
  });

  test("returns null for unset/blank keys (PostHog disabled)", () => {
    assert.equal(posthogCookieName(undefined), null);
    assert.equal(posthogCookieName(null), null);
    assert.equal(posthogCookieName("   "), null);
  });
});

describe("parsePosthogCookieValue — best-effort, never throws", () => {
  test("parses distinct_id and $initial_person_info from URI-encoded JSON", () => {
    const cookie = encodeURIComponent(
      JSON.stringify({
        distinct_id: "anon-device-123",
        $initial_person_info: {
          u: "https://www.seldonframe.com/?utm_source=youtube&utm_medium=video_description",
          r: "https://www.youtube.com/",
        },
      }),
    );
    const info = parsePosthogCookieValue(cookie);
    assert.equal(info.anonDistinctId, "anon-device-123");
    assert.equal(
      info.initialUrl,
      "https://www.seldonframe.com/?utm_source=youtube&utm_medium=video_description",
    );
    assert.equal(info.initialReferrer, "https://www.youtube.com/");
  });

  test("missing fields degrade to nulls, not throws", () => {
    const info = parsePosthogCookieValue(encodeURIComponent(JSON.stringify({ distinct_id: "anon-1" })));
    assert.equal(info.anonDistinctId, "anon-1");
    assert.equal(info.initialUrl, null);
    assert.equal(info.initialReferrer, null);
  });

  test("garbage input returns the empty shape", () => {
    for (const raw of [undefined, null, "", "not-json", "%7Bbroken", encodeURIComponent("[1,2,3]")]) {
      const info = parsePosthogCookieValue(raw);
      assert.equal(info.anonDistinctId, null);
      assert.equal(info.initialUrl, null);
      assert.equal(info.initialReferrer, null);
    }
  });
});

describe("extractUtmParams", () => {
  test("pulls only utm_* keys, trimmed", () => {
    const utm = extractUtmParams(
      "https://seldonframe.com/try?utm_source=x&utm_medium=post&utm_campaign=launch&ref=abc",
    );
    assert.deepEqual(utm, { utm_source: "x", utm_medium: "post", utm_campaign: "launch" });
  });

  test("no params / invalid URL / null all return {}", () => {
    assert.deepEqual(extractUtmParams("https://seldonframe.com/"), {});
    assert.deepEqual(extractUtmParams("not a url"), {});
    assert.deepEqual(extractUtmParams(null), {});
    assert.deepEqual(extractUtmParams(undefined), {});
  });
});

describe("buildSignedUpEvent — attribution extension", () => {
  const base = { userId: "user-1", orgId: "org-1", email: "a@b.com" };

  test("utm lands flat on the event AND as $initial_* under $set_once", () => {
    const event = buildSignedUpEvent({
      ...base,
      attribution: {
        initialUrl: "https://seldonframe.com/?utm_source=youtube",
        initialReferrer: "https://www.youtube.com/",
        utm: { utm_source: "youtube" },
      },
    });
    assert.ok(event);
    assert.equal(event!.properties.utm_source, "youtube");
    assert.deepEqual(event!.properties.$set_once, {
      $initial_utm_source: "youtube",
      $initial_referrer: "https://www.youtube.com/",
      $initial_current_url: "https://seldonframe.com/?utm_source=youtube",
    });
  });

  test("attribution with no usable fields adds no $set_once", () => {
    const event = buildSignedUpEvent({ ...base, attribution: { utm: {} } });
    assert.ok(event);
    assert.equal(event!.properties.$set_once, undefined);
  });

  test("absent attribution keeps the pre-2026-08-23 event shape exactly", () => {
    const event = buildSignedUpEvent(base);
    assert.ok(event);
    assert.deepEqual(event, {
      event: "signed_up",
      distinctId: "user-1",
      properties: {
        org_id: "org-1",
        $set: { email: "a@b.com" },
      },
    });
  });
});
