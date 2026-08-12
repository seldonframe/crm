import type { Guide } from "./types";

export const guide: Guide = {
  slug: "gohighlevel-bugs-and-outages",
  title: "GoHighLevel Bugs and Outages: A Client-Safe Playbook",
  description:
    "How agencies can classify GoHighLevel failures, check incidents, protect client leads, communicate clearly, and verify recovery without guessing.",
  targetKeyword: "gohighlevel bugs and outages",
  intent: "informational",
  cluster: "gohighlevel",
  relatedTool: "/tools/gohighlevel-cost-calculator",
  relatedBest: "/alternative-to-gohighlevel",
  dek: "Treat a suspected GoHighLevel outage as an incident to classify, not a conclusion to announce. Check the official status page, reproduce with a fresh record, inspect workflow and provider histories, identify the smallest affected surface, activate a manual continuity path, communicate scope and cadence to clients, and verify recovery before replaying missed work.",
  sections: [
    {
      h2: "A failed outcome is not yet an outage",
      body: "When a lead does not receive a message or a calendar fails to update, the visible symptom sits at the end of several systems: browser, account permissions, workflow logic, HighLevel services, email or phone provider, carrier, destination server, and sometimes an external calendar or payment processor. Calling every failure a GoHighLevel outage can send the investigation in the wrong direction.\n\nStart with the official HighLevel status page because it can confirm a known service incident and its reported scope. A green page is not proof that one account has no defect; status systems summarize recognized service health and may lag a newly detected or narrow problem. Likewise, a Reddit post reporting multiple incidents is a useful signal to investigate, not a measured outage rate.\n\nThe agency's job is to determine what failed, when, for whom, and at which boundary. That creates a client-safe response whether the root cause is HighLevel, an upstream provider, or local configuration.",
    },
    {
      h2: "Platform problem, provider problem, or setup problem?",
      body: "A **setup problem** usually follows a change or affects a specific account, workflow, permission, integration, stale test record, or condition. Reproduce with a fresh record and compare against a known-good client baseline.\n\nA **provider problem** shows evidence that HighLevel handed off the event but the downstream email, phone, calendar, payment, domain, or AI provider rejected, delayed, or could not complete it. Check the provider's logs and status separately.\n\nA **platform incident** becomes more likely when multiple clean accounts fail on the same documented action, the official status page reports degradation, or support confirms a service issue. Preserve timestamps, request or execution IDs, affected locations, and the first and last known good examples.\n\nDo not run repeated live tests through customer channels without controls. They can create duplicate messages when delayed jobs recover. Use labelled test contacts, safe destinations, and idempotency checks. Classification should reduce customer impact, not add a second incident.",
      diagram: { type: "compare", title: "First classification", left: { heading: "Local or provider", items: ["One account or channel", "Recent configuration change", "Downstream rejection in logs", "Fresh control test succeeds elsewhere"] }, right: { heading: "Possible platform incident", items: ["Multiple clean accounts", "Same action and time window", "Official degradation notice", "Support confirms shared impact"] } },
    },
    {
      h2: "The first 30 minutes",
      body: "**Minutes 0 to 5:** assign one incident owner and record the discovery time. Freeze unrelated changes on the affected path. Check the official status pages for HighLevel and any connected provider.\n\n**Minutes 5 to 10:** reproduce once with a fresh, clearly labelled record. Capture the exact time zone, location, workflow, channel, expected result, actual result, and histories. Determine whether reads, writes, sends, bookings, or logins are affected.\n\n**Minutes 10 to 20:** activate the narrowest continuity plan. Route new leads to a manual queue, publish a backup contact method, export a work list, or pause only the action that risks duplication. Preserve consent and do not move sensitive data into an unapproved tool for convenience.\n\n**Minutes 20 to 30:** send clients a factual update: affected service, known scope, business workaround, actions they should avoid, and the next update time. Open one complete support case if the problem is not explained. Avoid declaring a cause before evidence exists.",
    },
    {
      h2: "Recovery is a controlled replay",
      body: "A status page returning to green is the start of recovery, not the end. Run a fresh synthetic transaction through the exact failed path. Confirm each boundary: intake recorded, trigger matched, action executed, provider accepted, recipient received, CRM state updated, and human handoff appeared where expected.\n\nNext, identify work accumulated during the incident. Divide it into safe-to-replay, already completed manually, expired, and requires-human-review. Replaying every event blindly can double-text leads, create duplicate opportunities, or send reminders after an appointment has passed. Use deduplication fields and a reviewed list.\n\nClose the incident only after one real transaction succeeds and the backlog is reconciled. Record root cause as *confirmed*, *probable*, or *unknown* rather than converting a guess into institutional memory. Add one preventive control: a synthetic test, queue alert, provider-balance check, export cadence, or runbook improvement. Reliability comes from reducing detection and recovery time, not claiming failures will never occur.",
    },
    {
      h2: "Where SeldonFrame helps",
      body: "SeldonFrame helps when an agency wants a smaller, observable front-office path instead of a large marketing stack. Its opinionated connection between inquiry, conversation, intake, booking, CRM, and agent behavior makes it easier to define a synthetic test and a known-good deployment. Open-source code and builder-owned blocks also make the implementation less opaque and easier to preserve outside one vendor surface.\n\nA focused system can reduce incident scope. If the client does not use funnel builders, campaign catalogs, and dozens of automation branches, those components cannot become dependencies of the core lead path. BYOK on eligible plans can give the agency direct visibility into provider accounts and usage when troubleshooting.\n\nThe value is operational clarity. Agencies can use the same incident discipline with SeldonFrame: trace the event through fewer intentional boundaries, keep a manual queue, and export critical data. If reliability is motivating a switch, pair this playbook with [the GoHighLevel migration guide](/guides/how-to-switch-from-gohighlevel).",
    },
    {
      h2: "Where SeldonFrame cannot help",
      body: "SeldonFrame cannot guarantee zero outages. It still relies on hosting, databases, networks, domains, communication providers, AI services, calendars, and agency configuration. Direct provider accounts can improve visibility, but they also give the agency more responsibility for balances, credentials, limits, and provider incidents.\n\nIt cannot prove that an anecdotal GoHighLevel complaint represents typical reliability, and this guide does not publish an outage-rate comparison because no comparable verified rate was found. It also cannot recreate HighLevel's mature breadth or ecosystem for an agency that depends on those capabilities.\n\nDo not switch during an active incident unless continuity requires an emergency fallback you have already tested. A rushed migration creates new variables while evidence is weakest. Stabilize, export, map dependencies, test the replacement, then cut over with rollback criteria. The right platform is the one whose capabilities and failure modes your agency can operate—not the one marketed as incapable of failure.",
    },
  ],
  faq: [
    { q: "How do I know if GoHighLevel is down?", a: "Check HighLevel's official status page, reproduce the action with a fresh safe record, compare multiple accounts, and inspect connected-provider status and logs. A single failed outcome is not enough to assign the root cause." },
    { q: "Should I resend messages after a GoHighLevel incident?", a: "Not in bulk without reconciliation. Separate messages that failed before provider acceptance from delayed or already delivered messages, remove manually completed work, confirm consent, and replay from a reviewed deduplicated list." },
    { q: "What should I tell clients during an outage?", a: "State the affected service, known scope, current workaround, what users should avoid, and the time of the next update. Separate confirmed facts from investigation and do not promise a recovery time controlled by a vendor." },
    { q: "Is SeldonFrame more reliable than GoHighLevel?", a: "This research does not establish a comparable outage rate, so it would be misleading to claim that. SeldonFrame offers a narrower, more inspectable architecture, but it still has platform and provider dependencies that require monitoring and continuity planning." },
  ],
  sources: [
    { label: "HighLevel — Official service status", url: "https://status.gohighlevel.com/" },
    { label: "HighLevel — Getting started with workflows and troubleshooting", url: "https://help.gohighlevel.com/support/solutions/articles/155000002288-getting-started-with-workflows" },
    { label: "G2 — HighLevel review synthesis", url: "https://www.g2.com/products/highlevel/reviews?qs=pros-and-cons" },
    { label: "Reddit — Practitioner discussion of recent GoHighLevel incidents", url: "https://www.reddit.com/r/gohighlevel/comments/1p286kp/what_is_wrong_with_ghl_lately/" },
  ],
};
