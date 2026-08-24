// 2026-08-24 — /tools/google-business-profile-description-generator — free tool
// (the PostPlanify free-tools SEO motion): server-rendered GEO copy + FAQ around
// a client description composer island.
//
// CTA goes to /tools/ai-website-generator rather than straight to /signup,
// because the searcher here already has a Google Business Profile in front of
// them and the build flow accepts a Google paste directly.
import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { MarketplaceNav, MarketplaceFooter } from "@/components/marketplace/marketplace-chrome";
import { MarketplaceStyles } from "@/components/marketplace/marketplace-styles";
import { MKT } from "@/components/marketplace/marketplace-data";
import { GoogleBusinessProfileDescriptionGenerator } from "@/components/seo/google-business-profile-description-generator";
import { buildOgUrl } from "@/lib/seo/og-card";

/** FAQ answers use a few <strong> tags for readability; JSON-LD wants plain
 *  text, so strip tags before embedding in the schema. */
function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

const TITLE = "Google Business Profile Description Generator — free, 750 characters";
const DESCRIPTION =
  "Free Google Business Profile description generator: pick your business type, services, city and tone, and get a description that fits inside Google's 750-character limit, with a live character count and a copy button.";

const OG_URL = buildOgUrl({ kind: "tool", name: "Google Business Profile Description Generator", hook: "Fits Google's 750-character limit, every time" });

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/tools/google-business-profile-description-generator",
    types: { "text/markdown": "/tools/google-business-profile-description-generator.md" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tools/google-business-profile-description-generator",
    type: "website",
    images: [{ url: OG_URL, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_URL] },
};

// FAQ strings render via dangerouslySetInnerHTML (inline <strong> only).
// INVARIANT: keep these literal constants — never interpolate user/dynamic input.
const FAQ = [
  {
    q: "How long can a Google Business Profile description be?",
    a: "<strong>750 characters</strong>, and Google simply refuses anything longer rather than truncating it politely. Only the first couple of lines show before a reader taps to expand, so the important sentence belongs at the front.",
  },
  {
    q: "Does the description affect my ranking in local search?",
    a: "No. Google has been clear that the business description is not a ranking factor. It matters for a different reason: it is what a <strong>human</strong> reads when they are deciding between you and the next result, and increasingly what an <strong>AI assistant</strong> reads when summarising you.",
  },
  {
    q: "What is Google not allowed in the description?",
    a: "Google's guidelines rule out <strong>URLs, phone numbers, prices, promotional offers</strong> and anything misleading. Descriptions that break the rules can be rejected or quietly removed, and repeated violations put the profile at risk. This tool doesn't emit any of them.",
  },
  {
    q: "Should I stuff keywords into it?",
    a: "No. Since it isn't a ranking factor, keyword stuffing costs you the one thing the field is actually good for: sounding like a business a person would call. Mention your services naturally because that's what a reader wants to know, not to game anything.",
  },
  {
    q: "What should I say if I have no idea where to start?",
    a: "Five things, in this order: <strong>what you do, who you serve, where, what makes you different, and how to get started</strong>. That's the structure this generator uses, and it's the same structure a good elevator pitch has.",
  },
  {
    q: "Where do I paste it?",
    a: "In Google Business Profile, open <strong>Edit profile</strong> and then <strong>Business description</strong>. Changes usually appear within a few minutes, though Google occasionally takes longer to review an edit.",
  },
];

export default function GoogleBusinessProfileDescriptionGeneratorPage(): ReactElement {
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
          <span style={{ color: "rgba(34,29,23,0.7)" }}>Google Business Profile description generator</span>
        </nav>
        <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: 700 }}>
          Google Business Profile Description Generator
        </h1>
        <p style={{ margin: "14px 0 26px", fontSize: 17, lineHeight: 1.55, color: "rgba(34,29,23,0.7)", maxWidth: 660 }}>
          Google gives you 750 characters and refuses anything longer. Pick your business type, services and city, and
          this writes a description that fits, in the order a reader actually wants it: what you do, who you serve,
          where, what makes you different, and how to start.
        </p>
        <GoogleBusinessProfileDescriptionGenerator />

        <section style={{ padding: "40px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>What Google will not accept</h2>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.7, color: "rgba(34,29,23,0.72)" }}>
            <li>
              <strong>URLs and phone numbers.</strong> They belong in their own profile fields, and putting them here can
              get the description rejected.
            </li>
            <li>
              <strong>Prices and offers.</strong> No &quot;$99 special&quot;, no &quot;20% off this month&quot;. Use
              Google Posts for promotions instead.
            </li>
            <li>
              <strong>Claims you cannot back.</strong> &quot;Licensed&quot; when you are not, &quot;number one&quot;
              when nobody ranked you. Profiles get suspended over exactly this.
            </li>
            <li>
              <strong>Keyword stuffing.</strong> It buys you nothing, because the field is not a ranking factor, and it
              costs you a reader.
            </li>
          </ul>
        </section>

        <section style={{ padding: "30px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Your profile is already most of a website</h2>
          <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.65, color: "rgba(34,29,23,0.72)" }}>
            The description you just wrote, your services, your hours and your reviews are the same facts a decent local
            website needs. SeldonFrame&apos;s builder takes a pasted Google Business Profile and turns it into a real
            hosted site with a booking page, an intake form and a CRM in about three minutes. The first workspace is
            free forever.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
            <Link href="/tools/ai-website-generator" className="sf-link" style={{ background: MKT.ink, color: MKT.paper, padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
              Turn your profile into a website
            </Link>
            <Link href="/tools/local-business-schema-generator" className="sf-link" style={{ border: `1.5px solid ${MKT.ink10}`, color: MKT.ink, padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none", background: "rgba(255,255,255,0.5)" }}>
              Generate matching schema
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
            <Link href="/tools/ai-visibility-checker" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              check whether AI can recommend you
            </Link>
            , build a{" "}
            <Link href="/tools/google-review-qr-code-generator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              review QR code
            </Link>
            , or generate{" "}
            <Link href="/tools/local-business-schema-generator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              LocalBusiness schema
            </Link>
            .
          </p>
        </section>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
