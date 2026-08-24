import type { Guide } from "./types";

export const guide: Guide = {
  slug: "white-label-ai-platform-pricing-compared",
  title: "White-Label AI Platform Pricing Compared: Stammer vs GoHighLevel vs Vendasta vs Synthflow (2026)",
  description:
    "What it actually costs to put your own brand on an AI platform and resell it. Entry price, white-label surcharge, per-client fees and revenue cut for four platforms, plus ours, fetched 2026-08-24.",
  targetKeyword: "white label ai platform pricing",
  intent: "commercial",
  cluster: "sell-agents",
  relatedTool: "/tools/agency-margin-calculator",
  relatedBest: "/agencies",
  relatedChart: { href: "/charts/crm-pricing-index", label: "See the full CRM pricing index" },
  dek: "The sticker price on a white-label platform is rarely the number that decides your margin. What decides it is whether white-label is included or sold separately, whether you pay again per client, and whether you can mark up what you rebill. Here is that comparison for Stammer.ai, GoHighLevel, Vendasta and Synthflow, with our own numbers in the same format, because being cagey about our fees while listing theirs would defeat the point.",
  sections: [
    {
      h2: "The four questions that decide your margin",
      body: "Comparing white-label platforms on monthly price is how agencies end up on the wrong one. The monthly price is the smallest of the four numbers that matter.\n\n**What does white-label itself cost?** On some platforms it is included at every paid tier. On others it is gated behind a higher plan, or sold as a separate add-on that costs more than the plan.\n\n**What do you pay per client?** A platform can look flat and still charge you again for every sub-account you add, which turns your cost curve into a copy of your revenue curve.\n\n**Can you mark up what you rebill?** Rebilling telephony and AI at cost is not the same product as rebilling them at a margin, and at least one platform here charges a specific tier for the difference.\n\n**What percentage of your revenue does the platform take?** Usually none, on these platforms. But none of them publish a rake, and absence of a published rake is not proof there is none, especially where the real terms are set on a sales call.",
    },
    {
      h2: "The matrix",
      body: "Every figure below came from the vendor's own live pricing page or vendor support docs on 2026-08-24, except the Synthflow white-label figure, which is third-party reported and marked as such.",
      diagram: {
        type: "table",
        title: "White-label AI platforms, four ways",
        columns: ["Platform", "Entry price", "What white-label costs", "Per-client fees", "Cut of your revenue"],
        rows: [
          {
            cells: [
              "Stammer.ai",
              "$197/mo (Agency)",
              "Included at every paid tier",
              "None listed. Usage draws down a prepaid agency wallet, plus $10/mo per extra chat agent, $5/mo per extra voice agent, $15/mo per extra concurrent call",
              "None disclosed",
            ],
            domain: "stammer.ai",
          },
          {
            cells: [
              "GoHighLevel",
              "$97/mo (Starter, 3 sub-accounts)",
              "Desktop white-label included. The white-label mobile app is a separate $497/mo",
              "AI Employee at $50/mo or $97/mo per sub-account, Branded Client Portal App at $49/mo per sub-account",
              "None disclosed, but rebilling WITH markup requires the $497/mo Agency Pro tier",
            ],
            domain: "gohighlevel.com",
          },
          {
            cells: [
              "Vendasta",
              "$0 subscription with a $119/mo minimum of wholesale product spend",
              "Gated to Professional, which is a $599/mo minimum on a 1 year contract. Starter is co-branded with Vendasta",
              "Not published. Per-product wholesale rates are demo-gated",
              "None disclosed",
            ],
            domain: "vendasta.com",
          },
          {
            cells: [
              "Synthflow",
              "Not published. The only figure on the live page is \"Enterprise contracts start at $30,000 annually\"",
              "Not published. Third parties report $2,000/mo for a white-label toolkit; the vendor does not publish it and synthflow.ai/white-label returns a 404",
              "Not published",
              "None disclosed",
            ],
            domain: "synthflow.ai",
          },
          {
            cells: [
              "SeldonFrame (I build this)",
              "$99/mo (Agency Starter, 10 client workspaces)",
              "Included, no surcharge and no separate mobile-app fee",
              "None. Client capacity is priced into the tier: $99 for 10, $199 for 30, $299 for unlimited",
              "0% on agency plans. A flat 2% GMV applies on the $29 and $49 solo plans only, and only when SeldonFrame is the sales channel. Marketplace transactions carry a flat 5%",
            ],
            domain: "seldonframe.com",
          },
        ],
        note: "Vendor pages and vendor support docs, fetched 2026-08-24. \"None disclosed\" means the vendor publishes a subscription and no percentage. It does not mean a partner agreement could not contain one.",
      },
    },
    {
      h2: "GoHighLevel: the tier that unlocks markup",
      body: "GoHighLevel publishes all four of its tiers, which is more than most of this list does. The detail worth knowing is that the feature agencies actually need is not on the tier most of them buy.\n\nRebilling phone and email at cost is available on the $297/mo Unlimited plan. Rebilling them **with markup** is, in the vendor's own words, only available on the $497/mo plan. If your business model is buying telephony wholesale and selling it to clients at a margin, the entry price for that model is $497/mo, not $97/mo.\n\nThe second thing to price in is the agency wallet. HighLevel charges the agency's card to load credits and auto-recharges when the balance drops. Sub-accounts do not hold separate wallets, so all client usage flows through the agency's wallet. You float your clients' usage.",
      diagram: {
        type: "table",
        title: "GoHighLevel published tiers",
        columns: ["Plan", "Monthly", "Annual", "Sub-accounts", "Rebilling"],
        rows: [
          { cells: ["Starter", "$97", "$970", "3", "Not included"] },
          { cells: ["Unlimited", "$297", "$2,970", "Unlimited", "Rebill phone and email at cost, no markup"] },
          { cells: ["Agency Pro", "$497", "$4,970", "Unlimited", "Rebill with markup, plus SaaS mode and automated sub-account creation"] },
          { cells: ["Enterprise", "Custom", "Custom", "Custom", "Custom, with dedicated CSM and white-label mobile app"] },
        ],
        note: "gohighlevel.com/pricing, fetched 2026-08-24. Widely circulated third-party figures such as \"Conversation AI $0.04/message\" and \"Voice AI $0.13/minute\" do not appear in HighLevel's current published pricing and should not be cited.",
      },
    },
    {
      h2: "GoHighLevel: what stacks on top",
      body: "The subscription is the beginning of the bill, not the end of it. Below is what HighLevel publishes as separate line items, which is a genuinely useful thing for a vendor to publish and also a long list.\n\nThe two that move an agency's P&L most are the per-sub-account AI charge and the white-label mobile app. AI Employee at $50 or $97 per sub-account per month is a cost that scales exactly with your client count. The white-label mobile app at $497/mo effectively doubles the cost of Agency Pro for agencies that need their brand on a phone.",
      diagram: {
        type: "table",
        title: "GoHighLevel published add-ons and usage rates",
        columns: ["Item", "Published price"],
        rows: [
          { cells: ["AI Employee Growth", "$50/mo per sub-account, including 1,000 agent responses and 100 voice minutes"] },
          { cells: ["AI Employee Unlimited", "$97/mo per sub-account, subject to fair use"] },
          { cells: ["White label mobile app", "$497/mo"] },
          { cells: ["Branded Client Portal App", "$49/mo per sub-account"] },
          { cells: ["HIPAA compliance", "$297/mo"] },
          { cells: ["Premium support", "$500/mo"] },
          { cells: ["Voice AI voice engine", "$0.045/min, effective May 20 2026"] },
          { cells: ["Voice AI text-to-speech", "$0.015/min OpenAI or Cartesia, $0.035/min ElevenLabs V2.5, $0.170/min ElevenLabs V3"] },
          { cells: ["Voice AI language model", "Billed separately per 1M tokens, from $0.10 input on Gemini 2.0 Flash to $1.25 input and $10.00 output on GPT-5"] },
          { cells: ["Email", "$0.675 per 1,000 emails"] },
          { cells: ["Email validation", "$2.50 per 1,000 validations"] },
          { cells: ["Content AI", "$0.063 per image, $0.0945 per 1,000 words"] },
          { cells: ["Reviews AI", "$0.01 per review"] },
          { cells: ["Workflow AI premium actions", "$0.01 per execution"] },
        ],
        note: "help.gohighlevel.com AI product pricing and pricing guide, fetched 2026-08-24. Voice AI has no single all-in per-minute number: it is engine plus TTS plus LLM tokens, with telephony billed at Twilio cost on top.",
      },
    },
    {
      h2: "Vendasta: the platform fee is an offset, not a subscription",
      body: "Vendasta prices differently enough that comparing its entry number to anyone else's is misleading unless you understand the mechanism.\n\nThe subscription is $0. What you commit to is a **monthly minimum of wholesale product spend**. Each dollar you spend on qualifying Vendasta products takes a dollar off the platform fee, so if your spend meets the minimum, the fee for that cycle can be zero. If it does not, you pay the shortfall. The minimum is a floor you pay whether or not you sell.\n\nThe part that matters most for a white-label comparison: white-label is gated to Professional, which carries a $599/mo minimum and a one-year contract. Starter is explicitly co-branded with Vendasta, meaning the platform's name stays visible to your clients.",
      diagram: {
        type: "table",
        title: "Vendasta published plans",
        columns: ["Plan", "Subscription", "Monthly minimum of wholesale spend", "Contract", "Branding"],
        rows: [
          { cells: ["Starter", "$0", "$119", "None", "Co-branding with Vendasta"] },
          { cells: ["Professional", "$0", "$599", "1 year", "White-label client portal"] },
          { cells: ["Premium", "$0", "$1,249", "1 year", "White-label client portal, multi-location"] },
          { cells: ["Custom Enterprise", "$0", "Volume based, contact sales", "1 year", "Custom, plus a custom activation fee at signing"] },
        ],
        note: "vendasta.com/pricing, fetched 2026-08-24 in a browser, since the page returns a 403 to plain fetches. Vendasta's own page title still advertises plans from $99/mo while the live page body shows $119, $599 and $1,249. The $99 is stale metadata and is being propagated by aggregators. Do not cite it.",
      },
      callout: {
        kind: "warning",
        text: "Third-party aggregators circulate at least three different Vendasta price sets, including $99/$499/$999 and $99/$649/$1,279. None of them match the live page as of 2026-08-24. If a comparison quotes Vendasta at $99, it is reading the page title rather than the page.",
      },
    },
    {
      h2: "Synthflow: the reseller rail is being switched off",
      body: "Synthflow is the only vendor in this comparison that publishes essentially nothing an agency could budget against. No per-minute rate, no agency tier, no white-label price. The one published figure is a $30,000-a-year enterprise floor.\n\nThird parties report a $2,000/mo white-label and reseller toolkit. That figure appears in several places, none of them Synthflow, and synthflow.ai/white-label returns a 404. It should be labelled as reported if it is used at all.\n\nThe better-sourced fact is one Synthflow states itself, in its own docs: **in-product reselling through Stripe will be removed on September 15, 2026**. That is a vendor-confirmed withdrawal of the built-in reseller billing rail, and for an agency planning a build on top of it, a dated deprecation is worth more than a disputed price.",
    },
    {
      h2: "What SeldonFrame charges, in the same format",
      body: "I build SeldonFrame, so read this as the vendor's own entry in its own comparison, and hold it to the same standard as the rows above.\n\nThe ladder starts with Builder at $29/mo for a business you run yourself, then Managed at $49/mo. Agency plans at $99, $199 and $299/mo add 10, 30 and unlimited client workspaces. There is no trial: you are charged at checkout and can cancel anytime. The free build, claim and use flow is the trial.\n\nWhite-label is not an add-on. A whitelabel AI front office per client, agent plus CRM plus calendar plus portal plus landing page plus reviews, agency-branded, is the deliverable. There is no white-label surcharge, no separate mobile-app fee, and no per-sub-account AI charge. Model costs run on your own keys at provider rate.\n\nAnd the fees, stated as plainly as I have asked the others to state theirs. Agency plans pay **0% GMV**. The solo plans pay a flat **2% GMV**, and only when SeldonFrame is the sales channel that brought the buyer. Marketplace transactions carry a flat **5%**, attached to the transaction rather than to your plan so there is no cheaper bracket to route a sale through.\n\nThe 2% is designed to push you up a tier rather than to grow with you. At about **$3,500/mo of GMV**, $29 plus 2% equals $99 plus nothing, and above that the agency plan is the cheaper choice. I would rather publish that crossover than have you find it on your own invoice.",
      callout: {
        kind: "tip",
        text: "Run your own numbers before you take anyone's word for a margin, including mine. The agency margin calculator at /tools/agency-margin-calculator takes a client count and a retainer and gives you the spread.",
      },
    },
    {
      h2: "The structural difference, stated once",
      body: "Every competitor in this comparison monetises either your usage or your client count on top of the subscription, and each does it in a different place.\n\nGoHighLevel gates markup-rebilling behind the $497 tier and charges $50 to $97 per sub-account for AI, plus $497/mo for a white-label mobile app. Vendasta gates white-label behind a $599/mo minimum on a one-year contract, and makes the platform fee an offset against wholesale spend, so the minimum is a floor you pay whether or not you sell. Synthflow reportedly charges $2,000/mo for white-label at all, and is removing its built-in reseller billing on September 15, 2026.\n\nStammer.ai is the closest to flat: white-label included at $197/mo, no revenue share disclosed, unlimited client resale. Its variable cost is the prepaid wallet plus $5 to $15/mo for each extra agent or concurrent call.\n\nWhich shape is right depends on your client count and your usage curve, not on which entry price is lowest. A platform that charges per client is cheaper at two clients and worse at twenty. Model your own roster at the size you expect to be in a year, not the size you are today. For the wider price landscape across CRMs and front-office tools, the [CRM pricing index](/charts/crm-pricing-index) carries the full re-verified table.",
    },
  ],
  faq: [
    {
      q: "What is the cheapest white-label AI platform for an agency?",
      a: "On entry price alone, GoHighLevel Starter at $97/mo, but that tier includes 3 sub-accounts and no rebilling at all. On white-label specifically, Stammer.ai at $197/mo includes white-label and unlimited client resale at its lowest paid tier, which is the cheapest genuine white-label entry among the platforms with published pricing as of 2026-08-24. Vendasta's white-label starts at a $599/mo minimum on a one-year contract. Synthflow does not publish agency pricing at all. Disclosure: SeldonFrame, which I build, includes white-label from $99/mo for 10 client workspaces.",
    },
    {
      q: "Does GoHighLevel charge extra for white-label?",
      a: "Partly. Desktop white-label is included, so clients see your branding in the platform. The white-label mobile app is a separate add-on at $497/mo, which is the same as the entire Agency Pro plan. There is also a Branded Client Portal App at $49/mo per sub-account. And the ability to rebill telephony and AI to clients with a markup, rather than at cost, is only available on the $497/mo Agency Pro tier. Figures fetched from gohighlevel.com/pricing on 2026-08-24.",
    },
    {
      q: "How much does Vendasta actually cost?",
      a: "The subscription is $0 and what you commit to is a monthly minimum of wholesale product spend: $119 on Starter, $599 on Professional, $1,249 on Premium, as of 2026-08-24. Every dollar of qualifying product spend offsets a dollar of the platform fee, so the fee can be $0 in a cycle where you meet the minimum, and you pay the shortfall in a cycle where you do not. The minimum is a floor you pay whether or not you sell. White-label is gated to Professional and above, and Professional and Premium both require a one-year contract. Ignore the $99 figure circulating online; it comes from a stale page title, not the live page.",
    },
    {
      q: "Do any of these platforms take a percentage of what I charge my clients?",
      a: "None of them publish one. Stammer.ai, GoHighLevel, Vendasta and Synthflow all disclose no revenue share or take rate on their pricing pages as of 2026-08-24. That is not the same as proving there is none, since Vendasta and Synthflow both route real commercial terms through sales calls. What they charge instead is subscription plus usage plus, in GoHighLevel's and Vendasta's cases, a cost that scales with your client count. Disclosure: SeldonFrame charges 0% on agency plans, a flat 2% GMV on solo plans only when it is the sales channel, and a flat 5% on marketplace transactions.",
    },
    {
      q: "Is Synthflow's white-label really $2,000 a month?",
      a: "That figure is reported by third parties, not published by Synthflow. As of 2026-08-24, synthflow.ai/pricing shows only \"Enterprise contracts start at $30,000 annually\" and synthflow.ai/white-label returns a 404. So the honest answer is that Synthflow does not publish white-label or agency pricing. A better-sourced fact for anyone evaluating them: Synthflow's own documentation states that in-product reselling through Stripe will be removed on September 15, 2026, so the built-in reseller billing rail is being withdrawn.",
    },
  ],
  sources: [
    { label: "Stammer.ai - Pricing", url: "https://stammer.ai/pricing" },
    { label: "GoHighLevel - Pricing", url: "https://www.gohighlevel.com/pricing" },
    { label: "GoHighLevel - AI product pricing", url: "https://help.gohighlevel.com/support/solutions/articles/155000006652-ai-product-pricing" },
    { label: "GoHighLevel - Pricing guide (wallet and rebilling)", url: "https://help.gohighlevel.com/support/solutions/articles/155000001156-highlevel-pricing-guide" },
    { label: "Vendasta - Pricing", url: "https://www.vendasta.com/pricing/" },
    { label: "Synthflow - Pricing", url: "https://synthflow.ai/pricing" },
    { label: "Synthflow docs - Set up pricing and rebilling", url: "https://docs.synthflow.ai/set-up-pricing-and-rebilling" },
  ],
};
