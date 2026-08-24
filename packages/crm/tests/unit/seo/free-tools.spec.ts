// 2026-08-24 — The free-tools registry + the new tools' pure logic.
//
// Two jobs:
//   1. Kill the drift bug the registry was created to fix. The slug list used to
//      live in three places (the hub, sitemap.ts, llms.txt/route.ts) and could
//      disagree with reality. These tests assert every registry slug has a real
//      page directory AND a real Markdown-twin route on disk, so "listed but
//      404s" and "shipped but uncrawlable" both fail here instead of in prod.
//   2. Pin the math/format of the tools built in this wave, the same way
//      calculator-math.spec.ts pins the pricing calculators.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import QRCode from "qrcode";

import { TOOL_PAGES, allToolSlugs, getToolPage, interactiveToolPages } from "@/lib/seo/tools-pages";
import { renderToolMarkdown } from "@/lib/seo/tools-markdown";

import { computeCustomerLtv, encodeClvState, decodeClvState, CLV_BOUNDS } from "@/components/seo/customer-lifetime-value-calculator";
import { composeSmsTemplate, countSmsSegments, OPT_OUT_LINE } from "@/components/seo/sms-template-generator";
import { composeVoicemailGreeting, estimateSpokenSeconds } from "@/components/seo/voicemail-greeting-generator";
import { composeCancellationPolicy, formatNotice, formatFee } from "@/components/seo/cancellation-policy-generator";
import { buildLocalBusinessJsonLd, renderSchemaScript, SCHEMA_DAYS } from "@/components/seo/local-business-schema-generator";
import { composeGbpDescription, GBP_DESCRIPTION_LIMIT, MAX_DIFFERENTIATORS } from "@/components/seo/google-business-profile-description-generator";
import { buildReviewUrl, printPixels, PRINT_DPI, PRINT_SIZES } from "@/components/seo/google-review-qr-code-generator";

const APP_DIR = join(process.cwd(), "src", "app");

// ─── Registry: the anti-drift invariants ────────────────────────────────────

test("every tool slug is unique", () => {
  const slugs = allToolSlugs();
  assert.equal(new Set(slugs).size, slugs.length);
});

test("every tool slug is URL-safe kebab-case", () => {
  for (const slug of allToolSlugs()) {
    assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `bad slug: ${slug}`);
  }
});

test("every registry entry has a real page directory on disk", () => {
  for (const slug of allToolSlugs()) {
    const page = join(APP_DIR, "(public)", "tools", slug, "page.tsx");
    assert.ok(existsSync(page), `missing page for /tools/${slug} (expected ${page})`);
  }
});

test("every registry entry has a Markdown twin route on disk", () => {
  for (const slug of allToolSlugs()) {
    const route = join(APP_DIR, "tools", `${slug}.md`, "route.ts");
    assert.ok(existsSync(route), `missing Markdown twin for /tools/${slug}.md (expected ${route})`);
  }
});

test("the seven tools from the 2026-08-24 wave are all registered", () => {
  const wave = [
    "google-review-qr-code-generator",
    "sms-template-generator",
    "voicemail-greeting-generator",
    "cancellation-policy-generator",
    "local-business-schema-generator",
    "google-business-profile-description-generator",
    "customer-lifetime-value-calculator",
  ];
  for (const slug of wave) assert.equal(getToolPage(slug).slug, slug);
});

test("getToolPage throws on an unknown slug rather than returning a half-empty page", () => {
  assert.throws(() => getToolPage("not-a-real-tool"), /Unknown tool slug/);
});

test("every entry has non-empty title, description and summary", () => {
  for (const tool of TOOL_PAGES) {
    assert.ok(tool.title.trim().length > 0, tool.slug);
    assert.ok(tool.description.trim().length > 0, tool.slug);
    assert.ok(tool.summary.trim().length > 0, tool.slug);
  }
});

