import type { Guide } from "./types";

export const guide: Guide = {
  slug: "gohighlevel-sms-not-delivering",
  title: "GoHighLevel SMS Not Delivering: A2P and Carrier Checklist",
  description:
    "Diagnose missing GoHighLevel texts across workflow execution, number health, A2P registration, consent, provider handoff, and carrier filtering.",
  targetKeyword: "gohighlevel sms not delivering",
  intent: "informational",
  cluster: "gohighlevel",
  relatedTool: "/tools/gohighlevel-cost-calculator",
  relatedBest: "/alternative-to-gohighlevel",
  dek: "When GoHighLevel SMS is not delivering, trace one message across five boundaries: did the contact enter the workflow, did the send action execute, did the phone provider accept it, did A2P registration and number status permit it, and did the destination carrier deliver or filter it? Do not resend until you know where it stopped.",
  sections: [
    {
      h2: "Why an SMS can disappear",
      body: "A text message crosses more policy and infrastructure boundaries than the workflow canvas shows. The contact must meet trigger conditions, the account must be allowed and funded to send, the number must be correctly configured, the business and campaign may need A2P 10DLC registration, the content must comply with consent and messaging rules, the upstream provider must accept it, and the destination carrier can still filter or reject it.\n\nHighLevel's phone pricing documentation describes registration and usage charges around LC Phone. Those mechanics matter because an unfunded wallet, unregistered campaign, or restricted destination can look like an automation failure from the client's perspective. Reddit onboarding threads frequently warn that A2P is an unexpectedly large part of setup. Those posts are anecdotal, but the registration requirement itself comes from the messaging ecosystem rather than from Reddit.\n\nThe correct question is not simply *did HighLevel send?* It is *what was the last confirmed boundary, and what status did the next boundary return?*",
    },
    {
      h2: "Platform problem or messaging-compliance problem?",
      body: "A **workflow problem** exists when the contact never enrolled, a filter excluded it, a wait has not expired, the workflow is unpublished, re-entry is disabled, or the send action itself did not execute. A **provider or account problem** appears when execution occurred but the phone account rejected the request because of balance, number, destination, registration, or account status. A **carrier or recipient problem** appears after provider acceptance through filtering, unreachable numbers, handset blocking, or destination restrictions.\n\nA likely platform defect should reproduce with a fresh eligible contact after configuration and provider status have been confirmed. Capture workflow history, conversation events, message ID, provider code, timestamps, source and destination country, and number registration state.\n\nNever use repeated sends as diagnosis. Delayed messages may later arrive, producing duplicates and complaints. One labelled test per condition is more useful than five uncontrolled retries. If a message involves marketing, confirm documented consent before testing; technical curiosity is not an exemption from messaging rules.",
      diagram: { type: "flow", title: "Trace one text", steps: [
        { label: "Trigger", sub: "contact matched" },
        { label: "Action", sub: "send executed" },
        { label: "Provider", sub: "accepted or rejected" },
        { label: "Registration", sub: "number and campaign eligible" },
        { label: "Carrier", sub: "delivered or filtered" },
      ] },
    },
    {
      h2: "The no-delivery checklist",
      body: "**1. Confirm the contact state.** Check phone format, country, duplicate records, DND status, consent, and whether the exact trigger conditions were true at the event time.\n\n**2. Confirm workflow execution.** Verify publication, enrollment history, filters, re-entry, waits, time windows, stop conditions, and the send action result. Test with a fresh contact because old contacts often carry history that changes eligibility.\n\n**3. Confirm account and number health.** Check wallet or provider balance, number assignment, messaging capability, account restrictions, destination permissions, and whether A2P registration is approved for the actual business and use case.\n\n**4. Read the provider result.** Record the message ID and error code. Accepted is not the same as delivered. Deferred, undelivered, failed, and filtered require different actions.\n\n**5. Inspect content and cadence.** Look for prohibited use, missing opt-out language where required, link shorteners, repetitive templates, volume spikes, and message patterns likely to trigger filtering.\n\n**6. Compare destinations safely.** Test approved messages across a small set of carriers and numbers without turning troubleshooting into unsolicited outreach.",
    },
    {
      h2: "A2P 10DLC is not a GoHighLevel toggle",
      body: "A2P 10DLC is part of the United States carrier ecosystem for application-to-person messaging over local ten-digit numbers. Registration ties a business identity and messaging use case to its campaign and numbers. Approval does not grant permission to message people without consent, and a platform cannot guarantee that a carrier will accept every message.\n\nAgencies should collect the legal business name, tax information where required, website, privacy policy, terms, opt-in description, sample messages, help and stop behavior, and accurate use case before submission. The website and form should demonstrate the consent described in the application. Reusing copied language that does not match the actual flow can lead to rejection or future enforcement.\n\nBuild registration time into onboarding and do not promise an activation date controlled by reviewers and carriers. Keep approval records with the client. If the business, use case, or opt-in path changes, review whether the registration and disclosures still match. Compliance is an operating process, not a one-time badge.",
    },
    {
      h2: "Where SeldonFrame helps",
      body: "SeldonFrame helps by narrowing the messaging job around a service-business front office: responding to inquiries, collecting intake, booking, reminders, and human handoff. A smaller set of clearly expected message types is easier to map to consent and test than an account with many overlapping campaigns. Eligible agency plans can also use direct provider credentials, which can give the operator clearer access to message IDs, error codes, balances, and registration state.\n\nThat visibility can shorten the path between a failed workflow outcome and the responsible provider boundary. It can also make cost attribution clearer when the agency bills a client for actual communication usage.\n\nSeldonFrame is a fit when the agency wants controlled conversational operations rather than a deep promotional SMS engine. The platform decision should follow the use case. If sophisticated multistep campaigns are essential, HighLevel's broader automation may remain worth the additional setup and monitoring.",
    },
    {
      h2: "Where SeldonFrame cannot help",
      body: "SeldonFrame cannot bypass A2P registration, consent, carrier filtering, prohibited-content rules, number reputation, destination restrictions, or provider charges. BYOK does not mean *bring your own exemption*; it means the agency has more direct control and responsibility. It cannot make an inaccurate application pass or guarantee delivery after provider acceptance.\n\nIt also cannot repair a client relationship damaged by unsolicited messaging. Preserve opt-outs and DND state during any migration, and do not import a list as implied permission. A technically deliverable text may still be unlawful or unwelcome.\n\nDo not switch platforms before reading the current error codes and registration state. If the carrier is filtering the use case, moving the same number, content, and audience may reproduce the problem. If the real need is extensive campaign branching, keep GoHighLevel and improve the operating checklist. If it is a focused, consent-aware front office, evaluate [the SeldonFrame alternative](/alternative-to-gohighlevel) with the same compliance standard.",
    },
  ],
  faq: [
    { q: "Why does GoHighLevel say an SMS was sent but it was not received?", a: "Sent may mean the workflow handed the message to a provider. Check the message ID and downstream status for delivery, filtering, failure, or deferral. Recipient blocking, unreachable numbers, and carrier policy can occur after platform execution." },
    { q: "Does GoHighLevel require A2P 10DLC?", a: "Application-to-person messaging over applicable United States local numbers is subject to carrier registration rules regardless of the application used. HighLevel documents A2P registration and related LC Phone pricing for its phone system." },
    { q: "Should I resend an undelivered text?", a: "Only after identifying the failure and confirming consent. A delayed message can later arrive, so blind retries create duplicates. Correct the registration, number, account, content, or destination issue first, then perform one controlled test." },
    { q: "Will SeldonFrame avoid SMS carrier filtering?", a: "No. SeldonFrame can provide a focused workflow and direct provider visibility on eligible plans, but carriers and providers still enforce registration, consent, content, and reputation rules." },
  ],
  sources: [
    { label: "HighLevel — LC Phone pricing and A2P structure", url: "https://help.gohighlevel.com/support/solutions/articles/48001223556-lc-phone-pricing-structure" },
    { label: "HighLevel — Getting started with workflows", url: "https://help.gohighlevel.com/support/solutions/articles/155000002288-getting-started-with-workflows" },
    { label: "Reddit — A2P setup warning for new GoHighLevel users", url: "https://www.reddit.com/r/gohighlevel/comments/1t8n8ox/new_to_ghl_the_one_thing_nobody_tells_you_about/" },
    { label: "G2 — HighLevel review synthesis", url: "https://www.g2.com/products/highlevel/reviews?qs=pros-and-cons" },
  ],
};

