"use client";

// 2026-07-04 — Task 9 of the win-ladder + SeldonChat plan. Replaces the
// domain settings UpsellCard's old /signup/billing?next=... link (a
// standalone card-collection flow) with a direct Stripe Checkout CTA
// against the SAME existing /api/stripe/checkout route — no new Stripe
// surface, no new price id.
//
// 2026-08-23 — the tier is now a prop resolved by the server page via
// domainUnlockTier() (components/billing/domain-unlock-tiers.ts). The
// original hardcoded tier:"workspace" predated the 2026-07-08 pricing
// ladder, which froze "workspace" (Plan.sellable=false); that wave
// repointed pricing-shell + upgrade-modal but missed this button, so
// every domain-unlock click 409'd with "Tier 'workspace' is not
// available for new checkout."
//
// MONEY-SAFE: the checkout route re-resolves the tier server-side and
// gates it through resolveCheckoutTierGate (Plan.sellable + a real,
// non-placeholder Stripe price), so a client editing the POST body can
// at most start a checkout for a DIFFERENT sellable plan — never a
// frozen tier or an arbitrary price.

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import type { TierId } from "@/lib/billing/plans";

export function DomainUpgradeButton({
  successPath,
  tier,
  label,
  sublabel,
}: {
  successPath: string;
  /** Sellable checkout tier — "builder" on own workspaces,
   *  "agency_starter" inside a client workspace. */
  tier: TierId;
  /** CTA text, price included (derived from the plan catalog server-side
   *  so the button never hardcodes a dollar amount again). */
  label: string;
  sublabel: string;
}) {
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setError(null);
    setStarting(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          successPath,
          cancelPath: "/settings/domain",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Couldn't start checkout. Try again in a moment.");
    } catch {
      setError("Couldn't reach Stripe. Check your connection and try again.");
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      <button
        type="button"
        onClick={startCheckout}
        disabled={starting}
        className="crm-button-primary inline-flex h-10 items-center gap-1.5 px-4 text-sm font-semibold disabled:opacity-60"
      >
        {starting ? "Starting checkout…" : label}
        {!starting ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
      </button>
      <p className="text-xs text-muted-foreground">{sublabel}</p>
      {error ? <p className="w-full text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
