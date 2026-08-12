import type { Guide } from "./types";

export const guide: Guide = {
  slug: "can-you-export-gohighlevel",
  title: "Can You Export GoHighLevel? What Moves and What Does Not",
  description:
    "An asset-by-asset GoHighLevel export and migration guide for contacts, conversations, workflows, funnels, calendars, numbers, and integrations.",
  targetKeyword: "can you export gohighlevel",
  intent: "informational",
  cluster: "gohighlevel",
  relatedTool: "/tools/gohighlevel-cost-calculator",
  relatedBest: "/alternative-to-gohighlevel",
  dek: "You can export some GoHighLevel data, but there is no universal file that recreates an entire account elsewhere. Contacts can be exported to CSV with documented limits; sub-accounts can be transferred between eligible HighLevel agencies; individual assets can sometimes be copied; integrations, credentials, provider history, and workflow behavior often require separate reconstruction and verification.",
  sections: [
    {
      h2: "Export, copy, and transfer are different",
      body: "An **export** produces data you can inspect or import elsewhere, such as a contacts CSV. A **copy** reproduces a supported asset inside the HighLevel ecosystem, such as copying a workflow to another sub-account. A **sub-account transfer** moves an eligible location from one HighLevel agency to another. These operations solve different problems and preserve different context.\n\nHighLevel's contact export documentation notes limits: exports are performed per sub-account, automation history is not included, and some fields or note content may not preserve everything a team expects. HighLevel's workflow-copy documentation says certain referenced assets are copied while other references can be cleared. Transfer documentation preserves more account context but requires coordination and leaves integrations to reconnect.\n\nReddit posts complaining that a workflow cannot be exported as a portable standalone file capture a real portability concern, but do not mean nothing can move. The accurate answer is an asset matrix, not *yes* or *no*.",
      diagram: { type: "compare", title: "Three portability operations", left: { heading: "Portable outside HighLevel", items: ["Selected CSV records", "Downloaded files where available", "Manually documented logic", "Provider-owned data and credentials"] }, right: { heading: "Moves within HighLevel", items: ["Eligible sub-account transfer", "Supported workflow copy", "Sites, funnels, calendars in transfer", "Contacts, conversations, opportunities in transfer"] } },
    },
    {
      h2: "What the asset matrix should contain",
      body: "List every category before choosing a migration date. Include contacts and custom fields; notes and tasks; conversations and attachments; opportunities and pipelines; calendars and appointments; workflows and execution history; forms and surveys; sites, funnels, domains, and tracking; products, payments, subscriptions, and invoices; users and permissions; phone numbers and A2P registration; email domains and suppression; integrations and OAuth connections; SaaS configuration; reports; templates; and audit history.\n\nFor each asset, record one of five dispositions: **exportable**, **transferable within HighLevel**, **copyable with limits**, **rebuild required**, or **archive only**. Add owner, record count, validation method, and retention requirement.\n\nDo not treat a CSV row as the business process. A contact export may preserve identity and field values while omitting the automation state, conversation context, or external-system link that determines the next action. The migration plan must preserve both data and the meaning used by the new system.",
    },
    {
      h2: "Platform limitation or migration-scope problem?",
      body: "A **platform limitation** is a documented omission or a missing portable format—for example, no full-fidelity external package for an entire workflow and its execution history. A **scope problem** occurs when the agency says *export everything* without identifying which records, histories, files, credentials, and business states must be usable after the move.\n\nThe difference matters because no destination can verify an unspecified migration. Decide which historical conversations must remain searchable, which appointments must remain actionable, which consent and suppression records must be preserved, which financial records are legally retained, and which old automations can be archived instead of rebuilt.\n\nWhen a sub-account remains inside HighLevel, a transfer may preserve more than CSV exports, but the current From Agency must authorize the move and documented exclusions still require setup. When leaving HighLevel, assume each capability needs an explicit export or reconstruction path. Test samples early rather than discovering format limits during cutover.",
    },
    {
      h2: "A safe migration sequence",
      body: "**Inventory:** freeze the asset matrix and owners. Record counts, domains, numbers, integrations, workflow versions, and current provider accounts.\n\n**Export and archive:** produce available CSVs and downloads, capture configuration and consent evidence, preserve reports needed for reconciliation, and store files securely with an access and deletion policy.\n\n**Build the destination:** recreate fields and identifiers before importing records. Map statuses, owners, time zones, opt-outs, suppression, and external IDs. Rebuild only workflows that still produce a required outcome.\n\n**Dry run:** import a representative sample and compare counts and field values. Test active journeys with fresh records. Confirm domains, calendars, providers, and handoffs.\n\n**Cut over:** define a write freeze or delta process so records created during migration are not lost. Move channels in a controlled order and keep rollback criteria.\n\n**Reconcile:** compare source and destination totals, spot-check high-value records, verify consent and suppression, monitor live actions, and keep the source accessible only for the documented retention period. Never cancel before exports and verification are complete.",
    },
    {
      h2: "Where SeldonFrame helps",
      body: "SeldonFrame's architecture favors ownership: the platform is open source, builders own customized blocks, and those blocks can be exported and published. That gives an agency a portable representation of its delivery logic instead of making the visual account configuration the only copy of its method. Direct provider accounts on eligible plans can also keep some channel data and credentials under clearer agency control.\n\nThis is useful for a focused migration. Rather than trying to recreate every GoHighLevel feature, the agency can rebuild the current front-office outcome—site inquiry, conversation, intake, booking, CRM record, agent action, and human handoff—and preserve only the source data required to operate it.\n\nThe ownership benefit is strongest when documented before launch: name data owners, provider owners, export cadence, and offboarding duties. Open source improves options, but an unmaintained export process can still leave important state trapped in practice.",
    },
    {
      h2: "Where SeldonFrame cannot help",
      body: "SeldonFrame cannot automatically convert every GoHighLevel workflow, funnel, conversation history, report, integration, phone number, or SaaS setting. It cannot recover data that the current administrator will not export or authorize for transfer. It cannot infer consent or business state from incomplete CSV fields, and it should not be used to bypass contractual or privacy duties.\n\nIt is not feature-equivalent for funnel-heavy and campaign-heavy agencies. If the destination would require custom rebuilding of capabilities HighLevel already handles well, an internal HighLevel transfer may be safer than leaving the ecosystem.\n\nDo not cancel first and export later. HighLevel documents access loss and retention behavior after cancellation, but retention is not a migration plan. Complete exports, transfer authorization, provider ownership, dry runs, and reconciliation before changing the source account. For a decision framework, pair this article with [how to switch from GoHighLevel](/guides/how-to-switch-from-gohighlevel).",
    },
  ],
  faq: [
    { q: "Can I export all GoHighLevel contacts?", a: "Contacts can be exported per sub-account, but inspect HighLevel's current documented field and note limitations. A contacts CSV does not contain every automation event, conversation context, integration, or workflow state required to recreate the account." },
    { q: "Can GoHighLevel workflows be exported?", a: "HighLevel supports copying workflows between accessible sub-accounts, with documented behavior for referenced assets. That is different from a universally portable external file that recreates the workflow and history in another platform." },
    { q: "Can a GoHighLevel sub-account move to another agency?", a: "Eligible sub-accounts can be transferred between HighLevel agencies through the documented process. The From Agency participates in authorization, and several integrations and settings must be reconnected or recreated after transfer." },
    { q: "Can SeldonFrame import an entire GoHighLevel account?", a: "No one-click full-fidelity import should be assumed. Map the required front-office data and behavior, export supported records, preserve consent and IDs, then rebuild and verify the necessary paths in SeldonFrame." },
  ],
  sources: [
    { label: "HighLevel — Export contacts to CSV", url: "https://help.gohighlevel.com/support/solutions/articles/48001238482-how-to-export-contacts-to-a-csv-in-highlevel" },
    { label: "HighLevel — Copy workflow to another sub-account", url: "https://help.gohighlevel.com/support/solutions/articles/155000001229" },
    { label: "HighLevel — Sub-account transfer FAQ", url: "https://help.gohighlevel.com/support/solutions/articles/48001207259" },
    { label: "Reddit — Discussion of portable workflow export limitations", url: "https://www.reddit.com/r/gohighlevel/comments/1td5eac/til_gohighlevel_has_no_way_to_import_and_export/" },
  ],
};
