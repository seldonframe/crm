// 2026-08-24 — /tools/customer-lifetime-value-calculator — free tool (the
// PostPlanify free-tools SEO motion): server-rendered GEO copy + FAQ around a
// client LTV calculator island.
//
// This page is the INTERNAL-LINKING HUB for the money calculators. The
// missed-call, no-show and speed-to-lead pages each price one lost ticket; this
// one converts a ticket into a lifetime, so all four now link to each other and
// each can say what a lost CUSTOMER costs rather than a lost job.
import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { MarketplaceNav, MarketplaceFooter } from "@/components/marketplace/marketplace-chrome";
import { MarketplaceStyles } from "@/components/marketplace/marketplace-styles";
import { MKT } from "@/components/marketplace/marketplace-data";
import { CustomerLifetimeValueCalculator } from "@/components/seo/customer-lifetime-value-calculator";
import { buildOgUrl } from "@/lib/seo/og-card";

/** FAQ answers use a few <strong> tags for readability; JSON-LD wants plain
 *  text, so strip tags before embedding in the schema. */
function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

const TITLE = "Customer Lifetime Value Calculator for local service businesses — free";
const DESCRIPTION =
  "Free customer lifetime value calculator built for local service businesses: average ticket, visits per year, years retained and referrals in, lifetime revenue and lifetime profit out. No subscription-model assumptions, no signup.";

const OG_URL = buildOgUrl({ kind: "tool", name: "Customer Lifetime Value Calculator", hook: "What one local customer is really worth" });

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/tools/customer-lifetime-value-calculator",
    types: { "text/markdown": "/tools/customer-lifetime-value-calculator.md" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tools/customer-lifetime-value-calculator",
    type: "website",
    images: [{ url: OG_URL, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_URL] },
};

// FAQ strings render via dangerouslySetInnerHTML (inline <strong> only).
// INVARIANT: keep these literal constants — never interpolate user/dynamic input.
const FAQ = [
  {
    q: "How do you calculate customer lifetime value for a service business?",
    a: "<strong>Average ticket × visits per year × years retained</strong>, then add the lifetimes of the customers they refer. That's it. The subscription formula everyone quotes (monthly revenue divided by churn rate) assumes a recurring fee you don't charge, and it badly understates a business whose customer comes back four times a year for six years.",
  },
  {
    q: "Should I include referrals in lifetime value?",
    a: "Yes, carefully. Referrals are often the largest single component for a local business, and ignoring them makes every marketing decision look worse than it is. This calculator counts them at <strong>one generation only</strong>: a referred customer is worth one more lifetime, and their own referrals are not compounded on top. That keeps the number defensible.",
  },
  {
    q: "Should I use revenue or profit?",
    a: "Both, for different decisions. <strong>Lifetime revenue</strong> is the right number for judging what a lost customer cost you. <strong>Lifetime gross profit</strong> is the right number for deciding what you can afford to spend acquiring one. This tool shows both, and the margin slider is what separates them.",
  },
  {
    q: "What is a realistic retention period?",
    a: "It varies more than most owners expect. A hair salon client might stay <strong>5 to 10 years</strong>. An HVAC customer stays until the system is replaced. A mover is often a genuine one-off. If you have no idea, look at your oldest repeat customers and take the median rather than the best case.",
  },
  {
    q: "Why does this number matter?",
    a: "Because almost every operational decision quietly compares against it. Whether to answer the phone after 5pm, whether to chase a no-show, whether a $400 ad spend is sane. All of them look completely different when the customer at stake is worth <strong>a lifetime</strong> rather than one ticket.",
  },
  {
    q: "How does this relate to the missed-call and no-show calculators?",
    a: "Those two price a single lost job. This one prices the <strong>relationship</strong> behind it. A missed call is not a lost $150 appointment; it's a shot at a customer who was going to spend that four times a year and bring a neighbour. Run both and use the pair.",
  },
];

export default function CustomerLifetimeValueCalculatorPage(): ReactElement {
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
          <span style={{ color: "rgba(34,29,23,0.7)" }}>Customer lifetime value calculator</span>
        </nav>
        <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: 700 }}>
          Customer Lifetime Value Calculator
        </h1>
        <p style={{ margin: "14px 0 26px", fontSize: 17, lineHeight: 1.55, color: "rgba(34,29,23,0.7)", maxWidth: 660 }}>
          Built for local service businesses, not subscription software. Average ticket, visits a year, years retained
          and referrals in. Lifetime revenue and lifetime profit out, with a shareable result card. Nothing leaves your
          browser.
        </p>
        <CustomerLifetimeValueCalculator />

        <section style={{ padding: "40px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Why the usual formula is wrong for you</h2>
          <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.65, color: "rgba(34,29,23,0.72)" }}>
            The lifetime value formula in most articles is{" "}
            <strong>average monthly revenue divided by churn rate</strong>. It was written for software with a
            subscription and a cancel button. A local service business has neither: the customer does not pay you
            monthly, and they do not cancel, they just stop calling. Feeding those numbers into a SaaS formula produces
            an answer that is either nonsense or an accidental undercount.
          </p>
          <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.65, color: "rgba(34,29,23,0.72)" }}>
            The version that works here counts what actually happens: a ticket, some number of times a year, for some
            number of years, plus the people they send you.
          </p>
        </section>

        <section style={{ padding: "30px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>What this number changes</h2>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.7, color: "rgba(34,29,23,0.72)" }}>
            <li>
              <strong>What a missed call costs.</strong> Not one job.{" "}
              <Link href="/tools/missed-call-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
                Price your missed calls
              </Link>{" "}
              and multiply by the lifetime figure above.
            </li>
            <li>
              <strong>What a no-show costs.</strong> The burnt slot is the visible part.{" "}
              <Link href="/tools/no-show-cost-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
                Run the no-show numbers
              </Link>
              , then decide whether a fee is worth the relationship.
            </li>
            <li>
              <strong>What a slow reply costs.</strong>{" "}
              <Link href="/tools/speed-to-lead-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
                The speed-to-lead calculator
              </Link>{" "}
              shows how fast a new lead goes cold. Lifetime value is what goes cold with it.
            </li>
            <li>
              <strong>What you can spend to acquire one.</strong> Use the lifetime profit figure, not the revenue one.
            </li>
          </ul>
        </section>

        <section style={{ padding: "30px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Keeping the ones you already have</h2>
          <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.65, color: "rgba(34,29,23,0.72)" }}>
            Retention is where lifetime value is actually won, and it is mostly operational: answering the phone,
            confirming appointments, following up when a quote goes quiet, asking for the review while the customer is
            still happy. SeldonFrame runs those as agents inside your own workspace, and the first workspace is free
            forever.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
            <Link href="/signup" className="sf-link" style={{ background: MKT.ink, color: MKT.paper, padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
              Build your AI front office free
            </Link>
            <Link href="/tools/sms-template-generator" className="sf-link" style={{ border: `1.5px solid ${MKT.ink10}`, color: MKT.ink, padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none", background: "rgba(255,255,255,0.5)" }}>
              Write the follow-up texts
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
            <Link href="/tools/missed-call-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              missed-call cost
            </Link>
            ,{" "}
            <Link href="/tools/no-show-cost-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              no-show cost
            </Link>
            ,{" "}
            <Link href="/tools/speed-to-lead-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              speed-to-lead cost
            </Link>
            , or{" "}
            <Link href="/tools/agency-margin-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              agency margin
            </Link>
            .
          </p>
        </section>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
