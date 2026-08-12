"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export type AnalyticsIdentityBridgeProps = {
  userId: string;
  email?: string | null;
  name?: string | null;
  workspaceId?: string | null;
  workspaceName?: string | null;
  workspaceSlug?: string | null;
  workspacePlanId?: string | null;
  workspaceCreatedAt?: string | null;
  agencyId?: string | null;
  isInternal?: boolean;
};

export function AnalyticsIdentityBridge(props: AnalyticsIdentityBridgeProps) {
  useEffect(() => {
    if (!props.userId) return;

    posthog.identify(props.userId, {
      email: props.email ?? undefined,
      name: props.name ?? undefined,
      is_internal: Boolean(props.isInternal),
    });

    if (props.workspaceId) {
      posthog.group("workspace", props.workspaceId, {
        name: props.workspaceName ?? undefined,
        slug: props.workspaceSlug ?? undefined,
        plan_id: props.workspacePlanId ?? undefined,
        created_at: props.workspaceCreatedAt ?? undefined,
        is_internal: Boolean(props.isInternal),
      });
    }

    if (props.agencyId) {
      posthog.group("agency", props.agencyId, {
        is_internal: Boolean(props.isInternal),
      });
    }
  }, [
    props.agencyId,
    props.email,
    props.isInternal,
    props.name,
    props.userId,
    props.workspaceCreatedAt,
    props.workspaceId,
    props.workspaceName,
    props.workspacePlanId,
    props.workspaceSlug,
  ]);

  return null;
}
