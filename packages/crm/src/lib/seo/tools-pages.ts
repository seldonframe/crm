// 2026-08-24 — The free-tools registry: ONE source of truth for /tools.
//
// Before this file the slug list was hand-maintained in three places (the
// /tools hub, app/sitemap.ts, and app/llms.txt/route.ts), so a new tool could
// ship visible-but-uncrawlable (or crawlable-but-unlisted) and nobody would
// notice. All three now read this registry, and tests/unit/seo/free-tools.spec.ts
// asserts every slug here has a real page directory on disk.
//
// Pure data + pure lookups (no React, no I/O) so it imports cleanly from server
// components, sitemap.ts, llms.txt/route.ts and the /tools/<slug>.md twins.

/** The structured detail a Markdown twin renders (see lib/seo/tools-markdown.ts).
 *  Present on the tools whose inputs/outputs we have verified against the widget;
 *  omitted tools get the short generic twin instead of an invented input list. */
export interface ToolMarkdown {
  /** One paragraph: what the tool produces, and how it produces it. */
  what: string;
  /** Exactly what the visitor types/picks, in the order the widget asks. */
  inputs: string[];
  /** Exactly what comes back out. */
  outputs: string[];
  /** Sibling tool slugs worth following from the twin. */
  related?: string[];
}

export interface ToolPage {
  /** URL segment under /tools. */
  slug: string;
  /** Display name — the hub card heading and the llms.txt link text. */
  title: string;
  /** Hub card blurb (sentence case, one or two sentences). */
  description: string;
  /** Lowercase one-liner for llms.txt and the Markdown twin's summary line. */
  summary: string;
  /**
   * True when the page's value IS a client-side calculator/generator the
   * visitor operates in place. False for the pages that are landing surfaces
   * over a shipped product flow (the build widget), where the interaction is
   * "start a build", not "compute something".
   */
  interactive: boolean;
  markdown?: ToolMarkdown;
}

