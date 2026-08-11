import type { Guide } from "./types";

export const guide: Guide = {
  slug: "ai-front-office-examples",
  title: "AI Front Office Examples: 7 Workflows for Service Businesses",
  description:
    "See what an AI front office does in practice: seven service-business workflows with a trigger, action, system of record, handoff, and outcome.",
  targetKeyword: "ai front office examples",
  intent: "informational",
  cluster: "ai-agents",
  relatedTool: "/tools/agency-margin-calculator",
  relatedBest: "/agencies",
  dek:
    "An AI front office is useful when it moves a real customer request to a recorded next step. These seven examples show the complete loop: what starts the workflow, what the agent does, where the truth is stored, when a person takes over, and what the business can verify afterward.",
  sections: [
    {
      h2: "The pattern behind every useful example",
      body:
        "A front-office workflow is more than a clever reply. It has a **trigger**, a bounded **action**, a shared **system of record**, a deliberate **human handoff**, and an observable **outcome**. If a demo cannot show the record or the handoff, it is demonstrating an assistant component rather than an operating workflow. For a definition of the connected surfaces, read [what is an AI front office](/guides/what-is-an-ai-front-office).",
      callout: {
        kind: "tip",
        text: "Write the fallback sentence before you write the prompt. The safest automation knows exactly when to stop and who receives the context.",
      },
    },
    {
      h2: "Missed-call recovery",
      body:
        "**Trigger:** A customer calls while the service business is busy and the call is not answered.\n\n**Action:** The workflow records the missed call, sends a short consent-aware text asking what help is needed, and offers the approved booking or callback path. It never invents availability or emergency advice.\n\n**System of record:** The CRM contact and conversation timeline hold the caller ID, message, requested service, and status so the owner can see the complete attempt.\n\n**Human handoff:** Route an urgent request, an upset caller, or an unclear service need to the on-call person with the transcript and callback context.\n\n**Outcome:** A missed call becomes an owned follow-up with a visible next action instead of a voicemail that nobody reviews. See [missed-call text-back](/guides/missed-call-text-back) for the implementation pattern.",
    },
    {
      h2: "After-hours answering and booking",
      body:
        "**Trigger:** A customer calls outside the business hours configured in the workspace.\n\n**Action:** The voice agent answers with the after-hours policy, captures the service and location, checks permitted calendar slots, and reads the proposed appointment back before writing it.\n\n**System of record:** The contact, call transcript, intake fields, and calendar event are linked in the CRM so a morning operator can verify what happened.\n\n**Human handoff:** Escalate emergencies, requests outside the service area, and anything requiring a quote or policy exception to a human queue rather than promising an answer.\n\n**Outcome:** The business wakes up to a qualified request or a correctly booked appointment, not an unstructured list of overnight calls. Compare the boundary with [how to handle after-hours calls](/guides/how-to-handle-after-hours-calls).",
    },
    {
      h2: "Speed-to-lead qualification",
      body:
        "**Trigger:** A visitor submits a website form or starts a web chat asking for service.\n\n**Action:** The agent acknowledges the inquiry, asks only the qualification questions the business approved, and offers the next step: booking, a callback task, or a request for missing details.\n\n**System of record:** The CRM lead record stores source, consent, service category, location, and qualification answers; the conversation is attached rather than left in a widget-only inbox.\n\n**Human handoff:** Send a complete summary to the salesperson when the lead needs a custom quote, has unclear eligibility, or asks for a commitment the agent cannot make.\n\n**Outcome:** The team can see which inquiries are ready for a calendar slot and which need a person, with no duplicated data entry. Start with [what is speed to lead](/guides/what-is-speed-to-lead) and the [speed-to-lead calculator](/tools/speed-to-lead-calculator).",
    },
    {
      h2: "Quote or estimate intake",
      body:
        "**Trigger:** A prospect asks for an estimate through the website, phone, or SMS.\n\n**Action:** The workflow collects the measurements, address, photos, service type, and timing that the business has declared necessary. It can explain the estimate process, but does not manufacture a price from incomplete information.\n\n**System of record:** The CRM opportunity holds the structured intake, attachments, source conversation, and estimate status so the eventual quote can be traced to the request.\n\n**Human handoff:** Create an assigned task for an estimator when the request needs an inspection, an exception, or a price approval. Include missing fields so the person does not restart discovery.\n\n**Outcome:** The business receives a quote-ready brief and a clear owner for the next step. Keep [how to price an AI receptionist service](/guides/how-to-price-an-ai-receptionist-service) focused on the service offer rather than letting the agent guess customer pricing.",
    },
    {
      h2: "Appointment confirmation and no-show reduction",
      body:
        "**Trigger:** A booking is created or an appointment is approaching according to the business's reminder policy.\n\n**Action:** The agent sends the approved reminder, confirms the address and appointment details, and records a yes, reschedule request, or no response. It keeps the calendar as the source of truth rather than creating a second appointment in a messaging tool.\n\n**System of record:** The calendar event and linked CRM activity hold the confirmation state, customer reply, and any reschedule outcome.\n\n**Human handoff:** Route cancellations, accessibility needs, or repeated no-response cases to the person responsible for the schedule.\n\n**Outcome:** The operator has a current attendance signal and a recoverable reschedule task. Use [how to reduce no-shows](/guides/how-to-reduce-no-shows) for reminder sequencing ideas.",
    },
    {
      h2: "Review requests and response handling",
      body:
        "**Trigger:** The business marks a job complete or a customer provides post-service feedback.\n\n**Action:** The workflow sends one respectful review request through the approved channel and categorizes replies for acknowledgement. It should not gate positive reviews, fabricate testimonials, or repeatedly message a customer who opted out.\n\n**System of record:** The completed job, request timestamp, opt-out state, and response live on the CRM record; the public review remains on the review provider.\n\n**Human handoff:** Escalate a complaint, safety concern, or private support request to the owner with the original context before asking for another review.\n\n**Outcome:** Review outreach is tied to completed work and every response has an owner. See [how to build a review-request agent](/guides/how-to-build-a-review-request-agent) and [how to get more Google reviews](/guides/how-to-get-more-google-reviews).",
    },
    {
      h2: "Dormant-customer reactivation",
      body:
        "**Trigger:** A consented customer has not returned within the business's defined follow-up window.\n\n**Action:** The workflow selects an eligible segment, sends a relevant check-in, and offers a normal booking path without pretending to know the customer's current need. Suppression lists and opt-outs are checked first.\n\n**System of record:** The CRM stores the segment decision, message, consent state, reply, and resulting booking or no-response status.\n\n**Human handoff:** Send replies involving a complaint, a changed service requirement, or a negotiated offer to the account owner rather than letting the agent improvise.\n\n**Outcome:** The business can measure which past customers were contacted and what next step followed, while preserving a clear permission trail. Link the workflow to [productized AI services](/guides/productized-ai-services) when packaging reactivation as an agency deliverable.",
    },
    {
      h2: "How an agency turns examples into a client offer",
      body:
        "Choose one workflow with an obvious business owner, document its guardrails, and launch it in a low-risk mode such as after-hours or overflow. Then connect the next workflow only when the first one has a reliable record and handoff. An agency can reuse the intake, test calls, escalation language, and reporting template while changing the client's approved services and calendar rules.\n\nThe [AI front office software checklist](/guides/ai-front-office-software-for-agencies) helps evaluate whether a platform can repeat these workflows across isolated client workspaces. For implementation details, compare the [AI front office package checklist](/guides/what-to-include-in-an-ai-front-office-package) and calculate delivery margin with the [agency margin calculator](/tools/agency-margin-calculator).",
      diagram: {
        type: "flow",
        title: "From example to repeatable client offer",
        steps: [
          { label: "Pick one workflow", sub: "clear owner + outcome" },
          { label: "Write guardrails", sub: "approved actions + handoff" },
          { label: "Test and launch", sub: "overflow first" },
          { label: "Template the delivery", sub: "intake + reporting" },
          { label: "Expand carefully", sub: "one workflow at a time" },
        ],
      },
    },
    {
      h2: "Where SeldonFrame fits (disclosed)",
      body:
        "Disclosure: SeldonFrame is the vendor behind the product example in this section. SeldonFrame is an agent-native, open-source alternative to GoHighLevel for agencies selling AI front offices to service businesses. It gives an agency a workspace to configure the website, CRM, booking, intake, and agent together, then repeat the delivery for client workspaces.\n\nA platform is optional. You can assemble the same workflow from a phone provider, CRM, calendar, and messaging tools, or self-host the pieces yourself. Evaluate ownership, export, permissions, handoff quality, and operating cost before choosing. Read the [SeldonFrame docs](/docs), [pricing](/pricing), and the GitHub repository listed in the sources below alongside the independent criteria in the [agency software checklist](/guides/ai-front-office-software-for-agencies).",
    },
  ],
  faq: [
    {
      q: "What makes an AI front-office workflow complete?",
      a: "It connects a trigger to a bounded action, a system of record, a human handoff, and an observable outcome. A generated reply without the record or escalation path is only one component of the workflow.",
    },
    {
      q: "Which workflow should an agency launch first?",
      a: "Start with the workflow that has a clear owner and low operational risk, often missed-call recovery or after-hours answering. Test it with the client's real hours, services, calendar, and escalation rules before adding more automation.",
    },
    {
      q: "Can these examples be sold as separate services?",
      a: "Yes. An agency can package one workflow as an entry offer and expand after the client sees a reliable record and handoff. Price the ongoing operating work separately from software and usage so the scope remains clear.",
    },
  ],
  sources: [
    {
      label: "SeldonFrame documentation",
      url: "https://www.seldonframe.com/docs",
    },
    {
      label: "SeldonFrame GitHub repository",
      url: "https://github.com/seldonframe/seldonframe",
    },
  ],
};
