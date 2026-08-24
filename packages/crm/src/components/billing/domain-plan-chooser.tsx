"use client";

// 2026-08-23 v2 — the /settings/domain upsell CTA. v1 direct-checkout'd a
// single context-guessed tier; Max's first-principles call: show the paid
// ladder and let the user pick — Managed $49 first, then the agency
// tiers (see domain-unlock-tiers.ts for the canonical tier list the
// checkout-tier-gate spec audits).
//
// Cards arrive fully serialized from the server page and are sourced
// from the plan catalog's marketingFeatures (the single source of tier
// copy) — no price id and no PLANS import ever reaches this client
// bundle (see pricing-shell-marketing.tsx's hydration-mismatch writeup).
//
// MONEY-SAFE: checkout goes through the shared startCheckout helper
// ({ tier } only); /api/stripe/checkout re-resolves the price server-side
// and gates every tier through resolveCheckoutTierGate (Plan.sellable +
// a real, non-placeholder Stripe price), so nothing here can reach a
// frozen tier or an arbitrary price.

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { startCheckout } from "@/lib/billing/start-checkout";
import type { TierId } from "@/lib/billing/plans";

export type DomainPlanCard = {
  tier: TierId;
  name: string;
  price: string;
  /** Optional "Everything in X, plus:" lead-in from the catalog. */
  featuresHeader: string | null;
  features: string[];
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose your plan</DialogTitle>
            <DialogDescription>
              Every paid plan includes custom domains and removes SeldonFrame branding. Building
              for clients? The agency tiers add white-label and client sub-accounts.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {plans.map((plan) => (
              <Card key={plan.tier} className={plan.recommended ? "border-primary" : undefined}>
                <CardHeader className="space-y-1 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    {plan.recommended ? <Badge>Recommended</Badge> : null}
                  </div>
                  <p className="text-2xl font-semibold text-foreground">{plan.price}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {plan.featuresHeader ? (
                      <li className="font-medium text-foreground">{plan.featuresHeader}</li>
                    ) : null}
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.recommended ? "default" : "outline"}
                    disabled={pending !== null}
                    onClick={() => choose(plan.tier)}
                  >
                    {pending === plan.tier ? "Starting checkout…" : `Choose ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {error ? (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
