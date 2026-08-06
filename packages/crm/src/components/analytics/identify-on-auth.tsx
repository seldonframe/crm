"use client";

// 2026-08-06 funnel observability — $identify for the authenticated
// dashboard. posthog-js is already initialized globally
// (instrumentation-client.ts runs on every route) — this just calls
// posthog.identify() once per (userId, email, orgId) tuple so the person
// record carries org_id, matching the same posthog-js singleton
// share-visit-beacon.tsx uses. Guards on posthog being loaded (it no-ops
// when NEXT_PUBLIC_POSTHOG_KEY is unset) and on userId being present —
// synthetic sessions (admin token, operator portal) have no real user id
// to identify.

import { useEffect, useRef } from "react";
import posthog from "posthog-js";

export function IdentifyOnAuth({
  userId,
  email,
  orgId,
}: {
  userId: string | null;
  email: string | null;
  orgId: string | null;
}) {
  const lastIdentified = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    if (!posthog.__loaded) return;

    const key = `${userId}:${email ?? ""}:${orgId ?? ""}`;
    if (lastIdentified.current === key) return;
    lastIdentified.current = key;

    posthog.identify(userId, {
      email: email ?? undefined,
      org_id: orgId ?? undefined,
    });
  }, [userId, email, orgId]);

  return null;
}
