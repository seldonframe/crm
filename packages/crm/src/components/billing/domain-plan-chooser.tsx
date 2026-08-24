"use client";

// 2026-08-23 v2 — the /settings/domain upsell CTA. v1 direct-checkout'd a
// single context-guessed tier; Max's first-principles call: show the paid
// ladder and let the user pick — Managed $49 first, then the agency
// tiers (see domain-unlock-tiers.ts for the canonical tier list the
// checkout-tier-gate spec audits).
//
// v2.1 UX pass (same day): the first cut rendered four mini pricing
// pages inside the modal — long wrapped bullet lists, a clipped
// Recommended badge, buttons floating at different heights, dialog
// taller than the viewport. A modal is a DECISION surface, not a
// marketing surface: each card now carries name, price, ONE bold
// capacity line (the thing that actually changes across the ladder — 1
// own workspace, then 10 / 30 / unlimited client sub-accounts) and one
// quiet qualifier, with buttons pinned to an equal bottom edge. The
// full comparison stays on /pricing, linked in the footer.
//
// Cards arrive fully serialized from the server page and are derived
// from the plan catalog — no price id and no PLANS import ever reaches
// this client bundle (see pricing-shell-marketing.tsx's
// hydration-mismatch writeup).
//
// MONEY-SAFE: checkout goes through the shared startCheckout helper
// ({ tier } only); /api/stripe/checkout re-resolves the price server-side
// and gates every tier through resolveCheckoutTierGate (Plan.sellable +
// a real, non-placeholder Stripe price), so nothing here can reach a
// frozen tier or an arbitrary price.

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { startCheckout } from "@/lib/billing/start-checkout";
import type { TierId } from "@/lib/billing/plans";

export type DomainPlanCard = {
  tier: TierId;
  name: string;
  price: string;
  /** The one datum that changes across the ladder — "1 workspace" or
   *  "N client sub-accounts". Rendered bold; keep it under ~30 chars. */
  capacity: string;
  /** One quiet qualifier sentence. */
  detail: string;
  recommended: boolean;
};

export function DomainPlanChooser({
  successPath,
  plans,
}: {
  successPath: string;
  plans: DomainPlanCard[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<TierId | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function choose(tier: TierId) {
    setPending(tier);
    setError(null);
    try {
      const { url } = await startCheckout({
        tier,
        checkoutSource: "domain_settings",
        successPath,
        cancelPath: "/settings/domain",
      });
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout could not start. Try again.");
      setPending(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="crm-button-primary inline-flex h-10 items-center gap-1.5 px-4 text-sm font-semibold"
      >
        Unlock your domain
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
      <p className="text-xs text-muted-foreground">Custom domains are included on every paid plan.</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose your plan</DialogTitle>
            <DialogDescription>
              Every paid plan includes custom domains and removes SeldonFrame branding.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.tier}
                className={
                  plan.recommended
                    ? "flex h-full flex-col rounded-xl border border-primary bg-primary/5 p-4"
                    : "flex h-full flex-col rounded-xl border border-border bg-card p-4"
                }
              >
                <div className="flex min-w-0 items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">{plan.name}</span>
                  {plan.recommended ? (
                    <Badge className="shrink-0 whitespace-nowrap">Recommended</Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="mt-3 text-sm font-medium text-foreground">{plan.capacity}</p>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{plan.detail}</p>
                <Button
                  className="mt-4 w-full"
                  variant={plan.recommended ? "default" : "outline"}
                  disabled={pending !== null}
                  onClick={() => choose(plan.tier)}
                >
                  {pending === plan.tier ? "Starting checkout…" : `Choose ${plan.name}`}
                </Button>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Cancel anytime ·{" "}
            <a
              href="/pricing"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline underline-offset-4"
            >
              See the full plan comparison
            </a>
          </p>

          {error ? (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
