import posthog from "posthog-js";

// PostHog Cloud US, project 497925. The key is the PUBLISHABLE client key —
// public by design (ships in the bundle); revenue stays server-side. Email
// is a deliberate exception to "PII stays server-side": as of the
// 2026-08-06 funnel-observability work, IdentifyOnAuth
// (components/analytics/identify-on-auth.tsx) sets it as a person
// property via posthog.identify() so the signed_up -> checkout_started
// funnel is readable by email in the PostHog UI, not just by opaque id.
// api_host points at our own /ingest reverse proxy (next.config rewrites →
// us.i.posthog.com) so ad-blockers don't eat events; ui_host keeps deep links
// into the PostHog app working.
if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true, // error tracking product
  });
}
