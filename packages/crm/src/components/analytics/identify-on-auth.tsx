"use client";

// 2026-08-06 funnel observability — $identify for the authenticated
// dashboard. posthog-js is already initialized globally
// (instrumentation-client.ts runs on every route) — this just calls
// posthog.identify() once per (userId, email, orgId) tuple so the person
// record carries org_id, matching the same posthog-js singleton
// share-visit-beacon.tsx uses. posthog-js queues calls made before init
// completes, so there's no need to gate on an internal __loaded flag —
// just call identify directly and let the try/catch absorb anything
// unexpected. Guards on userId being present — synthetic sessions (admin
// token, operator portal) have no real user id to identify.
//
// org_id is the user's HOME org (user.orgId), not whatever workspace is
// currently active — an agency user switching between client workspaces
// must not rewrite their own person record's org_id every switch.
// active_org_id carries the switched-to workspace separately, when known.

import { useEffect, useRef } from "react";
import posthog from "posthog-js";

export function IdentifyOnAuth({
  userId,
  email,
  orgId,
  activeOrgId,
}: {
  userId: string | null;
  email: string | null;
  /** The user's home org — stable identity, not the active workspace. */
  orgId: string | null;
  /** The currently active/switched-to workspace, if different and known. */
  activeOrgId?: string | null;
}) {
  const lastIdentified = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const key = `${userId}:${email ?? ""}:${orgId ?? ""}:${activeOrgId ?? ""}`;
    if (lastIdentified.current === key) return;
    lastIdentified.current = key;

    try {
      posthog.identify(userId, {
        email: email ?? undefined,
        org_id: orgId ?? undefined,
        active_org_id: activeOrgId ?? undefined,
      });
    } catch {
      // Never let an identify call throw into the dashboard render path.
    }
  }, [userId, email, orgId, activeOrgId]);

  return null;
}
