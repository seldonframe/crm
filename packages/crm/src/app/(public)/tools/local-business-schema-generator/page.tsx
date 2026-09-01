// 2026-08-24 — /tools/local-business-schema-generator — free tool (the
// PostPlanify free-tools SEO motion): server-rendered GEO copy + FAQ around a
// client JSON-LD builder island.
//
// Structured data is the machine-readable version of the answers an AI
// assistant needs before it will recommend a business, which is why this page
// cross-links /tools/ai-visibility-checker rather than sitting alone in an SEO
// silo.
import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { MarketplaceNav, MarketplaceFooter } from "@/components/marketplace/marketplace-chrome";
import { MarketplaceStyles } from "@/components/marketplace/marketplace-styles";
import { MKT } from "@/components/marketplace/marketplace-data";
import { LocalBusinessSchemaGenerator } from "@/components/seo/local-business-schema-generator";
import { buildOgUrl } from "@/lib/seo/og-card";

/** FAQ answers use a few <strong> tags for readability; JSON-LD wants plain
 *  text, so strip tags before embedding in the schema. */
function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

const TITLE = "LocalBusiness Schema Generator — free JSON-LD, no signup";
const DESCRIPTION =
  "Free LocalBusiness schema generator: fill in your name, address, hours, service area and geo coordinates, and get valid LocalBusiness JSON-LD ready to paste into your site. Empty fields are omitted, so the output always validates.";

const OG_URL = buildOgUrl({ kind: "tool", name: "LocalBusiness Schema Generator", hook: "Valid JSON-LD, no blanks left in it" });

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/tools/local-business-schema-generator",
    types: { "text/markdown": "/tools/local-business-schema-generator.md" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tools/local-business-schema-generator",
    type: "website",
    images: [{ url: OG_URL, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_URL] },
};

// FAQ strings render via dangerouslySetInnerHTML (inline <strong> only).
// INVARIANT: keep these literal constants — never interpolate user/dynamic input.
const FAQ = [
  {
    q: "What is LocalBusiness schema and why does it matter?",
    a: "It's a block of <strong>JSON-LD</strong> that states your name, address, phone, hours and service area in a format machines read without guessing. Search engines use it to show hours and location confidently, and AI assistants use it when deciding whether they know enough about you to recommend you.",
  },
  {
    q: "Where do I paste the code?",
    a: "Inside the <strong>&lt;head&gt;</strong> of your homepage, as a script tag. If your site builder has a \"custom code\" or \"header scripts\" field, that's the one. It only needs to be on the homepage, though putting it on a contact page too does no harm.",
  },
  {
    q: "Does structured data improve my ranking?",
    a: "Not directly. What it does is remove ambiguity. It stops a search engine having to infer your hours from a badly formatted table, and it makes rich results possible. Treat it as <strong>removing a penalty for being unclear</strong>, not as a ranking boost.",
  },
  {
    q: "Do I need latitude and longitude?",
    a: "No, and most businesses skip it. It's worth adding if your street address is ambiguous or you're in a large complex. You can read the coordinates off the URL when you drop a pin on Google Maps.",
  },
  {
    q: "What if my business type isn't in the list?",
    a: "Use the generic <strong>LocalBusiness</strong> type. A more specific subtype is slightly better when one fits exactly, but a wrong subtype is worse than the generic one, so don't force it.",
  },
  {
    q: "How do I know the output is valid?",
    a: "Two things: this tool <strong>omits every empty field</strong> rather than emitting blanks, which is where most hand-written schema breaks. Then run your live page through Google's Rich Results Test to confirm it parses on the real site.",
  },
];

export default function LocalBusinessSchemaGeneratorPage(): ReactElement {
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
          <span style={{ color: "rgba(34,29,23,0.7)" }}>LocalBusiness schema generator</span>
        </nav>
        <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: 700 }}>
          LocalBusiness Schema Generator
        </h1>
        <p style={{ margin: "14px 0 26px", fontSize: 17, lineHeight: 1.55, color: "rgba(34,29,23,0.7)", maxWidth: 660 }}>
          Fill in the form, copy valid LocalBusiness JSON-LD. Hours, service area and geo coordinates are included when
          you provide them and left out entirely when you do not, so what you paste is never a template with holes in
          it.
        </p>
        <LocalBusinessSchemaGenerator />

        <section style={{ padding: "40px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>What this block tells a machine</h2>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.7, color: "rgba(34,29,23,0.72)" }}>
            <li>
              <strong>Who you are.</strong> Name, business type and website, stated once and unambiguously.
            </li>
            <li>
              <strong>Where you are.</strong> A structured postal address, optionally pinned with coordinates.
            </li>
            <li>
              <strong>When you are open.</strong> Per-day opening hours in a format nothing has to parse from prose.
            </li>
            <li>
              <strong>Who you serve.</strong> A service area, which matters most for businesses that travel to the
              customer and have no useful storefront address.
            </li>
          </ul>
        </section>

        <section style={{ padding: "30px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Schema is half of being findable by AI</h2>
          <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.65, color: "rgba(34,29,23,0.72)" }}>
            When an assistant is asked to recommend a plumber in your city, it needs to be confident about who you are,
            what you do and whether you are open. Structured data answers the factual half of that.{" "}
            <Link href="/tools/ai-visibility-checker" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              The AI visibility checker
            </Link>{" "}
            grades the other half, and{" "}
            <Link href="/tools/google-business-profile-description-generator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              your Google Business Profile description
            </Link>{" "}
            is where most assistants read your story from.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
            <Link href="/signup" className="sf-link" style={{ background: MKT.ink, color: MKT.paper, padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
              Get a site that ships schema automatically
            </Link>
            <Link href="/tools/website-grader" className="sf-link" style={{ border: `1.5px solid ${MKT.ink10}`, color: MKT.ink, padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none", background: "rgba(255,255,255,0.5)" }}>
              Grade your current website
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
              check your AI visibility
            </Link>
            , write your{" "}
            <Link href="/tools/google-business-profile-description-generator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              Google Business Profile description
            </Link>
            , or{" "}
            <Link href="/tools/website-grader" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              grade your website
            </Link>
            .
          </p>
        </section>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
