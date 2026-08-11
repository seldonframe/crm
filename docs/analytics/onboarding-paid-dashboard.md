# Onboarding → Paid analytics setup

The product emits the lifecycle contract documented in `.telemetry/tracking-plan.yaml`.

## PostHog saved dashboard

The dashboard is already created in the SeldonFrame PostHog project:
[Onboarding → Paid](https://us.posthog.com/project/497925/dashboard/1982206).

Saved insight IDs:

- Activation funnel (14 days): `9bNmoVbS`
- Paid intent funnel (24 hours): `tNzd7X6U`
- Paid intent by plan: `5PVb7kEL`
- Paid intent by checkout source: `IvIQjdUZ`
- Paid intent by acquisition source: `iKTsAQWF`
- Signup-week cohort: activation, live, paid: `tUdK3BHX`

Create a dashboard named **Onboarding → Paid** and filter every insight with:

```
is_internal != true
```

Add these insights:

1. Ordered 14-day activation funnel: `account_created`, `workspace_build_started`, `workspace_created`, `first_test_booking_completed`, `workspace_went_live`, `subscription_started`.
2. Ordered 24-hour paid-intent funnel: `pricing_plan_selected`, `checkout_started`, `subscription_started`.
3. Weekly signup cohort table, broken down by `$initial_utm_source` and `$initial_referring_domain`.
4. Median time between each activation step.
5. D1/D7/D14 retention using `$pageview` on authenticated product routes or a meaningful product event.

Break down paid-intent by `plan_id` and `checkout_source`. Create alerts for missing `account_created`, a checkout-to-subscription conversion drop, and missing required properties.

## GA4 Admin

Mark `sign_up`, `begin_checkout`, and `purchase` as Key Events. Verify one test-mode signup, Checkout session, and Stripe webhook in DebugView/Realtime. GA4 is a conversion counter; use PostHog for acquisition attribution and cohorts.

## Founder outreach

Manually select the newest 10–15 legitimate free users, exclude internal/preview/test accounts, and send one personal plain-text email at a time. Use the direct-reply offer: “I’ll get your first client front office live with you in 20 minutes.” Keep the outreach log outside PostHog and create a PostHog cohort from user IDs only.