test("the two product landers are the only non-interactive tools", () => {
  const nonInteractive = TOOL_PAGES.filter((t) => !t.interactive).map((t) => t.slug).sort();
  assert.deepEqual(nonInteractive, ["ai-website-generator", "free-booking-page"]);
  assert.equal(interactiveToolPages().length, TOOL_PAGES.length - 2);
});

// ─── Markdown twins ─────────────────────────────────────────────────────────

test("every Markdown twin renders, points at its HTML canonical, and has no undefined holes", () => {
  for (const slug of allToolSlugs()) {
    const md = renderToolMarkdown(slug);
    assert.match(md, new RegExp(`HTML version: https://www\\.seldonframe\\.com/tools/${slug}(?:\\r?\\n|$)`));
    assert.ok(md.startsWith(`# ${getToolPage(slug).title}`), slug);
    assert.doesNotMatch(md, /\b(?:undefined|null|NaN)\b/, slug);
    assert.ok(md.length > 200, slug);
  }
});

test("a twin with a verified markdown block renders its inputs and outputs", () => {
  const md = renderToolMarkdown("customer-lifetime-value-calculator");
  assert.match(md, /## What you enter/);
  assert.match(md, /## What you get back/);
  assert.match(md, /Average ticket/);
  assert.match(md, /## Related free tools/);
});

test("a twin without a verified markdown block stays short rather than inventing inputs", () => {
  const md = renderToolMarkdown("missed-call-calculator");
  assert.doesNotMatch(md, /## What you enter/);
  assert.match(md, /## What it does/);
});

// ─── Customer lifetime value ────────────────────────────────────────────────

test("computeCustomerLtv: direct revenue is ticket x visits x years", () => {
  const r = computeCustomerLtv({ avgTicket: 150, visitsPerYear: 4, yearsRetained: 5, referrals: 0, marginPct: 50 });
  assert.equal(r.directRevenue, 3000);
});

test("computeCustomerLtv: total always equals direct plus referral, exactly", () => {
  for (const referrals of [0, 0.5, 1, 2.5, 5]) {
    const r = computeCustomerLtv({ avgTicket: 175, visitsPerYear: 3.5, yearsRetained: 7, referrals, marginPct: 55 });
    assert.equal(r.totalRevenue, r.directRevenue + r.referralRevenue, `referrals=${referrals}`);
  }
});

test("computeCustomerLtv: zero referrals means zero referral revenue and a 1x multiplier", () => {
  const r = computeCustomerLtv({ avgTicket: 200, visitsPerYear: 2, yearsRetained: 4, referrals: 0, marginPct: 60 });
  assert.equal(r.referralRevenue, 0);
  assert.equal(r.referralMultiplier, 1);
  assert.equal(r.totalRevenue, r.directRevenue);
});

test("computeCustomerLtv: two referrals triples lifetime revenue (one generation, never compounded)", () => {
  const base = computeCustomerLtv({ avgTicket: 100, visitsPerYear: 4, yearsRetained: 5, referrals: 0, marginPct: 50 });
  const withRefs = computeCustomerLtv({ avgTicket: 100, visitsPerYear: 4, yearsRetained: 5, referrals: 2, marginPct: 50 });
  assert.equal(withRefs.totalRevenue, base.totalRevenue * 3);
  assert.equal(withRefs.referralMultiplier, 3);
});

test("computeCustomerLtv: gross profit is total revenue at the margin", () => {
  const r = computeCustomerLtv({ avgTicket: 100, visitsPerYear: 4, yearsRetained: 5, referrals: 1, marginPct: 50 });
  assert.equal(r.totalRevenue, 4000);
  assert.equal(r.grossProfitLtv, 2000);
});

test("computeCustomerLtv: clamps a hand-edited permalink to the slider bounds", () => {
  const r = computeCustomerLtv({ avgTicket: 999_999, visitsPerYear: 999, yearsRetained: 999, referrals: 999, marginPct: 999 });
  const expectedDirect = CLV_BOUNDS.avgTicket.max * CLV_BOUNDS.visitsPerYear.max * CLV_BOUNDS.yearsRetained.max;
  assert.equal(r.directRevenue, expectedDirect);
  assert.equal(r.referralMultiplier, 1 + CLV_BOUNDS.referrals.max);
});

test("computeCustomerLtv: total revenue is monotonic non-decreasing in every driver", () => {
  const low = computeCustomerLtv({ avgTicket: 100, visitsPerYear: 2, yearsRetained: 3, referrals: 0, marginPct: 50 });
  const high = computeCustomerLtv({ avgTicket: 200, visitsPerYear: 4, yearsRetained: 6, referrals: 1, marginPct: 50 });
  assert.ok(high.totalRevenue > low.totalRevenue);
  assert.ok(high.grossProfitLtv > low.grossProfitLtv);
});

test("encodeClvState / decodeClvState round-trip on the five short keys", () => {
  const state = { avgTicket: 250, visitsPerYear: 3.5, yearsRetained: 8, referrals: 1.5, marginPct: 60 };
  const qs = encodeClvState(state);
  const params = new URLSearchParams(qs);
  assert.equal(params.get("lt"), "250");
  assert.equal(params.get("lv"), "3.5");
  assert.equal(params.get("ly"), "8");
  assert.equal(params.get("lr"), "1.5");
  assert.equal(params.get("lm"), "60");
  assert.deepEqual(decodeClvState(qs), state);
});

test("decodeClvState clamps out-of-range values instead of rejecting them", () => {
  const decoded = decodeClvState("lt=99999999&lv=0&ly=0&lr=99&lm=0");
  assert.equal(decoded.avgTicket, CLV_BOUNDS.avgTicket.max);
  assert.equal(decoded.visitsPerYear, CLV_BOUNDS.visitsPerYear.min);
  assert.equal(decoded.yearsRetained, CLV_BOUNDS.yearsRetained.min);
  assert.equal(decoded.referrals, CLV_BOUNDS.referrals.max);
  assert.equal(decoded.marginPct, CLV_BOUNDS.marginPct.min);
});

test("decodeClvState ignores missing and non-numeric params", () => {
  assert.deepEqual(decodeClvState(""), {});
  assert.deepEqual(decodeClvState("lt=abc"), {});
});

// ─── SMS templates ──────────────────────────────────────────────────────────

test("composeSmsTemplate keeps merge fields when no business name is given", () => {
  const msg = composeSmsTemplate({ kind: "missed-call", industry: "home-services", tone: "warm", includeOptOut: false });
  assert.match(msg, /\{\{first_name\}\}/);
  assert.match(msg, /\{\{business_name\}\}/);
});

test("composeSmsTemplate substitutes the business name when one is given", () => {
  const msg = composeSmsTemplate({
    kind: "missed-call",
    industry: "home-services",
    tone: "warm",
    businessName: "Northside Plumbing",
    includeOptOut: false,
  });
  assert.match(msg, /Northside Plumbing/);
  assert.doesNotMatch(msg, /\{\{business_name\}\}/);
});

test("composeSmsTemplate appends the opt-out line only when asked", () => {
  const on = composeSmsTemplate({ kind: "review-request", industry: "salon", tone: "brief", includeOptOut: true });
  const off = composeSmsTemplate({ kind: "review-request", industry: "salon", tone: "brief", includeOptOut: false });
  assert.ok(on.endsWith(OPT_OUT_LINE));
  assert.doesNotMatch(off, /Reply STOP/);
  assert.equal(on, `${off}${OPT_OUT_LINE}`);
});

test("composeSmsTemplate is deterministic and leaves no unfilled industry slots", () => {
  const industries = ["home-services", "hvac", "salon", "medspa", "dental", "cleaning", "auto", "legal"] as const;
  const kinds = ["missed-call", "reminder", "confirmation", "review-request", "quote-followup", "on-my-way"] as const;
  const tones = ["warm", "professional", "brief"] as const;
  for (const industry of industries) {
    for (const kind of kinds) {
      for (const tone of tones) {
        const a = composeSmsTemplate({ kind, industry, tone, includeOptOut: true });
        const b = composeSmsTemplate({ kind, industry, tone, includeOptOut: true });
        assert.equal(a, b);
        // {job}/{visit}/{person} are single-brace slots; {{merge_fields}} stay.
        assert.doesNotMatch(a, /(^|[^{])\{(job|visit|person)\}/, `${kind}/${industry}/${tone}`);
        assert.doesNotMatch(a, /\bundefined\b/, `${kind}/${industry}/${tone}`);
      }
    }
  }
});

/** Fill the merge fields the way a real send would, so segment counts are
 *  measured against the message the carrier actually bills for. */
function asSent(template: string): string {
  return template
    .replace(/\{\{first_name\}\}/g, "Sarah")
    .replace(/\{\{business_name\}\}/g, "Northside Plumbing")
    .replace(/\{\{appointment_time\}\}/g, "Tue at 2pm")
    .replace(/\{\{booking_link\}\}/g, "nsplumb.co/book")
    .replace(/\{\{tech_name\}\}/g, "Dave")
    .replace(/\{\{review_link\}\}/g, "g.page/r/CxYz123/review");
}

test("every generated template stays GSM-7 and fits one segment once merge fields are filled", () => {
  const industries = ["home-services", "hvac", "salon", "medspa", "dental", "cleaning", "auto", "legal"] as const;
  const kinds = ["missed-call", "reminder", "confirmation", "review-request", "quote-followup", "on-my-way"] as const;
  const tones = ["warm", "professional", "brief"] as const;
  for (const industry of industries) {
    for (const kind of kinds) {
      for (const tone of tones) {
        const sent = asSent(composeSmsTemplate({ kind, industry, tone, includeOptOut: true }));
        const count = countSmsSegments(sent);
        assert.equal(count.encoding, "GSM-7", `${kind}/${industry}/${tone} left GSM-7: ${sent}`);
        assert.equal(count.segments, 1, `${kind}/${industry}/${tone} is ${count.billableLength} chars sent: ${sent}`);
      }
    }
  }
});

test("countSmsSegments: 160 GSM-7 characters is one segment, 161 is two", () => {
  assert.equal(countSmsSegments("a".repeat(160)).segments, 1);
  const over = countSmsSegments("a".repeat(161));
  assert.equal(over.segments, 2);
  assert.equal(over.limitPerSegment, 153);
});

test("countSmsSegments: a GSM-7 extended character costs two units", () => {
  assert.equal(countSmsSegments("[").billableLength, 2);
  assert.equal(countSmsSegments("a").billableLength, 1);
});

test("countSmsSegments: one curly quote drops the message to UCS-2 and 70 per segment", () => {
  const ascii = countSmsSegments("It's a test");
  const curly = countSmsSegments("It’s a test");
  assert.equal(ascii.encoding, "GSM-7");
  assert.equal(curly.encoding, "UCS-2");
  assert.equal(curly.limitPerSegment, 70);
});

test("countSmsSegments: an empty message is zero segments", () => {
  assert.equal(countSmsSegments("").segments, 0);
});

// ─── Voicemail greetings ────────────────────────────────────────────────────

const VOICEMAIL_BASE = {
  business: "home-services" as const,
  businessName: "Northside Plumbing",
  hours: "Monday through Friday, 8 to 5",
  callbackWindow: "the same day",
  emergencyNumber: "",
  bookingLink: "",
  reopenDate: "",
};

test("composeVoicemailGreeting names the business and asks for the right details", () => {
  const script = composeVoicemailGreeting({ ...VOICEMAIL_BASE, kind: "main" });
  assert.match(script, /Northside Plumbing/);
  assert.match(script, /the address/);
  assert.match(script, /the same day/);
});

test("composeVoicemailGreeting omits optional lines entirely when they are blank", () => {
  const bare = composeVoicemailGreeting({ ...VOICEMAIL_BASE, kind: "main" });
  assert.doesNotMatch(bare, /emergency that can't wait/);
  assert.doesNotMatch(bare, /book yourself in/);

  const full = composeVoicemailGreeting({ ...VOICEMAIL_BASE, kind: "main", emergencyNumber: "555 0142", bookingLink: "example.com/book" });
  assert.match(full, /555 0142/);
  assert.match(full, /example\.com\/book/);
});

test("composeVoicemailGreeting falls back to a generic subject rather than an empty name", () => {
  const script = composeVoicemailGreeting({ ...VOICEMAIL_BASE, businessName: "   ", kind: "after-hours" });
  assert.match(script, /our office/);
  assert.doesNotMatch(script, /\bundefined\b/);
  assert.doesNotMatch(script, /\[\s*\]/);
});

test("composeVoicemailGreeting produces a distinct script for each of the four kinds", () => {
  const kinds = ["main", "after-hours", "holiday", "emergency"] as const;
  const scripts = kinds.map((kind) => composeVoicemailGreeting({ ...VOICEMAIL_BASE, kind }));
  assert.equal(new Set(scripts).size, kinds.length);
  assert.match(scripts[3], /call 911/);
});

test("composeVoicemailGreeting: the holiday script names the reopen date only when given", () => {
  const without = composeVoicemailGreeting({ ...VOICEMAIL_BASE, kind: "holiday" });
  assert.doesNotMatch(without, /We reopen on/);
  const withDate = composeVoicemailGreeting({ ...VOICEMAIL_BASE, kind: "holiday", reopenDate: "Monday, January 5th" });
  assert.match(withDate, /We reopen on Monday, January 5th\./);
});

test("estimateSpokenSeconds scales with length and keeps a default greeting short", () => {
  const script = composeVoicemailGreeting({ ...VOICEMAIL_BASE, kind: "main" });
  const seconds = estimateSpokenSeconds(script);
  assert.ok(seconds > 0 && seconds < 40, `unexpected estimate: ${seconds}s`);
  assert.ok(estimateSpokenSeconds(`${script} ${script}`) > seconds);
});

// ─── Cancellation policy ────────────────────────────────────────────────────

const POLICY_BASE = {
  industry: "salon" as const,
  businessName: "Rowan Studio",
  noticeHours: 24,
  lateFeeMode: "percent" as const,
  lateFeeValue: 50,
  noShowFeeMode: "flat" as const,
  noShowFeeValue: 75,
  depositRequired: false,
  depositMode: "flat" as const,
  depositValue: 50,
};

test("formatNotice reads the way a human would say it", () => {
  assert.equal(formatNotice(2), "2 hours");
  assert.equal(formatNotice(24), "24 hours");
  assert.equal(formatNotice(48), "48 hours");
  assert.equal(formatNotice(72), "72 hours");
  assert.equal(formatNotice(168), "7 days");
});

test("formatFee returns null for a switched-off fee, never a $0 string", () => {
  assert.equal(formatFee("none", 50), null);
  assert.equal(formatFee("flat", 75), "$75");
  assert.equal(formatFee("percent", 50), "50% of the service price");
});

test("composeCancellationPolicy states the notice window and both fees", () => {
  const p = composeCancellationPolicy(POLICY_BASE);
  assert.match(p.full, /24 hours/);
  assert.match(p.full, /50% of the service price/);
  assert.match(p.full, /\$75/);
  assert.match(p.full, /Rowan Studio holds your appointment time/);
});

test("composeCancellationPolicy never emits a zero-dollar fee clause when fees are off", () => {
  const p = composeCancellationPolicy({ ...POLICY_BASE, lateFeeMode: "none", noShowFeeMode: "none" });
  assert.doesNotMatch(p.full, /\$0/);
  assert.doesNotMatch(p.full, /charged \./);
  assert.match(p.full, /there is no fee/);
  // With no fees there is nothing to consent to beyond the notice window.
  assert.doesNotMatch(p.checkbox, /charged/);
});

test("composeCancellationPolicy adds the deposit clause only when the toggle is on", () => {
  const off = composeCancellationPolicy(POLICY_BASE);
  assert.doesNotMatch(off.full, /Deposits:/);
  const on = composeCancellationPolicy({ ...POLICY_BASE, depositRequired: true, depositValue: 40 });
  assert.match(on.full, /Deposits: a \$40 deposit is required/);
});

test("composeCancellationPolicy switches to the first person when no business name is set", () => {
  const p = composeCancellationPolicy({ ...POLICY_BASE, businessName: "" });
  assert.match(p.full, /^Cancellation and no-show policy/);
  assert.match(p.full, /We hold your appointment time/);
  assert.match(p.checkbox, /the cancellation policy requires 24 hours notice/);
});

test("composeCancellationPolicy's short version fits in a single SMS segment for every fee combination", () => {
  const combos = [
    { lateFeeMode: "percent" as const, lateFeeValue: 50, noShowFeeMode: "percent" as const, noShowFeeValue: 100 },
    { lateFeeMode: "flat" as const, lateFeeValue: 250, noShowFeeMode: "flat" as const, noShowFeeValue: 500 },
    { lateFeeMode: "none" as const, lateFeeValue: 0, noShowFeeMode: "percent" as const, noShowFeeValue: 100 },
    { lateFeeMode: "percent" as const, lateFeeValue: 50, noShowFeeMode: "none" as const, noShowFeeValue: 0 },
    { lateFeeMode: "none" as const, lateFeeValue: 0, noShowFeeMode: "none" as const, noShowFeeValue: 0 },
  ];
  for (const noticeHours of [2, 24, 48, 168]) {
    for (const combo of combos) {
      const p = composeCancellationPolicy({ ...POLICY_BASE, noticeHours, ...combo });
      const count = countSmsSegments(p.short);
      assert.equal(count.encoding, "GSM-7", p.short);
      assert.equal(count.segments, 1, `short version is ${count.billableLength} chars: ${p.short}`);
    }
  }
});

test("composeCancellationPolicy uses the industry's own words for the visit", () => {
  const salon = composeCancellationPolicy(POLICY_BASE);
  const trades = composeCancellationPolicy({ ...POLICY_BASE, industry: "home-services" });
  assert.match(salon.full, /appointment time/);
  assert.match(trades.full, /service visit time/);
  assert.match(trades.full, /technician waits 15 minutes/);
});

// ─── LocalBusiness JSON-LD ──────────────────────────────────────────────────

const SCHEMA_BASE = {
  name: "Northside Plumbing",
  type: "Plumber",
  url: "https://northsideplumbing.com",
  telephone: "+1-555-0142",
  priceRange: "$$",
  streetAddress: "120 Mill Street",
  addressLocality: "Portland",
  addressRegion: "OR",
  postalCode: "97205",
  addressCountry: "US",
  latitude: "",
  longitude: "",
  areaServed: "",
  hours: SCHEMA_DAYS.map((d) => ({ day: d.id, closed: d.id === "Sunday", opens: "08:00", closes: "17:00" })),
};

test("buildLocalBusinessJsonLd emits the schema.org envelope and the filled fields", () => {
  const ld = buildLocalBusinessJsonLd(SCHEMA_BASE);
  assert.equal(ld["@context"], "https://schema.org");
  assert.equal(ld["@type"], "Plumber");
  assert.equal(ld.name, "Northside Plumbing");
  assert.deepEqual(ld.address, {
    "@type": "PostalAddress",
    streetAddress: "120 Mill Street",
    addressLocality: "Portland",
    addressRegion: "OR",
    postalCode: "97205",
    addressCountry: "US",
  });
});

test("buildLocalBusinessJsonLd omits empty fields rather than emitting blanks", () => {
  const ld = buildLocalBusinessJsonLd({ ...SCHEMA_BASE, telephone: "  ", priceRange: "", url: "" });
  assert.equal("telephone" in ld, false);
  assert.equal("priceRange" in ld, false);
  assert.equal("url" in ld, false);
  assert.equal(JSON.stringify(ld).includes('""'), false);
});

test("buildLocalBusinessJsonLd drops the address entirely when nothing is filled in", () => {
  const ld = buildLocalBusinessJsonLd({
    ...SCHEMA_BASE,
    streetAddress: "",
    addressLocality: "",
    addressRegion: "",
    postalCode: "",
    addressCountry: "",
  });
  assert.equal("address" in ld, false);
});

test("buildLocalBusinessJsonLd excludes closed days from the opening hours", () => {
  const ld = buildLocalBusinessJsonLd(SCHEMA_BASE);
  const hours = ld.openingHoursSpecification as { dayOfWeek: string }[];
  assert.equal(hours.length, 6);
  assert.equal(hours.some((h) => h.dayOfWeek.endsWith("Sunday")), false);
  assert.equal(hours[0].dayOfWeek, "https://schema.org/Monday");
});

test("buildLocalBusinessJsonLd emits geo only when both coordinates parse as numbers", () => {
  assert.equal("geo" in buildLocalBusinessJsonLd(SCHEMA_BASE), false);
  assert.equal("geo" in buildLocalBusinessJsonLd({ ...SCHEMA_BASE, latitude: "45.5231" }), false);
  assert.equal("geo" in buildLocalBusinessJsonLd({ ...SCHEMA_BASE, latitude: "abc", longitude: "def" }), false);
  const geo = buildLocalBusinessJsonLd({ ...SCHEMA_BASE, latitude: "45.5231", longitude: "-122.6765" }).geo;
  assert.deepEqual(geo, { "@type": "GeoCoordinates", latitude: 45.5231, longitude: -122.6765 });
});

test("buildLocalBusinessJsonLd emits areaServed as a string for one area and a list for several", () => {
  assert.equal(buildLocalBusinessJsonLd({ ...SCHEMA_BASE, areaServed: "Portland" }).areaServed, "Portland");
  assert.deepEqual(buildLocalBusinessJsonLd({ ...SCHEMA_BASE, areaServed: "Portland, Beaverton , " }).areaServed, [
    "Portland",
    "Beaverton",
  ]);
});

test("buildLocalBusinessJsonLd falls back to the generic type when none is set", () => {
  assert.equal(buildLocalBusinessJsonLd({ ...SCHEMA_BASE, type: "" })["@type"], "LocalBusiness");
});

test("renderSchemaScript wraps valid, re-parseable JSON in a script tag", () => {
  const script = renderSchemaScript(buildLocalBusinessJsonLd(SCHEMA_BASE));
  assert.ok(script.startsWith('<script type="application/ld+json">'));
  assert.ok(script.endsWith("</script>"));
  const json = script.replace(/^<script type="application\/ld\+json">\n/, "").replace(/\n<\/script>$/, "");
  assert.equal(JSON.parse(json)["@type"], "Plumber");
});

// ─── Google Business Profile description ────────────────────────────────────

const GBP_BASE = {
  businessName: "Northside Plumbing",
  businessType: "plumbing company",
  city: "Portland",
  services: ["drain cleaning", "water heater repair", "leak detection"],
  yearsInBusiness: 10,
  differentiators: ["licensed", "same-day"],
  tone: "warm" as const,
};

test("composeGbpDescription covers what, where, how long and what is different", () => {
  const r = composeGbpDescription(GBP_BASE);
  assert.match(r.text, /Northside Plumbing is a plumbing company in Portland/);
  assert.match(r.text, /drain cleaning, water heater repair and leak detection/);
  assert.match(r.text, /serving Portland for 10 years/);
  assert.match(r.text, /licensed and insured/);
  assert.match(r.text, /book online/);
});

test("composeGbpDescription never exceeds Google's 750-character limit", () => {
  const monster = composeGbpDescription({
    ...GBP_BASE,
    businessName: "The Extremely Long Name Of A Plumbing Company ".repeat(4),
    businessType: "full service residential and commercial plumbing and drain company ".repeat(3),
    services: ["a".repeat(120), "b".repeat(120), "c".repeat(120), "d".repeat(120), "e".repeat(120)],
    differentiators: ["licensed", "family", "same-day"],
  });
  assert.ok(monster.length <= GBP_DESCRIPTION_LIMIT, `got ${monster.length}`);
  assert.equal(monster.trimmed, true);
  assert.equal(monster.remaining, GBP_DESCRIPTION_LIMIT - monster.length);
});

test("composeGbpDescription reports remaining budget and does not trim a normal description", () => {
  const r = composeGbpDescription(GBP_BASE);
  assert.equal(r.length, r.text.length);
  assert.equal(r.remaining, GBP_DESCRIPTION_LIMIT - r.length);
  assert.equal(r.trimmed, false);
  assert.ok(r.remaining > 0);
});

test("composeGbpDescription drops the years sentence when years is zero", () => {
  const r = composeGbpDescription({ ...GBP_BASE, yearsInBusiness: 0 });
  assert.doesNotMatch(r.text, /years/);
});

test("composeGbpDescription honours the differentiator cap", () => {
  const r = composeGbpDescription({
    ...GBP_BASE,
    differentiators: ["licensed", "family", "same-day", "upfront", "emergency"],
  });
  const used = ["licensed and insured", "family owned", "Same-day appointments", "upfront pricing", "around the clock"].filter(
    (needle) => r.text.includes(needle),
  );
  assert.equal(used.length, MAX_DIFFERENTIATORS);
});

test("composeGbpDescription never emits a URL, a phone number or a price", () => {
  const r = composeGbpDescription(GBP_BASE);
  assert.doesNotMatch(r.text, /https?:\/\//);
  assert.doesNotMatch(r.text, /\$\d/);
  assert.doesNotMatch(r.text, /\d{3}[-.\s]\d{4}/);
});

test("composeGbpDescription handles a business with no services or city without leaving holes", () => {
  const r = composeGbpDescription({ ...GBP_BASE, services: [], city: "", yearsInBusiness: 0, differentiators: [] });
  assert.doesNotMatch(r.text, /\bundefined\b/);
  assert.doesNotMatch(r.text, /\s{2,}/);
  assert.ok(r.text.length > 0);
});

test("composeGbpDescription changes the opening and closing with the tone", () => {
  const texts = (["warm", "professional", "direct"] as const).map((tone) => composeGbpDescription({ ...GBP_BASE, tone }).text);
  assert.equal(new Set(texts).size, 3);
});

// ─── Review QR code ─────────────────────────────────────────────────────────

test("buildReviewUrl produces Google's direct write-a-review URL", () => {
  assert.equal(
    buildReviewUrl("ChIJN1t_tDeuEmsRUsoyG83frY4"),
    "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
  );
});

test("buildReviewUrl escapes a Place ID with URL-unsafe characters", () => {
  assert.match(buildReviewUrl("abc&def=1"), /placeid=abc%26def%3D1$/);
});

test("printPixels converts inches to pixels at 300 DPI", () => {
  assert.equal(PRINT_DPI, 300);
  assert.equal(printPixels(2), 600);
  assert.equal(printPixels(3), 900);
  assert.equal(printPixels(6), 1800);
});

test("every print size is a whole-pixel export and the ids are unique", () => {
  const ids = PRINT_SIZES.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const size of PRINT_SIZES) {
    assert.ok(size.inches > 0);
    assert.equal(printPixels(size.inches) % 1, 0);
  }
});

test("a real review URL encodes as a QR code at every error-correction level", async () => {
  // The widget renders through qrcode's BROWSER build; this exercises the same
  // core encoder through the node build, which is where "data too long for this
  // error-correction level" would surface. A long Place ID is the worst case.
  const url = buildReviewUrl("ChIJN1t_tDeuEmsRUsoyG83frY4ChIJN1t_tDeuEmsRUsoyG83frY4");
  for (const errorCorrectionLevel of ["M", "Q", "H"] as const) {
    const svg = await QRCode.toString(url, { type: "svg", margin: 2, errorCorrectionLevel });
    assert.match(svg, /^<svg/);
    assert.ok(svg.length > 500, `${errorCorrectionLevel} produced a suspiciously small SVG`);
  }
});
