// 2026-08-23 — signup attribution (the "make the next wave attributable"
// wave; the Aug-22 traffic surge was 81% direct/no-UTM and unattributable).
// Pure helpers, no I/O and no posthog imports, so both the client signup
// form and the server auth event path can use them; unit-tested in
// tests/unit/analytics/signup-attribution.spec.ts.
//
// Two jobs:
//  1. Normalize the optional "How did you hear about us?" answer the
//     signup form captures (allowlist clamp — free-text or tampered
//     values are dropped, never stored).
//  2. Parse posthog-js's persistence cookie so the SERVER-side signed_up
//     event can carry first-touch attribution ($initial_utm_*,
//     $initial_referrer) and stitch the anonymous browser person to the
//     new user id even when the user never renders a bridge-mounted page
//     after signup (magic link opened in a different browser, drop-off
//     before /clients/new paints). Cookie shape (posthog-js with
//     cross_subdomain persistence on .seldonframe.com):
//     ph_<PROJECT_KEY>_posthog = URI-encoded JSON carrying distinct_id
//     and $initial_person_info { u: first-touch URL, r: referrer }.

export const HEAR_ABOUT_OPTIONS = [
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X / Twitter" },
  { value: "google", label: "Google search" },
  { value: "chatgpt", label: "ChatGPT / AI assistant" },
  { value: "reddit", label: "Reddit" },
  { value: "github", label: "GitHub" },
  { value: "friend", label: "Friend or colleague" },
  { value: "other", label: "Somewhere else" },
] as const;

export type HearAboutChannel = (typeof HEAR_ABOUT_OPTIONS)[number]["value"];

/** Allowlist clamp for the survey answer. Anything not exactly one of the
 *  option values (after trim/lowercase) returns null — reject, don't
 *  store, per the Optimistic Path rule (CLAUDE.md §3.1). */
export function normalizeHearAbout(value: unknown): HearAboutChannel | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().toLowerCase();
  const match = HEAR_ABOUT_OPTIONS.find((option) => option.value === trimmed);
  return match ? match.value : null;
}

export type PosthogCookieInfo = {
  anonDistinctId: string | null;
  initialUrl: string | null;
  initialReferrer: string | null;
};

const EMPTY_COOKIE_INFO: PosthogCookieInfo = {
  anonDistinctId: null,
  initialUrl: null,
  initialReferrer: null,
};

/** posthog-js persistence cookie name for a project key, or null when the
 *  key is unset (PostHog disabled — attribution is then a no-op). */
export function posthogCookieName(projectKey: string | null | undefined): string | null {
  const key = projectKey?.trim();
  return key ? `ph_${key}_posthog` : null;
}

/** Best-effort parse of the posthog-js cookie value. Any malformed input
 *  (missing, not JSON, unexpected shape) returns the empty info object —
 *  attribution is enrichment and must never throw into the auth path. */
export function parsePosthogCookieValue(raw: string | null | undefined): PosthogCookieInfo {
  if (!raw || typeof raw !== "string") return EMPTY_COOKIE_INFO;

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as {
      distinct_id?: unknown;
      $initial_person_info?: { u?: unknown; r?: unknown } | null;
    };
    const distinctId =
      typeof parsed.distinct_id === "string" && parsed.distinct_id.trim()
        ? parsed.distinct_id
        : null;
    const info = parsed.$initial_person_info;
    return {
      anonDistinctId: distinctId,
      initialUrl: typeof info?.u === "string" && info.u ? info.u : null,
      initialReferrer: typeof info?.r === "string" && info.r ? info.r : null,
    };
  } catch {
    return EMPTY_COOKIE_INFO;
  }
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** Extract utm_* params from a first-touch URL. Invalid/absent URLs (and
 *  URLs with no utm params) return {} — callers treat that as "nothing to
 *  attach", never an error. */
export function extractUtmParams(url: string | null | undefined): Record<string, string> {
  if (!url) return {};

  try {
    const parsed = new URL(url);
    const out: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = parsed.searchParams.get(key)?.trim();
      if (value) out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}
