// 2026-08-24 — /tools/sms-template-generator — free tool (the PostPlanify
// free-tools SEO motion): server-rendered GEO copy + FAQ around a client
// template composer island.
//
// The wedge: every page ranking for "sms templates for small business" is a
// static listicle you scroll and retype. This one composes for your message
// type, industry and tone, keeps the merge fields, and counts segments live.
import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { MarketplaceNav, MarketplaceFooter } from "@/components/marketplace/marketplace-chrome";
import { MarketplaceStyles } from "@/components/marketplace/marketplace-styles";
import { MKT } from "@/components/marketplace/marketplace-data";
import { SmsTemplateGenerator } from "@/components/seo/sms-template-generator";
import { buildOgUrl } from "@/lib/seo/og-card";

/** FAQ answers use a few <strong> tags for readability; JSON-LD wants plain
 *  text, so strip tags before embedding in the schema. */
function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}

const TITLE = "SMS Template Generator for small business — free, no signup";
const DESCRIPTION =
  "Free SMS template generator for service businesses: missed-call text-backs, appointment reminders, confirmations, review requests and quote follow-ups, written for your industry and tone, with merge fields and a live 160-character count.";

const OG_URL = buildOgUrl({ kind: "tool", name: "SMS Template Generator", hook: "Business texts that fit in one segment" });

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/tools/sms-template-generator",
    types: { "text/markdown": "/tools/sms-template-generator.md" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tools/sms-template-generator",
    type: "website",
    images: [{ url: OG_URL, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_URL] },
};

// FAQ strings render via dangerouslySetInnerHTML (inline <strong> only).
// INVARIANT: keep these literal constants — never interpolate user/dynamic input.
const FAQ = [
  {
    q: "Why does the 160-character limit matter?",
    a: "Carriers bill per <strong>segment</strong>, not per message. A GSM-7 message fits 160 characters in one segment; go one character over and it splits into segments of 153 each, so a 161-character text costs double. At a few thousand sends a month that's real money for no extra value.",
  },
  {
    q: "Why did my message drop to 70 characters?",
    a: "One non-GSM character does it. A curly apostrophe pasted from a word processor, an emoji, or an en dash flips the whole message to <strong>UCS-2</strong> encoding, where a single segment holds 70 characters instead of 160. The counter on this page tells you which encoding you're in. Retype the punctuation and you get your 160 back.",
  },
  {
    q: "What are merge fields and do I have to use them?",
    a: "They're placeholders like <strong>{{first_name}}</strong> that your CRM or texting tool fills in per recipient. Most tools use this double-brace format. If yours uses a different one, swap the braces after copying. Merge fields expand at send time, so the real message is a little longer than the count shows.",
  },
  {
    q: "Do I need to register before I can text customers in the US?",
    a: "Yes, if you're texting from a 10-digit business number. US carriers require <strong>A2P 10DLC registration</strong>, and unregistered traffic gets filtered silently. Your messages look sent but never arrive. Run the free A2P 10DLC checker before you send at volume.",
  },
  {
    q: "Which of these templates is worth setting up first?",
    a: "The <strong>missed-call text-back</strong>, without much argument. It fires on the calls you already paid to generate and would otherwise lose entirely, and it needs no list, no consent campaign and no schedule. The customer contacted you first.",
  },
  {
    q: "Does this use AI to write the message?",
    a: "No. Every message is assembled in your browser from a fixed structure and the options you pick, with <strong>no model and no network calls</strong>. The same inputs always produce the same text, which means you can review one template and trust every send after it.",
  },
];

export default function SmsTemplateGeneratorPage(): ReactElement {
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
          <span style={{ color: "rgba(34,29,23,0.7)" }}>SMS template generator</span>
        </nav>
        <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: 700 }}>
          SMS Template Generator
        </h1>
        <p style={{ margin: "14px 0 26px", fontSize: 17, lineHeight: 1.55, color: "rgba(34,29,23,0.7)", maxWidth: 660 }}>
          Missed-call text-backs, reminders, confirmations, review requests and quote follow-ups, written for your
          industry and your tone. Merge fields stay intact, and the segment counter tells you before you send whether
          the message costs one text or two.
        </p>
        <SmsTemplateGenerator />

        <section style={{ padding: "40px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>The six texts a service business actually needs</h2>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.7, color: "rgba(34,29,23,0.72)" }}>
            <li>
              <strong>Missed-call text-back.</strong> Fires the second a call goes unanswered. The caller already wanted
              you; this is the cheapest save in the business.
            </li>
            <li>
              <strong>Appointment reminder.</strong> Sent a day out, with a one-key confirm. The single most reliable way
              to cut no-shows.
            </li>
            <li>
              <strong>Booking confirmation.</strong> Sent immediately, so the appointment lands in the customer&apos;s
              message thread instead of a forgotten email.
            </li>
            <li>
              <strong>Review request.</strong> Sent while the customer still feels the result, not three weeks later.
            </li>
            <li>
              <strong>Quote follow-up.</strong> Most quotes die of silence rather than price. One text a few days later
              recovers a surprising share of them.
            </li>
            <li>
              <strong>On my way.</strong> Kills the &quot;where are they&quot; call before the customer makes it.
            </li>
          </ul>
        </section>

        <section style={{ padding: "30px 0 0" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Templates are the easy half</h2>
          <p style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.65, color: "rgba(34,29,23,0.72)" }}>
            Copying a good template takes a minute. Sending it <strong>every time, at the right moment, without anyone
            remembering to</strong> is the part that actually changes the numbers. SeldonFrame wires these into the
            triggers that produce them: a missed call fires the text-back, a booking fires the confirmation, a completed
            job fires the review request. Before you set that up, it is worth knowing{" "}
            <Link href="/tools/missed-call-calculator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              what missed calls already cost you
            </Link>
            .
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
            <Link href="/signup" className="sf-link" style={{ background: MKT.ink, color: MKT.paper, padding: "13px 26px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}>
              Send these automatically. Start free.
            </Link>
            <Link href="/tools/a2p-10dlc-checker" className="sf-link" style={{ border: `1.5px solid ${MKT.ink10}`, color: MKT.ink, padding: "12px 24px", borderRadius: 12, fontWeight: 700, fontSize: 15.5, textDecoration: "none", background: "rgba(255,255,255,0.5)" }}>
              Check your A2P 10DLC status
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
            , write a{" "}
            <Link href="/tools/cancellation-policy-generator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              cancellation policy
            </Link>
            , or generate an{" "}
            <Link href="/tools/ai-receptionist-script-generator" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
              AI receptionist script
            </Link>
            .
          </p>
        </section>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
