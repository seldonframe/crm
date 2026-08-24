// 2026-08-24 — /tools/voicemail-greeting-generator — free tool (the PostPlanify
// free-tools SEO motion): server-rendered GEO copy + FAQ around a client script
// composer island.
//
// The honest CTA here is not "record a nicer greeting" but "stop sending callers
// to voicemail entirely" — a voicemail is a lost call with a recording attached,
// and the page says that plainly instead of pretending the script is the fix.
import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { MarketplaceNav, MarketplaceFooter } from "@/components/marketplace/marketplace-chrome";
import { MarketplaceStyles } from "@/components/marketplace/marketplace-styles";
import { MKT } from "@/components/marketplace/marketplace-data";
import { VoicemailGreetingGenerator } from "@/components/seo/voicemail-greeting-generator";
import { buildOgUrl } from "@/lib/seo/og-card";

/** FAQ answers use a few <strong> tags for readability; JSON-LD wants plain
 *  text, so strip tags before embedding in the schema. */
function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

const TITLE = "Voicemail Greeting Generator for business — free scripts, no signup";
const DESCRIPTION =
  "Free business voicemail greeting generator: main, after-hours, holiday and emergency scripts written for your business type, with the callback promise and the exact details you want callers to leave.";

const OG_URL = buildOgUrl({ kind: "tool", name: "Voicemail Greeting Generator", hook: "Four greetings your business actually needs" });

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/tools/voicemail-greeting-generator",
    types: { "text/markdown": "/tools/voicemail-greeting-generator.md" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tools/voicemail-greeting-generator",
    type: "website",
    images: [{ url: OG_URL, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_URL] },
};

// FAQ strings render via dangerouslySetInnerHTML (inline <strong> only).
// INVARIANT: keep these literal constants — never interpolate user/dynamic input.
const FAQ = [
  {
    q: "How long should a business voicemail greeting be?",
    a: "Under <strong>20 seconds</strong>. Callers who reach voicemail are already mildly annoyed, and a long greeting is the last push they need to hang up and call the next name on the list. Say who you are, what to leave, and when you'll call back. Everything else is optional.",
  },
  {
    q: "What should a caller be asked to leave?",
    a: "The details that let you actually return the call usefully: <strong>name, callback number, and the one fact that decides urgency</strong>: the address for a trade, the treatment for a spa, whether they're in pain for a dental office. A message that just says \"call me back\" costs you a whole extra phone tag round.",
  },
  {
    q: "Do I need separate after-hours and holiday greetings?",
    a: "Yes, and it's the cheapest expectation management there is. An <strong>after-hours</strong> greeting states when you open so nobody waits for a callback at 9pm. A <strong>holiday</strong> greeting names the reopen date, which stops the second and third call from the same person.",
  },
  {
    q: "Should I promise a callback time?",
    a: "Only one you'll hit. \"We'll call you back within the hour\" is a great greeting and a terrible one if it's not true. The caller now has a specific broken promise instead of a vague wait. Promise <strong>the same day</strong> if that's what you can do, and then do it.",
  },
  {
    q: "What percentage of callers actually leave a voicemail?",
    a: "Fewer than most owners assume, and the ones who don't usually just call a competitor. That's the honest case against optimising the greeting too hard: the highest-value change is <strong>not sending the caller to voicemail in the first place</strong>.",
  },
  {
    q: "Can an AI receptionist replace this?",
    a: "For most missed calls, yes. Instead of playing a message, it picks up, asks the same questions this script asks the caller to leave, and books the job into your calendar while they're still on the line. A voicemail greeting is the fallback for when that isn't set up yet, and worth recording either way.",
  },
];

export default function VoicemailGreetingGeneratorPage(): ReactElement {
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
          <span style={{ color: "rgba(34,29,23,0.7)" }}>Voicemail greeting generator</span>
        </nav>
        <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: 700 }}>
          Voicemail Greeting Generator
        </h1>
        <p style={{ margin: "14px 0 26px", fontSize: 17, lineHeight: 1.55, color: "rgba(34,29,23,0.7)", maxWidth: 660 }}>
          Word-for-word greeting scripts for the four situations a business actually needs recorded: the main greeting,
          after hours, a holiday closure, and an emergency overflow. Pick your business type and the script asks callers
          for the details that make the callback useful.
        </p>
        <VoicemailGreetingGenerator />

        <section style={{ padding: "40px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>What makes a greeting work</h2>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.7, color: "rgba(34,29,23,0.72)" }}>
            <li>
              <strong>Name the business first.</strong> Callers who dialled the wrong number hang up immediately instead
              of leaving you a message meant for someone else.
            </li>
            <li>
              <strong>Ask for specifics, not &quot;a message&quot;.</strong> The greeting is your only chance to
              structure what you get back.
            </li>
            <li>
              <strong>Give a callback window you can hit.</strong> A promise you miss is worse than no promise.
            </li>
            <li>
              <strong>Offer an escape hatch.</strong> A booking link or an emergency number turns a dead end into a
              second path.
            </li>
            <li>
              <strong>Keep it under 20 seconds.</strong> Read it out loud once before you record it.
            </li>
          </ul>
        </section>

        <section style={{ padding: "30px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>The uncomfortable part</h2>
          <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.65, color: "rgba(34,29,23,0.72)" }}>
            A voicemail is a call you already lost, with a recording attached. The greeting can soften that, but it
            cannot undo it: most people who reach voicemail during business hours simply call the next business.{" "}
            <Link href="/tools/missed-call-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              Put a number on what that costs you
            </Link>{" "}
            and then decide whether the answer is a better greeting or something that picks up.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
            <Link href="/signup" className="sf-link" style={{ background: MKT.ink, color: MKT.paper, padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
              Answer every call. Start free.
            </Link>
            <Link href="/tools/ai-receptionist-cost-calculator" className="sf-link" style={{ border: `1.5px solid ${MKT.ink10}`, color: MKT.ink, padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none", background: "rgba(255,255,255,0.5)" }}>
              Compare receptionist costs
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
            More free tools: generate an{" "}
            <Link href="/tools/ai-receptionist-script-generator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              AI receptionist script
            </Link>
            , write your{" "}
            <Link href="/tools/sms-template-generator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              missed-call text-back
            </Link>
            , or see{" "}
            <Link href="/tools/customer-lifetime-value-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              what one customer is worth over a lifetime
            </Link>
            .
          </p>
        </section>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
