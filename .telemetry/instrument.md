# SeldonFrame instrumentation guide

## SDKs and architecture

- Browser PostHog: `posthog-js`, initialized in `src/instrumentation-client.ts`.
- Server PostHog: `posthog-node` through `src/lib/analytics/capture.ts`.
- GA4: Measurement Protocol through `src/lib/analytics/ga4.ts`.
- Database analytics: existing `trackEvent` remains for operational compatibility.

## Identity

After authentication, the dashboard and pricing surfaces call `posthog.identify(userId, traits)`.
Email and name are identify traits only. Workspace and agency are PostHog groups.
Logout calls `posthog.reset()`.

## Server event rules

- Capture only after the authoritative state transition succeeds.
- Capture server events fire-and-forget and never block the product path.
- Every lifecycle event includes `is_internal`; saved reports filter it out.
- Event properties contain IDs and dimensions, never email or name.
- GA receives only `sign_up`, `begin_checkout`, and `purchase`.
