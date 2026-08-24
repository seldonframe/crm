// 2026-08-24 — /tools/cancellation-policy-generator — free tool (the
// PostPlanify free-tools SEO motion): server-rendered GEO copy + FAQ around a
// client policy composer island.
//
// Deliberately paired with /tools/no-show-cost-calculator: that page quantifies
// the problem in dollars, this one produces the document that reduces it. The
// two cross-link both ways.
//
// HONESTY (house rule never-lies): this generates policy text, not legal advice,
// and whether you can actually charge a card for a missed appointment depends on
// the payment processor and local rules. Both the page and the widget say so.
import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { MarketplaceNav, MarketplaceFooter } from "@/components/marketplace/marketplace-chrome";
import { MarketplaceStyles } from "@/components/marketplace/marketplace-styles";
import { MKT } from "@/components/marketplace/marketplace-data";
import { CancellationPolicyGenerator } from "@/components/seo/cancellation-policy-generator";
import { buildOgUrl } from "@/lib/seo/og-card";

/** FAQ answers use a few <strong> tags for readability; JSON-LD wants plain
 *  text, so strip tags before embedding in the schema. */
function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

const TITLE = "Cancellation Policy Generator — free, paste-ready, no signup";
const DESCRIPTION =
  "Free cancellation and no-show policy generator for service businesses: set your notice window, late-cancellation fee, no-show fee and deposit rules, and get paste-ready policy text for your website, your reminder texts and your booking form.";

const OG_URL = buildOgUrl({ kind: "tool", name: "Cancellation Policy Generator", hook: "A no-show policy people actually read" });

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/tools/cancellation-policy-generator",
    types: { "text/markdown": "/tools/cancellation-policy-generator.md" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tools/cancellation-policy-generator",
    type: "website",
    images: [{ url: OG_URL, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_URL] },
};

// FAQ strings render via dangerouslySetInnerHTML (inline <strong> only).
// INVARIANT: keep these literal constants — never interpolate user/dynamic input.
const FAQ = [
  {
    q: "What notice window should I ask for?",
    a: "Match it to how fast you can refill the slot. A salon that can fill a chair from a waiting list is fine at <strong>24 hours</strong>. A med spa holding a two-hour room, or a trade routing a van across a city, usually needs <strong>48</strong>. Asking for more notice than you need just makes the policy feel unfair without recovering more revenue.",
  },
  {
    q: "Should the fee be a flat amount or a percentage?",
    a: "A <strong>percentage</strong> scales with the value of the slot, which is fairer when your services range from a $40 trim to a $400 treatment. A <strong>flat fee</strong> is easier to say out loud and easier to defend at the desk. Pick the one you'll actually enforce.",
  },
  {
    q: "Do deposits really reduce no-shows?",
    a: "They're the strongest deterrent available, and the one customers push back on hardest. A deposit that's applied to the bill and fully refundable inside the notice window is the version most businesses can hold: it changes behaviour without reading as a penalty for booking.",
  },
  {
    q: "Where should the policy actually live?",
    a: "In three places, which is why this tool emits three versions. The <strong>full policy</strong> goes on the booking page. The <strong>short version</strong> goes in the confirmation and reminder text, where it's actually read. The <strong>one-line checkbox</strong> goes on the booking form, where agreeing to it is recorded.",
  },
  {
    q: "Can I charge a card for a no-show?",
    a: "Sometimes, and it depends on things this tool can't see: what your payment processor allows, whether you captured a card and consent at booking, and your local consumer-protection rules. Get the wording and the consent right first, because a fee you can't collect is just a threat.",
  },
  {
    q: "Is this legal advice?",
    a: "No. It's policy text drafted from your own choices, in plain language. It's a strong starting point for a small service business, but it isn't a lawyer, and anything involving stored payment credentials is worth a real review.",
  },
];

