# Tracking delta: current → target

## Add

- `pricing_plan_selected`
- `account_created`
- `checkout_started`
- `subscription_started`
- `workspace_build_started`
- `workspace_created` PostHog canonical event alongside the existing database event
- `first_test_booking_completed`
- `workspace_went_live`
- PostHog `identify`, workspace/agency `group`, and logout `reset`
- GA4 server-side `sign_up`, `begin_checkout`, and `purchase`

## Keep

- Existing database `trackEvent` events, including `workspace_created_full`, `plan_upgraded`, and `activation_step_completed`
- Existing browser page/session analytics

## Change

- Paid pricing CTAs now preserve a validated plan through both magic-link and Google authentication.
- Checkout capture is emitted only after Stripe successfully creates a Checkout session.
- Subscription purchase capture is emitted only for the first transition from free/inactive to paid and is protected by Stripe event deduplication.
