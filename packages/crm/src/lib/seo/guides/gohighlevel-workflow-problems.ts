import type { Guide } from "./types";

export const guide: Guide = {
  slug: "gohighlevel-workflow-problems",
  title: "GoHighLevel Workflow Problems: Duplicate or Missing Steps",
  description:
    "A systematic GoHighLevel workflow troubleshooting guide for double texts, missing leads, wrong timing, re-entry, filters, waits, and integrations.",
  targetKeyword: "gohighlevel workflow problems",
  intent: "informational",
  cluster: "gohighlevel",
  relatedTool: "/tools/gohighlevel-cost-calculator",
  relatedBest: "/alternative-to-gohighlevel",
  dek: "Most GoHighLevel workflow failures can be traced by following one contact from trigger attempt to final action. For duplicates, inspect overlapping workflows and re-entry. For missing actions, inspect publication, filters, DND, stop conditions, and provider results. For late actions, inspect waits, time zones, execution queues, and external dependencies before rebuilding the automation.",
  sections: [
    {
      h2: "Start with one contact, not the whole canvas",
      body: "A complex workflow diagram invites broad speculation. A single contact history gives a sequence of facts: which event occurred, which trigger attempted to match, which filters passed, which branch ran, which waits were scheduled, which actions executed, and what downstream services returned. Start there.\n\nHighLevel's workflow documentation recommends fresh test contacts, checking trigger conditions and filters, verifying re-entry, and using live tests. Its newer error-highlighting tools identify incomplete fields and integration issues before or during configuration. Those features improve diagnosis, but they cannot determine whether the agency's business logic is correct.\n\nReddit practitioners describe double texts, wrong timing, missed leads, and accounts held together by many overlapping automations. These are valuable examples, not proof that every failure is a product bug. In many cases, the platform executes exactly what multiple triggers and re-entry rules instruct it to do. Reliability begins by making the intended state transition explicit enough to compare with the contact history.",
    },
    {
      h2: "Platform problem or automation-architecture problem?",
      body: "An **architecture problem** is likely when two workflows respond to the same event, re-entry allows repeated enrollment, tags serve several conflicting meanings, waits cross business rules without exit checks, or edits are made directly to a live path without version control. A **data problem** appears when duplicate contacts, missing fields, inconsistent time zones, or imported history changes eligibility. An **integration problem** appears when the workflow action runs but the downstream calendar, provider, webhook, or payment service rejects it.\n\nA likely **platform problem** reproduces on a fresh contact under documented conditions after the trigger, filters, publication state, provider, and data have been confirmed. Capture the workflow version, execution ID, contact ID, exact timestamps, expected branch, actual branch, and any error result.\n\nDo not rebuild before preserving evidence. Replacing the workflow may hide the cause and leave another overlapping automation active. Clone or version the path, pause only the dangerous action, and keep a known-good rollback.",
      diagram: { type: "flow", title: "Trace before editing", steps: [
        { label: "Event", sub: "what happened" },
        { label: "Trigger", sub: "attempted and matched" },
        { label: "Branch", sub: "filters and data" },
        { label: "Wait", sub: "clock and exit" },
        { label: "Action", sub: "executed once" },
        { label: "Provider", sub: "accepted or failed" },
      ] },
    },
    {
      h2: "Why workflows double-text or run twice",
      body: "First search for every workflow, campaign, manual action, and integration that can send the same message. A form submission may update a contact, create an opportunity, add a tag, and book an appointment; if each event starts a similar workflow, one customer can enter several paths.\n\nCheck *Allow Re-entry* and the exact trigger semantics. Re-entry may be correct for recurring appointments but wrong for a one-time welcome. Inspect whether repeated webhook delivery or duplicate form submissions can create multiple events. Check whether staff retries an action manually before a delayed automation executes.\n\nAdd an idempotency guard based on a durable state such as message-purpose plus appointment or lead ID, not only a temporary tag that another workflow removes. Put one system in charge of each customer-facing message. If a message is delayed during an incident, reconcile pending and completed actions before replay.\n\nAfter the fix, test the initial event, a repeated event, a contact already in progress, and a contact that previously completed the path. A single happy-path test does not prove duplicate protection.",
    },
    {
      h2: "Why actions go missing or arrive late",
      body: "For a missing action, confirm that the workflow was published when the event occurred. Check trigger narration or statistics where available, enrollment history, filters, DND and opt-out state, stop-on-response behavior, branch data, assigned user, and whether the contact had already completed a non-reentrant path. Use a fresh contact to remove hidden history.\n\nFor a late action, inspect wait definitions: fixed duration versus calendar time, account and contact time zones, business-hour windows, appointment-relative calculations, and daylight-saving transitions. Check whether a preceding action or external webhook blocked progress. Then inspect provider timestamps to distinguish late execution from late delivery.\n\nFor lost leads, add a control outside the main workflow: a report or alert for new inquiries that did not reach the expected pipeline stage within a short interval. This detects outcome failure even when no individual action reports an error. Automations should be monitored by the business state they must create, not only by whether each box appears green.",
    },
    {
      h2: "Where SeldonFrame helps",
      body: "SeldonFrame helps when the desired automation is a standard front-office sequence rather than an open-ended campaign graph. BLOCK.md skills can describe the trigger, tools, state, handoff, and expected output as an owned unit. Focused templates for answering, qualification, booking, reviews, and speed-to-lead reduce the need for many overlapping workflows.\n\nA narrower state model makes testing easier. The agency can define one path from inquiry to record, booking, or human escalation and reuse it across workspaces while preserving client-specific rules. Because customized blocks are owned and exportable, the agency's method is less dependent on remembering a large visual canvas.\n\nThis can reduce accidental complexity, especially for local-service operations. It does not mean every automation should become an AI agent. Deterministic consent, billing, and state transitions still need explicit controls. The gain is a smaller, more legible operating unit.",
    },
    {
      h2: "Where SeldonFrame cannot help",
      body: "SeldonFrame cannot replace HighLevel's deep campaign automation for agencies that need many branches, long nurture sequences, broad trigger coverage, snapshots, and a large specialist ecosystem. HighLevel may be the correct tool when those capabilities are the product. A simpler platform would merely push complexity into custom code or external services.\n\nIt also cannot make ambiguous business logic reliable. If nobody can say when a lead should stop receiving messages, who owns a handoff, or what counts as completion, an agent or block will reproduce the ambiguity. Provider delays, bad data, duplicated events, and missing consent remain possible.\n\nDo not migrate a broken workflow as a black box. First map its trigger, states, side effects, dependencies, and required history. Then decide whether the useful core belongs in a SeldonFrame front-office block or should remain in HighLevel. For the broader decision, use [how to replace GoHighLevel](/guides/how-to-replace-gohighlevel) rather than assuming every workflow has a one-to-one equivalent.",
    },
  ],
  faq: [
    { q: "Why is my GoHighLevel workflow sending duplicate texts?", a: "Common causes include overlapping workflows, multiple triggers for one business event, re-entry, duplicate records or webhooks, and manual retries before delayed automation completes. Trace one contact across every possible sender and add a durable idempotency guard." },
    { q: "Why did a contact not enter a GoHighLevel workflow?", a: "Check publication time, trigger attempts, filters, re-entry, prior history, DND, stop conditions, required fields, and whether the event occurred before the workflow was active. Test with a fresh contact under controlled conditions." },
    { q: "Why did a GoHighLevel workflow run late?", a: "Inspect wait type, account and contact time zones, business-hour rules, appointment-relative calculations, daylight-saving changes, blocked prior actions, queue timing, and downstream provider timestamps." },
    { q: "Can SeldonFrame import GoHighLevel workflows automatically?", a: "Do not assume a one-click conversion. The workflow's intent, states, data, integrations, and side effects must be mapped. Focused front-office paths may be rebuilt as owned blocks, while deep campaigns may be better left in HighLevel." },
  ],
  sources: [
    { label: "HighLevel — Getting started with workflows", url: "https://help.gohighlevel.com/support/solutions/articles/155000002288-getting-started-with-workflows" },
    { label: "HighLevel — Highlighting and resolving workflow errors", url: "https://help.gohighlevel.com/support/solutions/articles/155000004872-highlighting-resolving-errors-in-a-workflow" },
    { label: "Reddit — Practitioner review of recurring GoHighLevel system architecture problems", url: "https://www.reddit.com/r/gohighlevel/comments/1pi8tvp/after_working_on_1400_ghl_systems_here_are_the/" },
    { label: "G2 — HighLevel review synthesis", url: "https://www.g2.com/products/highlevel/reviews?qs=pros-and-cons" },
  ],
};
