# Funnel events that all work individually can still be unjoinable — distinct-id spaces are the funnel

**Date:** 2026-08-06 · **Branch:** feat/funnel-observability · **Related:** packages/crm/src/lib/analytics/funnel.ts, tasks/todo.md (funnel observability task)

## 1. The problem, in one line
Three correctly-firing PostHog events (`workspace_created`, `signed_up`, `checkout_started`) produced a funnel that would read ~0% on the product's primary path, because the first was keyed to an orgId and the other two to a userId, and PostHog treats those as two unrelated persons.

## 2. The approach
1. Before instrumenting, list every event's distinct_id at its REAL call site — not the intended id, the one actually in scope. (Here: `createFullWorkspace` runs before any user exists on the anonymous build-first path, so only orgId is available; signup/checkout have userId.)
2. If any two funnel stages key to different id spaces, the funnel is broken regardless of how correct each event is. Ask: where does the identity link happen in the DOMAIN? For build-anonymously-then-claim products, it is the moment ownership is assigned.
3. Find every code site that assigns ownership (here: grep for Drizzle `.update(organizations).set({ ownerId: ... })` — six sites) and fire `posthog alias(distinctId: userId, alias: orgId)` at each, fire-and-forget, lazy-imported.
4. Client-side is a THIRD id space (device anon-id): `posthog.identify(userId)` in the authenticated layout merges it.
5. Verify joinability as its own review question ("can these events be assembled into the named funnel?") — unit tests on payload shape will never catch this; ours were all green while the funnel was dead.

## 3. Judgment calls
- **Deliberately NO alias on the agency operator-claim path** (link-workspace-to-operator.ts). One operator claims many client workspaces; PostHog person merges are irreversible, so aliasing there would permanently fold 50 client pseudo-persons into one operator. Wrong-side default: when in doubt, don't merge — you can add a missing alias later, you can never split a merged person. Client workspaces should become a PostHog *group* if org-level funnels are ever needed on that path.
- Kept the alias on inline-org signup paths even though no org-keyed event precedes it there (one wasted `$create_alias` per signup) — uniformity at the claim sites beats a conditional that will rot.
- Did NOT switch to PostHog group analytics for the main funnel: it's a paid add-on and person-level joins were achievable with alias.

## 4. The reusable rule, one line
Before wiring any multi-stage analytics funnel, write down each stage's distinct-id AT ITS CALL SITE and refuse to ship until they provably join — and never alias/merge persons on any path where one actor claims many entities.
