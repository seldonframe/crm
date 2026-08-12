import { AGENCY_PRICING_CLAIM, BUILDER_PRICING_CLAIM } from "../../marketing/public-claims";
import type { Guide } from "./types";

export const guide: Guide = {
  slug: "ai-front-office-software-for-agencies",
  title: "AI Front Office Software for Agencies: A 10-Point Evaluation Checklist",
  description:
    "Compare AI front-office software for agencies with a practical checklist covering client isolation, delivery, ownership, testing, portability, and margins.",
  targetKeyword: "ai front office software for agencies",
  intent: "commercial",
  cluster: "sell-agents",
  relatedTool: "/tools/agency-margin-calculator",
  relatedBest: "/agencies",
  dek:
    "The right platform for an AI front-office agency is the one that makes a client promise repeatable and auditable. Use these ten criteria to evaluate the workspace, delivery, ownership, safety, portability, and margin behind the demo before you sell it to another service business.",
  sections: [
    {
      h2: "Start with the agency job to be done",
      body:
        "An agency is not buying a chatbot for itself. It is delivering a customer-facing system to several businesses, each with separate data, calendars, rules, branding, and people who need a clear handoff. Test the complete loop with a disposable client workspace: an inquiry should create a record, a booking should land on the right calendar, and an exception should reach the right human. The companion [AI front office examples](/guides/ai-front-office-examples) gives seven workflows to use as test scripts.",
      callout: {
        kind: "warning",
        text: "A beautiful agency dashboard cannot compensate for a client record that is shared, a calendar that cannot be exported, or an escalation that nobody owns.",
      },
    },
    {
      h2: "1. Client isolation and permissions",
      body:
        "Verify **client isolation and permissions** before evaluating templates. Each client needs separate contacts, conversations, bookings, credentials, logs, and member roles. An agency operator may need cross-client administration while a client user should see only their own workspace. Ask whether a mistaken workspace selection can expose a contact or calendar, and whether audit logs show who changed an agent rule.",
    },
    {
      h2: "2. Agency branding and custom domains",
      body:
        "Check **agency branding and custom domains** across the actual customer experience, not just the admin header. The website, booking confirmation, client portal, email sender, and agent handoff should make the ownership model clear. Confirm which domains, logos, sender identities, and legal notices the agency can control, and what remains the underlying vendor's responsibility.",
    },
    {
      h2: "3. Client portals",
      body:
        "A useful **client portal** lets an owner review leads, bookings, conversations, tasks, and performance without learning the agency's internal tooling. Test the portal with a client-level account and confirm it can acknowledge a handoff, update business hours, and find the source conversation. A read-only report is not a portal if the client cannot act on the exceptions they are expected to own.",
    },
    {
      h2: "4. Reusable deployment and cloning",
      body:
        "Look for **reusable deployment and cloning** that copies a proven workflow without copying secrets or another client's records. A good template includes intake fields, guardrails, test cases, escalation language, and a launch checklist; the new workspace supplies its own services, calendar, phone number, and credentials. Measure the number of manual steps and the places where an operator could accidentally retain the previous client's data.",
    },
    {
      h2: "5. Voice, chat, SMS, CRM, booking, and intake integration",
      body:
        "Test the full **voice, chat, SMS, CRM, booking, and intake integration** as one state transition. A phone call, website chat, text, or form should resolve to the same contact and service need; the booking should be written to the real calendar; and the transcript should remain attached to the CRM record. A platform that demos six channels but creates six disconnected histories creates reconciliation work for the agency.",
    },
    {
      h2: "6. BYOK and telephony ownership",
      body:
        "Clarify **BYOK and telephony ownership** in the contract and the product settings. Decide who owns model keys, phone numbers, recordings, messaging accounts, calendar credentials, and usage bills. Confirm that an agency can rotate a key, port a number, and export a client's data without asking the vendor to impersonate the client. See [what is BYOK in AI](/guides/what-is-byok-ai) for the control and cost trade-off.",
    },
    {
      h2: "7. Testing, evaluations, receipts, and human escalation",
      body:
        "Require **testing, evaluations, receipts, and human escalation** before launch. The agency should be able to run test calls and messages against known cases, inspect what changed, and prove when a workflow handed a request to a person. Define escalation for emergencies, complaints, uncertainty, and policy exceptions. A high-quality receipt includes the input, action, record written, and next owner; a transcript alone is not an evaluation.",
    },
    {
      h2: "8. Data export and portability",
      body:
        "Ask for **data export and portability** while the relationship is friendly. Export contacts, conversations, bookings, configuration, media, consent, and audit history in usable formats, with stable identifiers that preserve relationships. Document whether a client can take its phone number, model keys, prompts, website content, and calendar data elsewhere. Portability is part of the client promise, not a theoretical edge case.",
    },
    {
      h2: "9. Billing shape and margin predictability",
      body:
        "Model the **billing shape and margin predictability** with a realistic client: base workspace fee, voice minutes, SMS, model usage, storage, domains, support time, and payment fees. Separate pass-through usage from the agency's operating retainer so a busy month does not erase margin. The [agency margin calculator](/tools/agency-margin-calculator) is useful for testing scenarios, but record the vendor's actual usage rules before quoting a client.",
    },
    {
      h2: "10. Open-source and self-hosting trade-offs",
      body:
        "Evaluate **open-source and self-hosting trade-offs** honestly. Source availability can improve inspection, extensibility, and control, but it also means the agency owns more deployment, upgrades, security, and incident work. Hosted delivery can reduce operations while introducing vendor dependencies. Ask who patches the stack, where secrets live, how backups work, and what happens when a provider API changes. The [SeldonFrame documentation](/docs) and the GitHub repository linked in the sources are starting points for an informed review.",
    },
    {
      h2: "The Builder and Agency boundary",
      body:
        `${AGENCY_PRICING_CLAIM} Agency Starter is $99/mo for 10 client workspaces, the first agency tier in the ladder. This is the agency path when you need separate client workspaces and a repeatable, brandable delivery.\n\n${BUILDER_PRICING_CLAIM} Builder is the own-business path, not a hidden agency tier: it does not include client sub-accounts, white-label resale, or an agency portal. A service business owner building its own front office can use Builder; an agency selling front offices to multiple businesses should evaluate an Agency plan against the ten criteria above. See the public [pricing page](/pricing) for current plan details and [what is an AI front office](/guides/what-is-an-ai-front-office) for the product model.`,
      callout: {
        kind: "tip",
        text: "Choose the plan that matches who owns the workspace. Do not promise agency delivery from a single-business plan just because the first demo looks similar.",
      },
    },
    {
      h2: "Vendor disclosure and a practical trial",
      body:
        "Disclosure: SeldonFrame is the vendor-authored example in this article. It is an agent-native, open-source alternative to GoHighLevel for agencies selling AI front offices to service businesses. Its Agency plans are designed around client workspaces and repeatable delivery; the claims above should still be verified in your own trial and contract.\n\nBefore committing, build one disposable client workspace and run the seven [workflow examples](/guides/ai-front-office-examples). Invite a client-level user, rotate a test credential, export the records, and replay an escalation. If the platform cannot show the complete path from inquiry to owned outcome, keep comparing options rather than buying the dashboard.",
    },
  ],
  faq: [
    {
      q: "What is the most important criterion for agency AI front-office software?",
      a: "Client isolation is foundational: each client needs separate data, permissions, credentials, calendars, and audit history. Then test whether the rest of the workflow creates a reliable record and human handoff inside that boundary.",
    },
    {
      q: "Is Builder suitable for an agency selling AI front offices?",
      a: "Builder is for one business the operator owns and operates. SeldonFrame Agency plans start at $99/mo for 10 client workspaces and white-label delivery. The $29 Builder plan does not include client sub-accounts or resale.",
    },
    {
      q: "Does open source mean an agency should self-host?",
      a: "Not automatically. Open source can improve inspection and control, while self-hosting adds deployment, upgrades, security, and backup responsibility. Compare those obligations with hosted support and document who owns each operational task.",
    },
    {
      q: "How should an agency validate a vendor claim?",
      a: "Use one disposable client workspace, run a complete workflow, inspect the records and escalation receipt, export the data, and test a credential rotation. A claim is useful only when the agency can reproduce it without relying on a sales demo.",
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
    {
      label: "GoHighLevel pricing",
      url: "https://www.gohighlevel.com/pricing",
    },
  ],
};
