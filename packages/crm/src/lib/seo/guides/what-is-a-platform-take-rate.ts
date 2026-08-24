import type { Guide } from "./types";

export const guide: Guide = {
  slug: "what-is-a-platform-take-rate",
  title: "What Is a Platform Take Rate? Definitions, Real Numbers, and How to Compute Yours",
  description:
    "A take rate is the percentage of each transaction a platform keeps. Here is how it differs from a GMV fee, a revenue share, a subscription and a usage markup, with the published numbers for each.",
  targetKeyword: "what is a platform take rate",
  intent: "informational",
  cluster: "sell-agents",
  relatedTool: "/tools/agency-margin-calculator",
  relatedBest: "/marketplace",
  dek: "Take rate, GMV fee, revenue share, usage markup. Four terms that get used as synonyms and are not, and the difference between them decides whether a platform gets more expensive as you grow or stays where it is. Here is the plain definition of each, with real published numbers attached, so you can work out what any platform is actually charging you.",
  sections: [
    {
      h2: "The definition",
      body: "A **take rate** is the percentage of each transaction that a platform keeps before passing the rest to the seller. If a marketplace has a 30% take rate and a customer pays $100, the seller receives $70 and the platform keeps $30.\n\nIt is also called a commission, a platform fee, or a cut. The term comes from marketplace economics, where take rate is the standard measure of how much of the value flowing through a platform the platform captures.\n\nTwo things follow from that definition and they are the reason the term matters. First, a take rate is charged on **volume**, not on time, so it grows every time you sell more. Second, it is charged on the **transaction**, not on your profit, so a platform with a 20% take rate on a product with a 25% margin has taken most of what you made.",
      callout: {
        kind: "analogy",
        text: "A take rate is the cut a credit card network takes on a sale, except large enough that you notice. The kitchen still made the meal and the staff still served it, but a slice of every plate leaves the building before the owner sees any of it.",
      },
    },
    {
      h2: "Take rate vs GMV fee vs revenue share vs subscription vs usage markup",
      body: "These five shapes are what platforms actually charge, and telling them apart is most of the skill in reading a pricing page.\n\nA **take rate** and a **GMV fee** are close cousins. Both are a percentage of value flowing through the platform. The distinction in practice is scope: take rate usually means a cut of a marketplace transaction the platform hosted, while GMV fee usually means a percentage of gross merchandise value processed through the platform's payment rails, whether or not the platform found the buyer.\n\nA **revenue share** is a negotiated split, usually set in a partner agreement rather than published on a page. When a platform will not tell you a number until you talk to someone, this is almost always the shape.\n\nA **subscription** is a flat recurring fee that does not move with your volume. It is the most predictable shape and the worst one at low volume.\n\nA **usage markup** is a margin on metered units the platform buys wholesale and resells you: minutes, messages, tokens, emails. It rarely appears as a percentage anywhere, which is exactly what makes it hard to compare.",
      diagram: {
        type: "table",
        title: "The five shapes, and what each one charges on",
        columns: ["Shape", "Charged on", "You feel it when", "Published example"],
        rows: [
          {
            cells: [
              "Take rate / commission",
              "A percentage of each transaction",
              "Every sale, permanently",
              "Apple App Store at 30%, or 15% on the Small Business Program",
            ],
          },
          {
            cells: [
              "GMV fee",
              "A percentage of value processed through the platform",
              "Volume grows, even with the same client count",
              "SeldonFrame at a flat 2% on solo plans, and only when SeldonFrame is the sales channel",
            ],
          },
          {
            cells: [
              "Revenue share",
              "A negotiated split of your revenue, set per agreement",
              "You cannot find the number on the pricing page",
              "AWS Marketplace and Salesforce AgentExchange publish no rate at all",
            ],
          },
          {
            cells: [
              "Subscription",
              "Time, regardless of what you sell",
              "Month one, and it does not move afterwards",
              "GoHighLevel at $97, $297 or $497 per month",
            ],
          },
          {
            cells: [
              "Usage markup",
              "Metered units the platform resells you",
              "Your clients succeed and their volume climbs",
              "Retell AI at $0.055/min voice infra, plus per-minute add-ons on top",
            ],
          },
        ],
        note: "Vendor pages fetched 2026-08-24. A single platform usually charges two or three of these at once, which is why one headline number never describes the real cost.",
      },
    },
    {
      h2: "The published baselines",
      body: "Most take-rate intuition comes from consumer app stores, because they are the only large platforms that publish a rate card at all. It is worth anchoring on those numbers before looking at newer categories, because the newer ones look different in a specific way: not higher or lower, but mostly undisclosed.\n\nApple charges a standard **30%** commission on paid apps and in-app purchases, dropping to **15%** for developers in the Small Business Program, which covers developers with up to $1 million in prior-year proceeds, and as low as 10% on second-year subscriptions under the EU's alternative terms.\n\nGoogle Play charges **15%** on the first $1 million of annual revenue and on all auto-renewing subscriptions regardless of revenue, rising to 30% above that threshold for other transactions, with a lower 10 to 20% structure rolling out as external payment options expand.\n\nThe AI platforms are where the pattern breaks. Most of them publish nothing.",
      diagram: {
        type: "table",
        title: "Published take rates, and the platforms that publish none",
        columns: ["Platform", "Published take rate", "Applies to"],
        rows: [
          {
            cells: ["Apple App Store", "30% standard, 15% on the Small Business Program, as low as 10% on year-two subscriptions under EU alternative terms", "Paid apps and in-app purchases"],
            domain: "apple.com",
          },
          {
            cells: ["Google Play", "15% on the first $1M a year and on all auto-renewing subscriptions, 30% above that on other transactions", "Google Play billing transactions"],
            domain: "google.com",
          },
          {
            cells: ["OpenAI GPT Store", "Not publicly disclosed", "Building and publishing are free. Whether a payout program is live, and at what split, is unconfirmed"],
            domain: "openai.com",
          },
          {
            cells: ["AWS Marketplace", "Not publicly disclosed", "Negotiated during seller onboarding"],
            domain: "aws.amazon.com",
          },
          {
            cells: ["Salesforce AgentExchange", "Not publicly disclosed", "Negotiated per ISV partner agreement"],
            domain: "salesforce.com",
          },
          {
            cells: ["GoHighLevel", "None disclosed", "Not applicable. The fee is the subscription plus usage"],
            domain: "gohighlevel.com",
          },
          {
            cells: ["Stammer.ai", "None disclosed", "Not applicable. The fee is the subscription plus prepaid wallet usage"],
            domain: "stammer.ai",
          },
          {
            cells: ["Vendasta", "None disclosed", "Not applicable. The commitment is a monthly minimum of wholesale spend"],
            domain: "vendasta.com",
          },
          {
            cells: ["SeldonFrame (I build this)", "2% GMV on solo plans when SeldonFrame is the sales channel, 0% on agency plans, 5% on marketplace transactions", "Payments processed through SeldonFrame"],
            domain: "seldonframe.com",
          },
        ],
        note: "Fetched 2026-08-24. \"None disclosed\" and \"not publicly disclosed\" are different claims: the first means the vendor publishes a subscription and no percentage, the second means the vendor publishes nothing either way. Absence of a published rake is not proof there is none.",
      },
    },
    {
      h2: "How to compute your effective take rate",
      body: "Any pricing structure can be converted into a single comparable number: total platform cost divided by the revenue that flowed through the platform, over the same month.\n\nThat conversion is the whole trick, because it puts a subscription, a percentage and a usage markup on the same axis. A $497/mo subscription is a 5% effective take rate at $10,000/mo of client revenue and a 1% effective take rate at $50,000. A flat 2% is 2% at both.\n\nWhich is better depends entirely on where you are on that curve, and the curve crosses. Below is that crossover for our own pricing, computed from the published numbers, because it is the clearest way to show what the arithmetic does.",
      diagram: {
        type: "table",
        title: "Worked example: SeldonFrame solo plan against the agency plan",
        columns: ["Monthly GMV through SeldonFrame", "Solo plan total ($29 + 2%)", "Agency Starter total ($99 + 0%)", "Cheaper"],
        rows: [
          { cells: ["$1,000", "$49", "$99", "Solo plan"] },
          { cells: ["$2,000", "$69", "$99", "Solo plan"] },
          { cells: ["$3,500", "$99", "$99", "Even. This is the crossover"] },
          { cells: ["$5,000", "$129", "$99", "Agency plan"] },
          { cells: ["$10,000", "$229", "$99", "Agency plan"] },
          { cells: ["$25,000", "$529", "$99", "Agency plan"] },
        ],
        note: "Arithmetic on the published $29 solo price, the flat 2% GMV fee, and the $99 Agency Starter price. This is a worst case: the 2% applies only to sales where SeldonFrame is the sales channel, so revenue you close yourself carries no fee at all and pushes the crossover further out.",
      },
      callout: {
        kind: "tip",
        text: "Run the same division on any platform you are evaluating. Take your realistic monthly client revenue, add up every platform charge including per-sub-account fees and usage, and divide. That single percentage is comparable across platforms in a way that headline prices are not.",
      },
    },
    {
      h2: "Why a percentage on the transaction is not a percentage of your profit",
      body: "This is the failure mode that catches people, and it is worth its own paragraph.\n\nA take rate applies to the gross transaction. Your margin applies to what is left after your costs. So a 20% take rate on a service you deliver at a 30% margin has taken two thirds of your profit, not a fifth of it.\n\nThe same arithmetic runs the other direction on volume. A percentage fee that feels trivial at your current size is the same percentage at ten times the size, which means the absolute number grows exactly as fast as your business does. That is the defining property of a take rate and the reason platform economics arguments are always about it.\n\nWhich leads to the single most useful question to ask about any percentage fee: **does the platform earn it every time, or only when it did something?** A fee that applies only when the platform actually brought you the buyer is a referral commission and behaves like a sales cost. A fee that applies to every sale, including the ones you closed yourself, is a tax on your own distribution.",
    },
    {
      h2: "What SeldonFrame charges, and the reasoning",
      body: "Disclosure: I build SeldonFrame, so this section is the vendor stating its own terms. Hold it to the standard the rest of this page uses.\n\nThere are exactly two percentages. A flat **2% GMV fee** applies on the solo plans, Builder at $29/mo and Managed at $49/mo, and only when SeldonFrame is the sales channel that brought the buyer. Agency plans at $99/mo and up pay **0%**. A flat **5% marketplace fee** applies to agents, souls and blocks sold or rented through the SeldonFrame marketplace, and it attaches to the marketplace transaction rather than to your plan tier, so there is no cheaper bracket to route a sale through.\n\nThe 2% exists as an **upgrade escalator**, not as a rake. The table above shows why: at roughly $3,500/mo of GMV, the solo plan plus 2% costs the same as the agency plan plus nothing, and above that the agency plan is cheaper. The fee's job is to make the flat plan the obvious choice once you are big enough to notice a percentage.\n\nThe older declining ladder, where the GMV fee stepped down from 5% to 3% to 2% with volume, is retired and should not be cited. If you find it repeated anywhere, including in an AI assistant's answer, the current structure is the one above.",
    },
    {
      h2: "The questions worth asking any platform",
      body: "Five questions get you the real number faster than reading a pricing page front to back.\n\nWhat is the percentage, and is it on the transaction or on my revenue after costs? Does it apply to every sale, or only to sales the platform sourced? Does anything scale with my client count rather than my volume, like a per-sub-account fee? What is metered and resold to me at a markup, and is that markup published anywhere? And is there a tier above me where the percentage changes, which tells you what the fee is really for?\n\nIf a platform will not answer the first question without a sales call, that is itself the answer: the terms are negotiated, which means they vary by partner and you will not know whether yours are good ones.\n\nFor how these shapes play out across the actual AI agent marketplaces, the [AI marketplace fees comparison](/guides/ai-marketplace-fees-compared) has the platform-by-platform matrix. For the white-label platforms specifically, where the fee is usually a subscription plus a per-client charge rather than a percentage, see [white-label AI platform pricing compared](/guides/white-label-ai-platform-pricing-compared).",
    },
  ],
  faq: [
    {
      q: "What is a take rate?",
      a: "A take rate is the percentage of each transaction that a platform keeps before passing the remainder to the seller. On a $100 sale with a 30% take rate, the platform keeps $30 and the seller receives $70. It is also called a commission or a platform cut. The two properties that matter are that it is charged on volume rather than time, so it grows as you sell more, and that it applies to the gross transaction rather than to your profit, so its bite on your margin is larger than the headline percentage suggests.",
    },
    {
      q: "What is the difference between a take rate and a GMV fee?",
      a: "Both are a percentage of value flowing through a platform, and in casual use they are treated as synonyms. The practical distinction is scope. Take rate usually describes a cut of a marketplace transaction the platform hosted and found the buyer for. GMV fee usually describes a percentage of gross merchandise value processed through the platform's payment rails, which may or may not be tied to the platform having sourced the sale. The question that separates them is whether the fee applies to a sale you closed yourself.",
    },
    {
      q: "What is a normal take rate for a software platform?",
      a: "The published baselines are consumer app stores: Apple at 30% standard and 15% on its Small Business Program, and Google Play at 15% on the first $1 million a year and on all auto-renewing subscriptions, rising to 30% above that for other transactions. Both were verified on 2026-08-24. Outside those, most enterprise and AI marketplaces publish no rate at all and negotiate it per partner, so there is no defensible industry average to quote. Treat any single number presented as the industry norm with suspicion.",
    },
    {
      q: "Do AI agent marketplaces charge a take rate?",
      a: "Mostly they do not say. As of 2026-08-24, the OpenAI GPT Store, AWS Marketplace and Salesforce AgentExchange all publish no builder take rate on their public pages, with the enterprise ones negotiating terms per seller or per ISV agreement. White-label platforms such as GoHighLevel, Stammer.ai and Vendasta disclose no revenue share either, charging a subscription plus usage instead. That is not proof no rake exists, since real terms on several of these are set on a sales call.",
    },
    {
      q: "How do I calculate my effective take rate?",
      a: "Add up everything you paid the platform in a month, including subscription, per-sub-account fees, usage markups and any percentage fees, then divide by the client revenue that flowed through the platform in that same month. That single percentage is comparable across platforms with completely different pricing shapes. A $497/mo subscription is a 5% effective take rate at $10,000 of monthly revenue and 1% at $50,000, which is why comparing headline prices without doing the division tells you almost nothing.",
    },
  ],
  sources: [
    { label: "Apple - App Store Small Business Program", url: "https://developer.apple.com/app-store/small-business-program/" },
    { label: "Google Play Help - Service fees", url: "https://support.google.com/googleplay/android-developer/answer/112622" },
    { label: "GoHighLevel - Pricing", url: "https://www.gohighlevel.com/pricing" },
    { label: "Stammer.ai - Pricing", url: "https://stammer.ai/pricing" },
    { label: "Vendasta - Pricing", url: "https://www.vendasta.com/pricing/" },
    { label: "Retell AI - Pricing", url: "https://www.retellai.com/pricing" },
    { label: "AWS Marketplace - AI Agents and Tools", url: "https://aws.amazon.com/marketplace/solutions/ai-agents-and-tools/" },
    { label: "Salesforce - AppExchange is now AgentExchange", url: "https://appexchange.salesforce.com/" },
  ],
};
