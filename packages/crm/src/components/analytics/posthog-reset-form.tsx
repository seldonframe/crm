"use client";

import type { ReactNode } from "react";
import posthog from "posthog-js";

export function PosthogResetForm({
  action,
  className,
  children,
}: {
  action: () => Promise<void>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <form action={action} className={className} onSubmit={() => posthog.reset()}>
      {children}
    </form>
  );
}
