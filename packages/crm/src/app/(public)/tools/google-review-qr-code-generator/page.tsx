// 2026-08-24 — /tools/google-review-qr-code-generator — free tool (the
// PostPlanify free-tools SEO motion): server-rendered GEO copy + FAQ around a
// client QR encoder island.
//
// DELIBERATELY NOT a duplicate of /tools/google-review-link-generator. That page
// owns "google review link" and shows a QR preview; this one owns "google review
// qr code", where the searcher wants printable artwork. So the copy here is
// about physical placement, print sizes and file formats, and the two pages
// cross-link rather than repeat each other.
import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { MarketplaceNav, MarketplaceFooter } from "@/components/marketplace/marketplace-chrome";
import { MarketplaceStyles } from "@/components/marketplace/marketplace-styles";
import { MKT } from "@/components/marketplace/marketplace-data";
import { GoogleReviewQrCodeGenerator } from "@/components/seo/google-review-qr-code-generator";
import { buildOgUrl } from "@/lib/seo/og-card";

/** FAQ answers use a few <strong> tags for readability; JSON-LD wants plain
 *  text, so strip tags before embedding in the schema. */
function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

const TITLE = "Google Review QR Code Generator — print-ready PNG and SVG, free";
const DESCRIPTION =
  "Free Google review QR code generator: turn your Place ID into a scannable review QR code sized for table tents, counter cards and window decals. Download PNG or SVG, no signup.";

const OG_URL = buildOgUrl({ kind: "tool", name: "Google Review QR Code Generator", hook: "Print-ready review QR codes, PNG or SVG" });

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/tools/google-review-qr-code-generator",
    types: { "text/markdown": "/tools/google-review-qr-code-generator.md" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tools/google-review-qr-code-generator",
    type: "website",
    images: [{ url: OG_URL, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_URL] },
};

// FAQ strings render via dangerouslySetInnerHTML (inline <strong> only).
// INVARIANT: keep these literal constants — never interpolate user/dynamic input.
const FAQ = [
  {
    q: "What size should a Google review QR code be printed at?",
    a: "It depends on scanning distance. A rough rule: the printed code should be about a tenth of the distance it's scanned from. <strong>2 inches</strong> works on a table tent someone reaches for, <strong>3 inches</strong> on a counter card, <strong>4 inches</strong> on a waiting-room poster, and <strong>6 inches</strong> on a window decal read from the sidewalk.",
  },
  {
    q: "PNG or SVG: which file should I send to a printer?",
    a: "<strong>SVG</strong>. It's vector, so it stays perfectly sharp at any size, and a print shop can scale it to whatever the job needs. Use the PNG when you're dropping the code straight into a document, a receipt template, or a design tool that won't take vectors.",
  },
  {
    q: "Does the QR code expire or stop working?",
    a: "No. It encodes a plain Google URL built from your Place ID, and nothing is tracked, redirected or hosted by us. As long as your Google Business Profile exists, the code keeps working, so a decal you print today is still good in three years.",
  },
  {
    q: "What is error correction and which level should I pick?",
    a: "Error correction is redundancy baked into the code so it still scans when part of it is damaged. For anything printed, <strong>Quartile</strong> is the right default: it survives scuffs, ink bleed and a coffee ring. Pick <strong>High</strong> only if you're placing a logo over the centre of the code.",
  },
  {
    q: "Is this the same as the review link generator?",
    a: "They share the same underlying link. The <strong>link generator</strong> is for pasting into a text or an email signature. This page is for <strong>print</strong>: real physical sizes, 300 DPI export, and a vector file. Use whichever matches where the ask is happening.",
  },
  {
    q: "Where do QR codes actually get scanned?",
    a: "The three that work: a <strong>table tent or counter card</strong> at the moment of payment, a <strong>receipt or invoice footer</strong>, and a <strong>van or job-site sign</strong> for trades. The ones that don't work: anything a customer walks past without stopping, and anything behind glass with a glare on it.",
  },
];

export default function GoogleReviewQrCodeGeneratorPage(): ReactElement {
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
          <span style={{ color: "rgba(34,29,23,0.7)" }}>Google review QR code generator</span>
        </nav>
        <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: 700 }}>
          Google Review QR Code Generator
        </h1>
        <p style={{ margin: "14px 0 26px", fontSize: 17, lineHeight: 1.55, color: "rgba(34,29,23,0.7)", maxWidth: 660 }}>
          Print-ready review QR codes at real physical sizes. Paste your Place ID, pick where the code is going, and
          download a 300 DPI PNG or a vector SVG. The code is encoded in your browser, so nothing you type leaves the
          page.
        </p>
        <GoogleReviewQrCodeGenerator />

        <section style={{ padding: "40px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Where to put it</h2>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.7, color: "rgba(34,29,23,0.72)" }}>
            <li>
              <strong>Table tent, 2 inches.</strong> On the table or the reception desk, at the moment someone is
              already sitting still with a phone in their hand.
            </li>
            <li>
              <strong>Counter card, 3 inches.</strong> Next to the card reader. The best five seconds you get with a
              happy customer is the five seconds after they pay.
            </li>
            <li>
              <strong>Poster or A-frame, 4 inches.</strong> Waiting rooms, where people are bored and looking for
              something to do.
            </li>
            <li>
              <strong>Window decal, 6 inches.</strong> Door glass and van panels, scanned from further away, so the code
              has to be bigger than feels necessary.
            </li>
          </ul>
        </section>

        <section style={{ padding: "30px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Why print beats a link, sometimes</h2>
          <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.65, color: "rgba(34,29,23,0.72)" }}>
            A texted review link is better when you have the customer&apos;s number and a reason to text them. A printed
            code is better when you don&apos;t: walk-ins, cash customers, anyone who never gave you a phone number. Most
            businesses need both, which is why this page and the{" "}
            <Link href="/tools/google-review-link-generator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              review link generator
            </Link>{" "}
            exist side by side and produce the same underlying URL.
          </p>
        </section>

        <section style={{ padding: "30px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Put the ask on autopilot</h2>
          <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.65, color: "rgba(34,29,23,0.72)", maxWidth: 660 }}>
            A decal on the door works on whoever notices it. A <strong>Google Review Agent</strong> asks every single
            finished customer, at the right moment, with a follow-up if nobody replies, and routes unhappy customers to
            you privately first. SeldonFrame deploys one into your own workspace, and the first workspace is free
            forever.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
            <Link href="/signup" className="sf-link" style={{ background: MKT.ink, color: MKT.paper, padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
              Build your AI front office free
            </Link>
            <Link href="/ai-agents/google-review-agent" className="sf-link" style={{ border: `1.5px solid ${MKT.ink10}`, color: MKT.ink, padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none", background: "rgba(255,255,255,0.5)" }}>
              See the Google Review Agent
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
            <Link href="/tools/google-review-link-generator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              build the review link
            </Link>
            ,{" "}
            <Link href="/tools/review-response-generator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              write a review response
            </Link>
            , or{" "}
            <Link href="/tools/customer-lifetime-value-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              work out what one customer is worth
            </Link>
            .
          </p>
        </section>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
