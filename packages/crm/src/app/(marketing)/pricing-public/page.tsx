// packages/crm/src/app/(marketing)/pricing-public/page.tsx
//
// Standalone deep-dive on agency pricing — light warm theme, white-label
// tiers, GMV explainer + FAQ. Unauthenticated visitors can reach this
// from the nav or "Learn more about pricing" links.
//
// Route: /pricing-public
// The in-product billing page at /pricing (with Stripe SetupIntent)
// is kept for authed users — that's a different surface entirely.

import type { Metadata } from "next";
import { MarketingNav } from "@/components/landing/marketing-nav";
import { LandingMarketingPricingSection } from "@/components/landing/marketing-pricing-section";
import { LandingMarketingFaqSection } from "@/components/landing/marketing-faq-section";
import { MarketingFinalCta } from "@/components/landing/marketing-final-cta";
import { MarketingFooter } from "@/components/landing/marketing-footer";

export const metadata: Metadata = {
  title: "Pricing — SeldonFrame",
  description:
  "Agency plans from $99/mo with white-label client workspaces, branded portals, and 0% GMV. Builder and Managed plans cover your own operation.",
};

export default function PricingPublicPage() {
  // Public pricing must show the current sellable agency ladder even when
  // the legacy homepage flag is absent in a preview environment.
  const tierLadderOn = true;
  return (
    <div className="min-h-screen bg-[#F6F2EA] text-[#221D17] selection:bg-[#1F2B24]/20 selection:text-[#1F2B24]">
      <MarketingNav />
      <main id="main-content" className="pt-[72px]">
        {/* Hero */}
        <section className="border-b border-[rgba(34,29,23,.08)] bg-[#F6F2EA] px-5 py-20 text-center md:px-8 md:py-28 lg:px-12">
          <div className="mx-auto max-w-[700px]">
            <div className="inline-flex items-center justify-center gap-2.5 text-[12px] font-[600] uppercase tracking-[0.09em] text-[#1F2B24]">
              <span className="h-px w-4 bg-[#1F2B24] opacity-50" aria-hidden />
              Pricing
              <span className="h-px w-4 bg-[#1F2B24] opacity-50" aria-hidden />
            </div>
            <h1 className="mx-auto mt-3.5 max-w-[20ch] text-[clamp(34px,4.8vw,56px)] font-[500] leading-[1.04] tracking-[-0.025em] text-[#221D17]">
              Agency plans from $99/mo.{" "}
              <em className="font-[Newsreader,Georgia,serif] font-normal not-italic text-[#6E665A]">
                We only make money when you do.
              </em>
            </h1>
            <p className="mx-auto mt-4 max-w-[54ch] text-[16px] leading-[1.55] text-[#6E665A]">
              Deploy branded client workspaces from one repeatable delivery loop. Agency plans
              include white-label, branded client portals, and 0% GMV. Build the first client
              workspace before checkout and cancel anytime.
            </p>
          </div>
        </section>

        <LandingMarketingPricingSection tierLadderOn={tierLadderOn} />
        <LandingMarketingFaqSection />
        <MarketingFinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}
