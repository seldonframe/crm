import { AGENCY_PRICING_CLAIM, BUILDER_PRICING_CLAIM } from "../../marketing/public-claims";
import type { Guide } from "./types";

export const guide: Guide = {
  slug: "what-is-an-ai-front-office",
  title: "What Is an AI Front Office? A Practical Definition for Service Businesses",
  description:
    "An AI front office connects a service business's website, intake, booking, agent, and review follow-up into one customer-facing workflow.",
  targetKeyword: "what is an ai front office",
  intent: "informational",
  cluster: "ai-agents",
  relatedTool: "/tools/agency-margin-calculator",
  relatedBest: "/agencies",
  dek:
    "An AI front office is the customer-facing operating layer that turns an inquiry into a handled conversation, a booked appointment, and a follow-up. It connects the website, CRM and intake, booking, agent, and reviews instead of leaving each step in a separate tool.",
  sections: [
    {
      h2: "The short definition",
      body:
        "An **AI front office** is a connected set of customer-facing workflows for a service business. It answers questions, captures the right details, schedules the next step, and keeps the business informed when a human needs to take over. The AI is one part of the system; the useful product is the handoff from first contact to a real outcome.\n\nA website chatbot on its own is not a front office. Neither is an isolated phone bot, an inbox, or a CRM full of unworked leads. A front office has a trigger, a system of record, an action, and a clear human handoff for each workflow. That definition is intentionally operational: it gives an owner or an agency a way to check whether a proposed package actually does the job.",
      callout: {
        kind: "analogy",
        text: "Think of it as the digital front desk: it welcomes the customer, finds out why they came in, books the next step, and tells the right person what happened.",
      },
    },
    {
      h2: "The five connected core surfaces (plus a follow-up extension)",
      body:
        "A useful front office usually spans five connected core surfaces: **Website** is where a visitor learns what the business does and starts a conversation. **Conversations** are the voice, chat, SMS, and web exchanges where a customer asks for help and an agent responds. **CRM and intake** capture the contact, service need, location, consent, and other facts that should not disappear in a transcript. **Booking** turns a qualified request into a calendar event with the right service, duration, and human owner. **Agent** applies the business's rules across those interactions and routes exceptions. **Reviews and follow-up** are the close-the-loop extension beyond those five core surfaces: reminders, status updates, and a respectful review request after the appointment.\n\nThe five core surfaces do not have to be supplied by one vendor, but they must agree on identity and state. A customer should not have to repeat their address because the website and booking tool cannot share intake data. An agency should not have to reconcile a phone transcript against a different spreadsheet before knowing whether a lead became a job.",
      diagram: {
        type: "flow",
        title: "From first question to follow-up",
        steps: [
          { label: "Website", sub: "discover + start" },
          { label: "Conversations", sub: "voice, chat, SMS, web" },
          { label: "CRM / intake", sub: "capture context" },
          { label: "Booking", sub: "schedule next step" },
          { label: "Agent", sub: "answer + route" },
          { label: "Reviews / follow-up", sub: "close the loop" },
        ],
      },
    },
    {
      h2: "How the workflow works in practice",
      body:
        "Start with a real customer question: “Do you service my area, and can someone come Tuesday?” The website or agent answers from approved business knowledge. Intake records the name, contact method, location, service, and any qualification questions. The booking step checks availability and writes the appointment to the calendar the business actually uses. The agent confirms what happened and escalates exceptions rather than improvising. After the job, the follow-up workflow can send a reminder or review request when the business marks the work complete.\n\nAt every boundary, define what happens when information is missing or the customer asks for something outside policy. A reliable system says “a person will confirm that” and creates a task; it does not invent a price, promise an emergency response, or silently mark a lead complete. [Speed-to-lead](/guides/what-is-speed-to-lead), [online booking](/guides/online-booking-best-practices), and [review requests](/guides/how-to-build-a-review-request-agent) are useful implementation patterns for these individual steps.",
      diagram: {
        type: "loop",
        title: "The front-office control loop",
        steps: ["Customer asks", "System captures", "Agent acts", "Human reviews exceptions", "Business follows up"],
      },
    },
    {
      h2: "What it is not",
      body:
        "An AI front office is not a promise that every interaction can be automated. It is also not a replacement for the service business's expertise, calendar, or judgment. The business still owns its offers, hours, pricing policy, safety rules, and customer relationships. The agent should make those rules easier to apply, not create new ones.\n\nIt is different from a general CRM because the front office is organized around customer-facing moments and completed outcomes. It is different from a marketing automation bundle because the core loop is handling demand already arriving: answer, qualify, book, hand off, and follow up. Advertising, complex sales funnels, and back-office accounting may connect to the front office, but they are separate scopes and should be priced and governed separately.",
      callout: {
        kind: "warning",
        text: "If a demo shows only a chat response and no record, calendar event, or escalation path, you are looking at an assistant component—not a complete front office.",
      },
    },
    {
      h2: "Ownership, keys, and human handoff",
      body:
        "Before choosing software, decide who owns the customer data, model keys, phone numbers, calendar, and content that trains the workflow. A bring-your-own-key (BYOK) model can keep model billing and credentials with the operator, while a managed model can trade some control for a simpler setup. Either way, use least-privilege credentials, document where records live, and make export and offboarding possible.\n\nHuman handoff is a feature, not a failure. Specify which requests require an owner—emergencies, complaints, uncertain eligibility, unusual discounts, and anything that could create a legal or safety obligation. The handoff should carry the transcript, captured fields, requested outcome, and next action so the person receiving it can help without starting over. See [BYOK in AI](/guides/what-is-byok-ai) for the cost and control trade-offs.",
    },
    {
      h2: "A clear Builder versus Agency boundary",
      body:
        `The commercial model should match who the workspace serves. ${BUILDER_PRICING_CLAIM} An agency selling front offices to multiple businesses needs client workspaces, a repeatable handoff, and a brandable delivery layer; ${AGENCY_PRICING_CLAIM}\n\nThat distinction is about scope, not a judgment about which customer is more important. A plumber building a front office for the plumbing company they own can start with Builder. An agency building and operating separate workspaces for plumbers needs an Agency tier. Do not describe the Builder price as including client sub-accounts, white-label resale, or an agency portal.`,
      diagram: {
        type: "compare",
        title: "Choose the workspace model that matches the buyer",
        left: {
          heading: "Builder",
          items: ["One business you operate", "$29/mo", "BYOK", "No client sub-accounts or resale"],
        },
        right: {
          heading: "Agency",
          items: ["Client workspaces", "Starts at $99/mo", "White-label delivery", "Repeatable handoff and operations"],
        },
      },
    },
    {
      h2: "Where SeldonFrame fits (disclosed)",
      body:
        "Disclosure: SeldonFrame is the vendor described in this section, so treat the example as a product explanation and a sales pitch. SeldonFrame is an agent-native, open-source alternative to GoHighLevel for agencies selling AI front offices to service businesses. It combines the five surfaces in a workspace and is designed for an agency to repeat the setup across clients.\n\nThe product is not the only way to assemble a front office. An agency can connect a phone provider, CRM, calendar, website, and review tool itself, or choose another platform. Evaluate the actual handoff, data ownership, model and telephony billing, export path, and client experience—not just whether a vendor uses the phrase “AI front office.” The [AI front office package checklist](/guides/what-to-include-in-an-ai-front-office-package), [AI front office examples](/guides/ai-front-office-examples), and [AI front office software checklist](/guides/ai-front-office-software-for-agencies) are useful companions for implementation and evaluation.",
    },
  ],
  faq: [
    {
      q: "Does an AI front office replace a receptionist?",
      a: "It can handle defined first-line tasks such as answering common questions, collecting intake details, booking within approved rules, and routing exceptions. It should not be presented as a universal replacement for judgment or human care. The business decides which conversations always go to a person.",
    },
    {
      q: "What is the difference between an AI front office and an AI receptionist?",
      a: "An AI receptionist is usually one conversational surface, often voice or chat. An AI front office includes that agent plus the website, CRM or intake record, booking workflow, and review or follow-up loop that turn a conversation into an owned business outcome.",
    },
    {
      q: "Can an agency sell an AI front office to several clients?",
      a: "Yes, if the platform and plan support separate client workspaces, a repeatable setup, clear ownership, and a client-facing handoff. Builder is for a business the operator owns; SeldonFrame Agency plans start at $99/mo for client workspaces and white-label delivery.",
    },
    {
      q: "How should I evaluate an AI front-office platform?",
      a: "Run one complete test: start with a website or phone inquiry, inspect the intake record, make a booking, trigger an exception handoff, and complete the follow-up. Then check permissions, export, key ownership, costs, auditability, and what the client sees. A polished demo that skips those transitions is incomplete evidence.",
    },
  ],
  sources: [
    {
      label: "SeldonFrame documentation",
      url: "https://www.seldonframe.com/docs",
    },
    {
      label: "Model Context Protocol introduction",
      url: "https://modelcontextprotocol.io/introduction",
    },
    {
      label: "GoHighLevel pricing",
      url: "https://www.gohighlevel.com/pricing",
    },
  ],
};