export default function CancellationPolicyGeneratorPage(): ReactElement {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: stripHtml(f.a) } })),
  };
  return (
    <div className="sf-mkt" style={{ minHeight: "100vh", background: MKT.paper, color: MKT.ink, fontFamily: MKT.fontSans, overflowX: "hidden" }}>
      <MarketplaceStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <MarketplaceNav />
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "34px 32px 70px", width: "100%" }}>
        <nav aria-label="Breadcrumb" style={{ display: "flex", gap: 6, fontSize: 13.5, fontWeight: 600, color: "rgba(34,29,23,0.5)", marginBottom: 20 }}>
          <Link href="/tools" className="sf-link" style={{ color: "rgba(34,29,23,0.55)", textDecoration: "none" }}>
            Free tools
          </Link>
          <span style={{ color: "rgba(34,29,23,0.3)" }}>/</span>
          <span style={{ color: "rgba(34,29,23,0.7)" }}>Cancellation policy generator</span>
        </nav>
        <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: 700 }}>
          Cancellation Policy Generator
        </h1>
        <p style={{ margin: "14px 0 26px", fontSize: 17, lineHeight: 1.55, color: "rgba(34,29,23,0.7)", maxWidth: 660 }}>
          Set your notice window, your fees and your deposit rule, and get three pieces of paste-ready text: the full
          policy for your booking page, a short version for the confirmation text, and a one-line checkbox for the
          booking form. Everything runs in your browser.
        </p>
        <CancellationPolicyGenerator />

        <section style={{ padding: "40px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>A policy nobody reads is not a policy</h2>
          <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.65, color: "rgba(34,29,23,0.72)" }}>
            Most cancellation policies fail the same way: they live on a page the customer visited once, weeks before
            the appointment. The version that changes behaviour is the one in the{" "}
            <strong>reminder text the day before</strong>, when the customer is deciding whether to bother. That is why
            this tool gives you a short version sized for a text message, not just a wall of policy prose.
          </p>
        </section>

        <section style={{ padding: "30px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Know what it is worth first</h2>
          <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.65, color: "rgba(34,29,23,0.72)" }}>
            Fees are a blunt instrument, and they cost goodwill. Before you set one, it helps to see the number you are
            trying to recover:{" "}
            <Link href="/tools/no-show-cost-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              the no-show cost calculator
            </Link>{" "}
            quantifies the problem this policy is meant to fix, and{" "}
            <Link href="/tools/customer-lifetime-value-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              the lifetime value calculator
            </Link>{" "}
            shows what a customer you annoy into leaving was worth. Plenty of businesses find that reminders plus a
            visible policy get them most of the way, and the fee is only for repeat offenders.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
            <Link href="/signup" className="sf-link" style={{ background: MKT.ink, color: MKT.paper, padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
              Show the policy at every booking. Start free.
            </Link>
            <Link href="/tools/booking-friction-grader" className="sf-link" style={{ border: `1.5px solid ${MKT.ink10}`, color: MKT.ink, padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none", background: "rgba(255,255,255,0.5)" }}>
              Grade your booking flow
            </Link>
          </div>
        </section>

        <section style={{ padding: "40px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <details key={f.q} style={{ border: `1px solid ${MKT.ink10}`, borderRadius: 12, padding: "14px 18px", marginBottom: 10, background: "rgba(255,255,255,0.55)" }}>
              <summary style={{ fontWeight: 700, fontSize: 15.5, cursor: "pointer" }}>{f.q}</summary>
              <p style={{ margin: "10px 0 2px", fontSize: 14.5, lineHeight: 1.6, color: "rgba(34,29,23,0.72)" }} dangerouslySetInnerHTML={{ __html: f.a }} />
            </details>
          ))}
          <p style={{ margin: "22px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "rgba(34,29,23,0.65)" }}>
            More free tools:{" "}
            <Link href="/tools/no-show-cost-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              price your no-shows
            </Link>
            , write the{" "}
            <Link href="/tools/sms-template-generator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              reminder text that carries this policy
            </Link>
            , or{" "}
            <Link href="/tools/free-booking-page" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              get a free booking page
            </Link>{" "}
            to put it on.
          </p>
        </section>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