export const TOOL_PAGES: readonly ToolPage[] = [
  {
    slug: "ai-visibility-checker",
    title: "AI Visibility Checker",
    description:
      "Can ChatGPT recommend your business? Grade your AI visibility and get the exact prompts to test it yourself.",
    summary:
      "grade whether ChatGPT and Google's AI can recommend your business, plus the exact prompts to test it yourself",
    interactive: true,
  },
  {
    slug: "speed-to-lead-calculator",
    title: "Speed-to-Lead Calculator",
    description: "See the revenue slow lead follow-up costs you — and what replying in under 5 minutes recovers.",
    summary:
      "estimate the revenue slow lead follow-up costs, and what replying in under 5 minutes recovers",
    interactive: true,
  },
  {
    slug: "no-show-cost-calculator",
    title: "No-Show Cost Calculator",
    description:
      "Estimate what no-shows cost your practice each month — and what automated reminders and AI confirmations recover.",
    summary:
      "estimate the revenue no-shows cost a booking-heavy business, and what automated reminders recover",
    interactive: true,
  },
  {
    slug: "ai-receptionist-script-generator",
    title: "AI Receptionist Script Generator",
    description:
      "Generate a complete AI receptionist call script for your business — greeting, questions, booking, after-hours. Copy it free.",
    summary:
      "generate a complete AI receptionist call script for any business — greeting, questions, booking, after-hours",
    interactive: true,
  },
  {
    slug: "service-business-faq-generator",
    title: "Service Business FAQ Generator",
    description:
      "Generate a ready-to-use customer FAQ for your service business — and your AI agent's knowledge base. Copy free.",
    summary: "generate a ready customer FAQ (and AI-agent knowledge base) for a service business",
    interactive: true,
  },
  {
    slug: "booking-friction-grader",
    title: "Booking Friction Grader",
    description:
      "Answer 8 questions to score how easy you make it to book — and get the specific fixes losing you appointments.",
    summary: "score how easy you make it to book and get the specific fixes losing you appointments",
    interactive: true,
  },
  {
    slug: "missed-call-calculator",
    title: "Missed Call Cost Calculator",
    description: "Estimate the monthly revenue missed calls cost your business — and what an AI receptionist recovers.",
    summary: "estimate the revenue missed calls cost a service business",
    interactive: true,
  },
  {
    slug: "ai-receptionist-cost-calculator",
    title: "AI Receptionist Cost Calculator",
    description: "Compare what a human receptionist, an answering service and per-minute AI really cost per month.",
    summary: "compare a human receptionist, an answering service and per-minute AI on real monthly cost",
    interactive: true,
  },
  {
    slug: "google-review-link-generator",
    title: "Google Review Link Generator",
    description: "Turn your Google Place ID into a direct review link and a printable QR code — free, no signup.",
    summary: "create a direct Google review link + printable QR code for any business",
    interactive: true,
  },
  {
    // 2026-08-24 — sibling of the link generator above. Distinct query
    // ("google review qr code"), distinct job: print-ready artwork you can
    // hand to a printer, not a link you paste into a text.
    slug: "google-review-qr-code-generator",
    title: "Google Review QR Code Generator",
    description:
      "Print-ready Google review QR codes for table tents, counter cards and window decals. Download PNG or SVG, free.",
    summary:
      "generate a print-ready Google review QR code at real physical sizes and download it as PNG or SVG",
    interactive: true,
    markdown: {
      what:
        "Builds the direct \"write a review\" URL for a Google Place ID, encodes it as a QR code in your browser, and sizes the artwork for a physical print at 300 DPI. The encoding happens client-side, so nothing you type is sent anywhere.",
      inputs: [
        "Google Place ID, or a Google Maps URL containing a place_id parameter",
        "Print size: table tent (2 in), counter card (3 in), poster (4 in) or window decal (6 in)",
        "Error-correction level (higher survives more scuffs and ink bleed on printed stock)",
      ],
      outputs: [
        "The direct review URL the QR code encodes",
        "A PNG sized for the chosen physical width at 300 DPI",
        "A vector SVG that stays sharp at any print size",
      ],
      related: ["google-review-link-generator", "review-response-generator"],
    },
  },
  {
    slug: "review-response-generator",
    title: "Review Response Generator",
    description: "Well-written replies to any Google review — pick the rating, scenario and tone, then copy.",
    summary: "well-written replies to any Google review — no signup, no AI required",
    interactive: true,
  },
  {
    slug: "a2p-10dlc-checker",
    title: "A2P 10DLC Compliance Checker",
    description: "Nine questions to find out whether your business texting is registered right — before carriers filter it.",
    summary: "check whether your business texting meets US carrier registration rules before it gets filtered",
    interactive: true,
  },
  {
    slug: "hubspot-pricing-calculator",
    title: "HubSpot Pricing Calculator",
    description: "Seats, contacts, hubs and the $3,000 onboarding — see what HubSpot really costs before the sales call.",
    summary: "seats × contacts × hubs × onboarding — what HubSpot really costs",
    interactive: true,
  },
  {
    slug: "gohighlevel-cost-calculator",
    title: "GoHighLevel Cost Calculator",
    description: "Base plan + AI Employee per sub-account + usage, multiplied by your client count — the real agency bill.",
    summary: "base plan + AI Employee per sub-account + usage at N clients",
    interactive: true,
  },
  {
    slug: "voice-ai-cost-calculator",
    title: "Voice AI Cost Calculator",
    description: "STT + LLM + TTS + telephony stacked per minute — why the advertised $0.05/min is really ~$0.30.",
    summary: "the real per-minute cost of a voice AI stack (STT + LLM + TTS + telephony)",
    interactive: true,
  },
  {
    slug: "klaviyo-cost-calculator",
    title: "Klaviyo Cost Calculator",
    description: "Profiles and SMS sends in, monthly bill out — including the suppressed-profiles gotcha.",
    summary: "profiles + SMS sends → your monthly Klaviyo bill",
    interactive: true,
  },
  {
    slug: "agency-margin-calculator",
    title: "Agency Margin Calculator",
    description: "Retainer minus tool stack minus labor — see your real margin per client and what a flat stack changes.",
    summary: "retainer minus tool stack minus labor — your real margin per client",
    interactive: true,
  },
  {
    slug: "claude-project-brief-generator",
    title: "Claude Project Brief Generator",
    description:
      "Generate the complete standing-instructions block (role, tasks, tone, never-list) for a Claude Project — ready to paste.",
    summary:
      "generate the standing-instructions block for a Claude Project (and see how SeldonFrame automates it per client)",
    interactive: true,
  },
  {
    slug: "ai-website-generator",
    title: "AI Website Generator",
    description:
      "Paste your Google Business Profile or describe your business — get a real hosted website, booking page, intake form and CRM in 3 minutes. Free.",
    summary:
      "paste your Google Business Profile or describe your business, and get a real hosted website, booking page, intake form and CRM in about 3 minutes",
    interactive: false,
  },
  {
    slug: "free-booking-page",
    title: "Free Booking Page",
    description:
      "A real online booking page on your own subdomain — appointment types, intake form, and CRM sync. Live in 3 minutes, free.",
    summary:
      "a real online booking page on your own subdomain, with appointment types, an intake form and CRM sync, live in about 3 minutes",
    interactive: false,
  },
  {
    slug: "website-grader",
    title: "Local Business Website Grader",
    description: "Score your website on the 7 things that actually win local jobs — speed, booking, trust signals, and more.",
    summary: "score your website on the 7 things that win local jobs, with a prioritized fix list",
    interactive: true,
  },

  // ─── 2026-08-24 free-tools wave ────────────────────────────────────────────
  // Seven new client-side tools. Every ranking competitor for these queries is
  // a static listicle, so an interactive page is the wedge.

  {
    slug: "sms-template-generator",
    title: "SMS Template Generator",
    description:
      "Missed-call text-backs, reminders, confirmations and review requests, written for your industry and tone, with merge fields and a live character count.",
    summary:
      "generate missed-call text-back, reminder, confirmation and review-request SMS templates by industry and tone, with merge fields and a live segment count",
    interactive: true,
    markdown: {
      what:
        "Composes a ready-to-send business text message from a proven structure for the message type you pick, tuned to your industry and tone, with merge fields left in place so your CRM or texting tool can fill them. It also counts characters and SMS segments as you edit, because a message that spills past 160 characters silently costs twice as much to send. Everything is composed in your browser, with no model and no network call.",
      inputs: [
        "Message type: missed-call text-back, appointment reminder, appointment confirmation, review request, quote follow-up or on-my-way",
        "Industry: home services, HVAC, salon or spa, med spa, dental, cleaning, auto or legal",
        "Tone: warm, professional or brief",
        "Business name, and whether to include an opt-out line",
      ],
      outputs: [
        "The message body with {{merge_fields}} intact",
        "Character count, SMS segment count and the encoding the count assumes",
        "A copy button, plus the segment warning when the message crosses a boundary",
      ],
      related: ["missed-call-calculator", "no-show-cost-calculator", "a2p-10dlc-checker"],
    },
  },
  {
    slug: "voicemail-greeting-generator",
    title: "Voicemail Greeting Generator",
    description:
      "Business voicemail scripts that actually get callers to leave a message. Main, after-hours, holiday and emergency versions.",
    summary:
      "generate business voicemail greeting scripts (main, after-hours, holiday and emergency) for any business type",
    interactive: true,
    markdown: {
      what:
        "Writes a voicemail greeting script from the structure a good front desk uses: identify the business, set the expectation for a callback, tell the caller exactly what to say, and give an escape hatch for emergencies. Four variants cover the situations a business actually needs recorded. The script is composed in your browser, with no model and no network call.",
      inputs: [
        "Greeting type: main, after-hours, holiday or closure, or emergency overflow",
        "Business type: home services, HVAC, salon or spa, med spa, dental, cleaning, auto, legal or other",
        "Business name, business hours, and the callback window you promise",
        "Optional: an emergency number and a booking link to read out",
      ],
      outputs: [
        "A word-for-word greeting script, ready to record",
        "A length estimate in seconds at normal speaking pace",
        "A copy button for the script text",
      ],
      related: ["ai-receptionist-script-generator", "missed-call-calculator", "ai-receptionist-cost-calculator"],
    },
  },
  {
    slug: "cancellation-policy-generator",
    title: "Cancellation Policy Generator",
    description:
      "A paste-ready cancellation and no-show policy: your notice window, your late and no-show fees, deposits, and the exact wording to put on the booking page.",
    summary:
      "generate a paste-ready cancellation and no-show policy from your notice window, late/no-show fees and deposit rules",
    interactive: true,
    markdown: {
      what:
        "Turns four policy decisions into policy text you can paste onto a booking page, an intake form and a confirmation text. It emits a full version for your website and a short version that fits in a reminder message, since a policy nobody reads before the appointment does not reduce no-shows. Everything is composed in your browser. This is policy text, not legal advice.",
      inputs: [
        "Industry: salon or spa, med spa, dental, home services, cleaning, auto, fitness or consulting",
        "Notice window in hours (how far ahead a client must cancel to avoid a fee)",
        "Late-cancellation fee: none, a flat amount, or a percentage of the service",
        "No-show fee: none, a flat amount, or a percentage of the service",
        "Deposit required: on or off, with an amount",
      ],
      outputs: [
        "The full policy text for a website or booking page",
        "A short version sized for a confirmation or reminder text",
        "A one-line summary for the booking form checkbox",
      ],
      related: ["no-show-cost-calculator", "sms-template-generator", "booking-friction-grader"],
    },
  },
  {
    slug: "local-business-schema-generator",
    title: "LocalBusiness Schema Generator",
    description:
      "Fill in your business details and get valid LocalBusiness JSON-LD with hours, service area and geo coordinates, ready to paste into your site's head.",
    summary:
      "produce valid LocalBusiness JSON-LD (hours, service area, geo coordinates) for any local business, ready to paste",
    interactive: true,
    markdown: {
      what:
        "Builds a schema.org LocalBusiness JSON-LD block from a plain form. Empty fields are omitted rather than emitted as blanks, so what you copy is valid structured data instead of a template with holes in it. Everything runs in your browser.",
      inputs: [
        "Business name, type (the schema.org subtype), website URL, phone and price range",
        "Street address, city, region, postal code and country",
        "Opening hours per day, with a closed toggle",
        "Optional: latitude and longitude, and the cities or areas you serve",
      ],
      outputs: [
        "A complete <script type=\"application/ld+json\"> block",
        "The raw JSON-LD object, formatted",
        "A copy button, and a note on where in the page to paste it",
      ],
      related: ["ai-visibility-checker", "website-grader", "google-business-profile-description-generator"],
    },
  },
  {
    slug: "google-business-profile-description-generator",
    title: "Google Business Profile Description Generator",
    description:
      "Write the 750-character business description Google asks for, by business type, services and city, with a live character count.",
    summary:
      "write a Google Business Profile description inside Google's 750-character limit, by business type, services and city",
    interactive: true,
    markdown: {
      what:
        "Composes a Google Business Profile description from the structure Google's own guidelines reward: what you do, who you serve, where you serve them, what makes you different, and how to get started. It counts against the 750-character limit as you type and trims the optional sentences first when you run long. Everything is composed in your browser.",
      inputs: [
        "Business name, business type and the city or area you serve",
        "Up to five services, in the order you want them mentioned",
        "Years in business, and up to three differentiators (licensed, family-owned, same-day, and so on)",
        "Tone: warm, professional or direct",
      ],
      outputs: [
        "A description within Google's 750-character limit",
        "A live character count with the remaining budget",
        "A copy button for pasting straight into Google Business Profile",
      ],
      related: ["local-business-schema-generator", "ai-visibility-checker", "ai-website-generator"],
    },
  },
  {
    slug: "customer-lifetime-value-calculator",
    title: "Customer Lifetime Value Calculator",
    description:
      "What a local service customer is really worth: average ticket × visits per year × years retained, plus the referrals they bring.",
    summary:
      "calculate customer lifetime value for a local service business from average ticket, visits per year, years retained and referrals",
    interactive: true,
    markdown: {
      what:
        "Calculates lifetime value the way a local service business actually earns it: repeat visits over a retention window, plus the customers those clients refer. Most LTV calculators are built for subscription SaaS and assume a flat monthly fee, which understates a business whose customer comes back three times a year for a decade. The arithmetic runs in your browser, and referrals are counted at one generation only rather than compounded.",
      inputs: [
        "Average ticket (what one visit or job is worth)",
        "Visits per year",
        "Years the average customer stays",
        "Referrals per customer over that lifetime",
        "Gross margin percentage (to see profit lifetime value, not just revenue)",
      ],
      outputs: [
        "Direct lifetime revenue, and total lifetime revenue including referrals",
        "Gross-profit lifetime value at your margin",
        "The referral multiplier applied, and what a single lost customer costs",
      ],
      related: ["missed-call-calculator", "no-show-cost-calculator", "speed-to-lead-calculator"],
    },
  },
] as const;

/** Every tool slug, in hub order. */
export function allToolSlugs(): string[] {
  return TOOL_PAGES.map((t) => t.slug);
}

/** Look up one tool. Throws on an unknown slug — a missing tool is a bug in the
 *  registry, never a page we should render half-empty (Optimistic Path). */
export function getToolPage(slug: string): ToolPage {
  const found = TOOL_PAGES.find((t) => t.slug === slug);
  if (!found) throw new Error(`Unknown tool slug: ${slug}`);
  return found;
}

/** The tools whose value is a client-side calculator/generator. */
export function interactiveToolPages(): ToolPage[] {
  return TOOL_PAGES.filter((t) => t.interactive);
}
