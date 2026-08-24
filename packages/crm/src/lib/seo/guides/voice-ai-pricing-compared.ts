import type { Guide } from "./types";

export const guide: Guide = {
  slug: "voice-ai-pricing-compared",
  title: "Voice AI Pricing Compared: The Real Per-Minute Table (2026)",
  description:
    "Vapi, Retell AI, Bland AI, ElevenLabs Agents, Synthflow and the Twilio floor underneath them, in one table. Every rate fetched from the vendor's own pricing page on 2026-08-24.",
  targetKeyword: "voice ai pricing comparison",
  intent: "commercial",
  cluster: "sell-agents",
  relatedTool: "/tools/voice-ai-cost-calculator",
  relatedBest: "/agencies",
  dek: "Every voice AI vendor publishes a per-minute number and every one of those numbers covers a different slice of the stack, so putting them side by side without saying what is inside each one produces a comparison that is worse than no comparison. This is the table with that column filled in. Every figure below came off the vendor's own live pricing page on 2026-08-24, and where a vendor publishes nothing I say so instead of guessing.",
  sections: [
    {
      h2: "The short answer: there is no single per-minute price",
      body: "If you want one number, the honest range for a US voice agent in 2026 is roughly **$0.05 to $0.31 per minute** before telephony, and the spread is not about quality. It is about how much of the stack the vendor folded into the headline.\n\nA voice agent is four costs stacked on top of each other: speech-to-text, a language model, text-to-speech, and the phone call itself. Vendors slice that stack differently and then all quote \"per minute\", which is how you end up comparing $0.05 against $0.14 and drawing the wrong conclusion.\n\nVapi's $0.05/min is its platform layer and nothing else. Bland's $0.11 to $0.14/min includes the model, the transcription and the voice. Those two numbers are not measuring the same thing, and only one of them will be close to your bill.\n\nSo the useful comparison is not the rate. It is the rate plus what is inside it, which is the table below.",
      callout: {
        kind: "warning",
        text: "Any voice AI comparison that shows one per-minute number per vendor and no column explaining what is inside it is not a price comparison. It is a ranking of how much each vendor chose to leave out of its headline.",
      },
    },
    {
      h2: "The rate table",
      body: "Every figure here was fetched on 2026-08-24 from the vendor's own live pricing page. Read the third and fourth columns before you compare the second one.",
      diagram: {
        type: "table",
        title: "Published per-minute rates and what each one actually covers",
        columns: ["Platform", "Published rate", "What the rate covers", "What bills on top"],
        rows: [
          {
            cells: [
              "Vapi (Build)",
              "$0.05 / min",
              "Vapi's own platform layer, and nothing else",
              "STT, LLM and TTS at cost ($0 if you bring your own key), plus telephony. 10 concurrent lines included, then $10/line/mo",
            ],
            domain: "vapi.ai",
          },
          {
            cells: [
              "Retell AI (pay-as-you-go)",
              "$0.07 to $0.31 / min headline",
              "Voice infra at $0.055/min plus whichever TTS ($0.015 to $0.040/min) and LLM ($0.003 to $0.16/min) you pick",
              "Telephony at $0.015/min, plus a long list of per-minute and per-call add-ons",
            ],
            domain: "retellai.com",
          },
          {
            cells: [
              "Bland AI (Start / Build / Scale)",
              "$0.14 / $0.12 / $0.11 per min",
              "LLM, STT and TTS are all inside the rate. Bland is the only vendor here that bundles the model stack",
              "Telephony at pass-through, transfer minutes at $0.03 to $0.05/min, and the $299/mo or $499/mo platform fee on Build and Scale",
            ],
            domain: "bland.ai",
          },
          {
            cells: [
              "ElevenLabs Agents",
              "$0.080 / min on every plan",
              "The agent platform and the ElevenLabs voice",
              "The LLM and any telephony, which the page says are \"billed separately on top, based on usage\". Going over your concurrency limit doubles the rate to $0.160/min",
            ],
            domain: "elevenlabs.io",
          },
          {
            cells: [
              "Synthflow",
              "No per-minute rate published",
              "Not stated anywhere on the live page",
              "Not stated. The only figure the vendor publishes is \"Enterprise contracts start at $30,000 annually\"",
            ],
            domain: "synthflow.ai",
          },
          {
            cells: [
              "Twilio (the carrier layer under all of them)",
              "$0.0085 / min inbound local, $0.0140 / min outbound local",
              "US PSTN carriage on Programmable Voice",
              "$1.15/mo per local number, $2.15/mo toll-free, $0.0025/min for call recording",
            ],
            domain: "twilio.com",
          },
        ],
        note: "Fetched 2026-08-24 from each vendor's own pricing page. docs.vapi.ai/pricing returns a 404, so nothing here is taken from it. Only Bland bundles the model stack into its headline rate, which is why its number looks high next to Vapi's and is not.",
      },
    },
    {
      h2: "The monthly floor, which the per-minute rate hides",
      body: "Two vendors here charge a platform fee before you have made a single call, and one of them charges more per minute on the plan with no fee. That inverts the usual intuition that the cheaper monthly plan is the cheaper plan.\n\nElevenLabs is the clearest case of a bundled model: you buy minutes in a block, and the block price divided by the minutes is the same on every paid tier.\n\nI did not have to take that $0.080/min label on faith. Every paid ElevenLabs tier divides to exactly $0.0800: $6 over 75 minutes, $22 over 275, $99 over 1,238, $299 over 3,738, and $990 over 12,375. That internal consistency is decent evidence the published rate is a real rate rather than a marketing round number.",
      diagram: {
        type: "table",
        title: "Monthly platform fees, included minutes and concurrency",
        columns: ["Plan", "Monthly platform fee", "Included minutes", "Concurrency"],
        rows: [
          { cells: ["Vapi Build", "None published", "None published", "10 lines, then $10/line/mo"], domain: "vapi.ai" },
          { cells: ["Vapi Scale", "Annual contract, dollar figure not shown", "Not shown", "Custom"], domain: "vapi.ai" },
          { cells: ["Retell pay-as-you-go", "None published", "$10 in free credits", "20 free, then $8 per concurrency per month"], domain: "retellai.com" },
          { cells: ["Bland Start", "$0", "None, per-minute only", "100 calls/day"], domain: "bland.ai" },
          { cells: ["Bland Build", "$299", "None, per-minute only", "2,000 calls/day and 1,000 calls/hour"], domain: "bland.ai" },
          { cells: ["Bland Scale", "$499", "None, per-minute only", "5,000 calls/day and 1,000 calls/hour"], domain: "bland.ai" },
          { cells: ["ElevenLabs Free", "$0", "15 min", "4"], domain: "elevenlabs.io" },
          { cells: ["ElevenLabs Starter", "$6", "75 min", "6"], domain: "elevenlabs.io" },
          { cells: ["ElevenLabs Creator", "$22 ($11 first month)", "275 min", "10"], domain: "elevenlabs.io" },
          { cells: ["ElevenLabs Pro", "$99", "1,238 min", "20"], domain: "elevenlabs.io" },
          { cells: ["ElevenLabs Scale", "$299", "3,738 min", "30"], domain: "elevenlabs.io" },
          { cells: ["ElevenLabs Business", "$990", "12,375 min", "40"], domain: "elevenlabs.io" },
          { cells: ["Synthflow Enterprise", "$30,000 per year floor", "Not published", "Not published"], domain: "synthflow.ai" },
        ],
        note: "Fetched 2026-08-24. One thing I could not resolve: ElevenLabs states the $0.160/min burst rate applies when you exceed your CONCURRENCY limit, and does not state unambiguously how minutes beyond your included allotment are billed. So there is no beyond-allotment overage rate in this table, because the page does not support one.",
      },
    },
    {
      h2: "Where the bill actually grows: the add-on stack",
      body: "Retell publishes the most granular add-on list of any vendor here, which is to its credit and also the clearest illustration of the pattern. Each item below is small. Turn on four of them and the effective rate moves more than the difference between two vendors' headline rates.\n\nThis is the part a per-minute comparison never captures, because none of it is the per-minute rate. It is the per-minute rate plus denoising plus guardrails plus a knowledge base plus a phone number plus concurrency you outgrew.",
      diagram: {
        type: "table",
        title: "Retell AI published add-ons",
        columns: ["Add-on", "Price", "Billed per"],
        rows: [
          { cells: ["Knowledge base", "+$0.005", "minute"] },
          { cells: ["Advanced denoising", "+$0.005", "minute"] },
          { cells: ["Safety guardrails", "+$0.005", "minute"] },
          { cells: ["PII removal", "+$0.01", "minute"] },
          { cells: ["AI quality assurance", "$0.10", "minute"] },
          { cells: ["Batch call", "+$0.005", "dial"] },
          { cells: ["Branded call", "+$0.10", "outbound call"] },
          { cells: ["Retell phone number", "$2.00", "month"] },
          { cells: ["Verified phone number", "$10.00", "month"] },
          { cells: ["Retell SMS", "$20.00", "month"] },
          { cells: ["Additional concurrency", "$8.00", "concurrent line per month, first 20 free"] },
          { cells: ["Additional knowledge bases", "$8.00", "knowledge base per month, first 10 free"] },
        ],
        note: "Fetched from retellai.com/pricing on 2026-08-24. Vapi's equivalents are HIPAA compliance at $2,000/mo and Zero Data Retention at $1,000/mo, both available on either tier.",
      },
    },
    {
      h2: "Telephony is the floor under every row above",
      body: "Every platform in this comparison sits on a carrier. Most of them sit on Twilio. That means there is a hard floor to what a minute of US phone call can cost, and it is worth knowing where that floor is before you accept a platform's telephony line as a fact of nature.\n\nRetell's published telephony rate of $0.015/min is roughly double Twilio's own programmable-voice outbound local rate, and close to four times its SIP interface rate. That is not an accusation of anything. It is the normal cost of someone else managing the carrier relationship for you. But it is the number you get to skip if you bring your own Twilio account.",
      diagram: {
        type: "table",
        title: "Twilio US voice rates, the floor under the whole category",
        columns: ["Twilio service", "US rate"],
        rows: [
          { cells: ["Programmable Voice, inbound local", "$0.0085 / min"] },
          { cells: ["Programmable Voice, outbound local", "$0.0140 / min"] },
          { cells: ["Programmable Voice, toll-free inbound", "$0.0220 / min"] },
          { cells: ["Programmable Voice, SIP interface, both directions", "$0.0040 / min"] },
          { cells: ["Programmable Voice, BYOC trunking, both directions", "$0.0040 / min"] },
          { cells: ["Elastic SIP Trunking, termination (outbound)", "Starting at $0.0011 / min"] },
          { cells: ["Elastic SIP Trunking, origination local (inbound)", "$0.0034 / min"] },
          { cells: ["Elastic SIP Trunking, origination toll-free", "$0.0130 / min"] },
          { cells: ["Local phone number", "$1.15 / mo"] },
          { cells: ["Toll-free number", "$2.15 / mo"] },
          { cells: ["Call recording", "$0.0025 / min"] },
          { cells: ["Emergency calling, Elastic SIP Trunking", "$0.75 / mo per number"] },
        ],
        note: "Fetched from twilio.com/en-us/voice/pricing/us and twilio.com/en-us/sip-trunking/pricing/us on 2026-08-24. Non-contiguous US zones cost far more: Alaska is $0.0862/min against $0.0100/min for the 48 states.",
      },
    },
    {
      h2: "Synthflow is the one I cannot price for you",
      body: "Synthflow publishes exactly one number. The live pricing page says **\"Enterprise contracts start at $30,000 annually\"** and routes everything else to a sales call, stating that final pricing is scoped around call volume, concurrency, telephony setup, integrations, security needs and launch support.\n\nThere is no published per-minute rate, no included-minutes figure, no overage rate and no add-on price list. So the honest line in any comparison is that the vendor does not publish agency-tier or per-minute pricing, not a number I found somewhere and repeated.\n\nThird parties do publish numbers. They are below, labelled, with who said them and when. Note that the two sources disagree with each other about whether self-serve tiers still exist at all, which is a reason to treat both as reports rather than prices.",
      diagram: {
        type: "table",
        title: "Synthflow figures reported by third parties, not by the vendor",
        columns: ["Reported figure", "Reported by", "Reported when"],
        rows: [
          {
            cells: [
              "Voice engine around $0.09/min, LLM $0.02 to $0.04/min, telephony $0 to $0.02/min, landing near $0.13/min for a typical configuration",
              "CloudTalk, a blog published by a company selling into the same category",
              "August 2026",
            ],
          },
          {
            cells: ["Performance Routing and Low Latency Edge at roughly +$0.04/min each", "CloudTalk", "August 2026"],
          },
          {
            cells: ["Volume rates reportedly dropping to around $0.07/min at 400,000+ minutes a month", "CloudTalk", "August 2026"],
          },
          {
            cells: ["Overage minutes \"typically cost $0.15 to $0.25 per minute beyond your included allocation\"", "PxlPeak, also a competitor-published blog", "Updated April 2026"],
          },
          {
            cells: [
              "Legacy self-serve tiers at Starter $29/mo (50 min), Pro $99/mo (200 min), Growth $449/mo (1,000 min), Agency $899/mo (2,000 min)",
              "PxlPeak, and probably stale, since the live vendor page is enterprise-only",
              "Updated April 2026",
            ],
          },
        ],
        note: "None of these came from Synthflow. Both sources are published by companies that sell into this category, other third-party write-ups report a different set of legacy tiers again, and CloudTalk says the legacy tiers were retired while PxlPeak still lists them. Treat the whole table as reported, not confirmed. If a number matters to your model, get it from Synthflow in writing.",
      },
    },
    {
      h2: "How to build your own number instead of trusting a headline",
      body: "The method that survives vendors changing their pages: price the stack, not the platform.\n\nStart with your own minute count, honestly estimated, and then add four lines. One, the platform layer, which is the headline rate. Two, the model stack, which is either included (Bland) or extra (everyone else). Three, telephony, which is almost never included. Four, the add-ons you will actually switch on, because a knowledge base and guardrails are not optional in production.\n\nThen do it again at **three times and five times** your current volume. Per-minute pricing looks its best on the deal you are about to close and its worst on the client who grows, which is the client you most want to keep.\n\nIf you want the arithmetic done for you against a specific vendor's published rates, the [voice AI cost calculator](/tools/voice-ai-cost-calculator) runs the same four lines. For what happens when you resell those minutes to a client instead of using them yourself, the [voice AI reseller programs guide](/guides/voice-ai-reseller-programs) covers the margin side.",
    },
    {
      h2: "Where SeldonFrame sits, disclosed",
      body: "I build SeldonFrame, so treat this section as the vendor's own pitch and weigh it accordingly.\n\nSeldonFrame does not have a per-minute rate, because it does not resell minutes. Voice agents run on your own Twilio account and your own model keys, so the per-minute cost is whatever Twilio and your model provider charge, at the rates in the tables above, with nothing added in between.\n\nWhat you pay SeldonFrame is the plan: Builder at $29/mo for a business you operate yourself, or an agency plan from $99/mo for 10 client workspaces with white-label delivery included. Agency plans carry 0% GMV. The solo plans carry a flat 2% GMV fee, and only when SeldonFrame is the sales channel that brought the buyer.\n\nThe honest trade is that this shape costs more attention. You hold two vendor accounts instead of one, and nobody is managing the carrier relationship for you. What you get for that is a bill you can predict from the tables above and a stack you can leave with.",
      callout: {
        kind: "analogy",
        text: "Bringing your own keys is like filling the tank yourself instead of renting the car with fuel included. Same trip, same fuel, but only one of those has someone else's margin priced into every mile.",
      },
    },
  ],
  faq: [
    {
      q: "What does voice AI cost per minute in 2026?",
      a: "Between about $0.05 and $0.31 per minute before telephony, depending on the vendor and on how much of the stack their headline includes. Fetched 2026-08-24 from each vendor's own pricing page: Vapi charges $0.05/min for its platform layer with the model stack passed through at cost on top; Retell AI publishes a $0.07 to $0.31/min range built from $0.055/min voice infra plus TTS and LLM; Bland AI charges $0.14, $0.12 or $0.11 per minute by tier with LLM, STT and TTS included; ElevenLabs Agents charges $0.080/min with the LLM and telephony billed separately. Telephony sits underneath all of them, starting around $0.0085/min inbound local on Twilio.",
    },
    {
      q: "Which voice AI platform is actually cheapest?",
      a: "It depends on your volume and on whether you already hold your own model keys, and the headline rate will not tell you. Vapi's $0.05/min is the lowest published platform fee but excludes the model stack and telephony entirely, so the real bill is higher than the number. Bland's $0.11/min on the Scale tier includes the model stack but carries a $499/mo platform fee, so it needs volume to beat a no-floor plan. ElevenLabs at $0.080/min prices minutes in blocks, which is cheapest if your usage matches a tier and wasteful if it does not. Price your own stack at your own volume rather than ranking the headlines.",
    },
    {
      q: "How much does Synthflow cost?",
      a: "Synthflow does not publish it. As of 2026-08-24 the only figure on its live pricing page is that enterprise contracts start at $30,000 annually, with everything else routed to a sales call. Third-party blogs report a configured rate near $0.13/min and overage between $0.15 and $0.25/min, but those come from companies selling into the same category, they disagree with each other about whether self-serve tiers still exist, and none of it is vendor-confirmed. Anyone quoting you a firm Synthflow per-minute price is repeating a report, not a published rate.",
    },
    {
      q: "Is telephony included in voice AI pricing?",
      a: "Almost never. Vapi, Retell AI, Bland AI and ElevenLabs Agents all bill telephony separately from the per-minute rate, and only Bland bundles the model stack. Retell publishes its telephony line at $0.015/min for US Twilio. For reference, Twilio's own US rates as of 2026-08-24 are $0.0085/min inbound local, $0.0140/min outbound local, $0.0040/min on a SIP interface, and Elastic SIP Trunking termination starting at $0.0011/min, plus $1.15/mo for a local number. If you bring your own carrier account you pay those rates directly.",
    },
    {
      q: "Do I save money by bringing my own API keys?",
      a: "On the model stack, yes, and Vapi says so outright: its pricing page bills STT, LLM and TTS \"at cost ($0 if you bring your own API key)\". Everywhere else the saving is whatever margin the platform was taking on resold units, which varies and is usually not published. The larger effect of holding your own keys is not the monthly saving, it is that your cost stops being a number someone else can change without asking you.",
    },
  ],
  sources: [
    { label: "Vapi - Pricing", url: "https://vapi.ai/pricing" },
    { label: "Retell AI - Pricing", url: "https://www.retellai.com/pricing" },
    { label: "Bland AI - Pricing", url: "https://www.bland.ai/pricing" },
    { label: "ElevenLabs - Agents pricing", url: "https://elevenlabs.io/pricing/agents" },
    { label: "Synthflow - Pricing", url: "https://synthflow.ai/pricing" },
    { label: "Twilio - Voice pricing (US)", url: "https://www.twilio.com/en-us/voice/pricing/us" },
    { label: "Twilio - Elastic SIP Trunking pricing (US)", url: "https://www.twilio.com/en-us/sip-trunking/pricing/us" },
    { label: "CloudTalk - Synthflow pricing (third-party report)", url: "https://www.cloudtalk.io/synthflow-pricing/" },
    { label: "PxlPeak - Synthflow pricing guide (third-party report)", url: "https://pxlpeak.com/blog/ai-tools/synthflow-pricing-guide" },
  ],
};
