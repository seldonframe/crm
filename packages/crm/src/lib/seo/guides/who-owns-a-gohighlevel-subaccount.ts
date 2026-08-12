import type { Guide } from "./types";

export const guide: Guide = {
  slug: "who-owns-a-gohighlevel-subaccount",
  title: "Who Owns a GoHighLevel Subaccount? An Offboarding Guide",
  description:
    "The difference between legal ownership and practical control of a GoHighLevel sub-account, plus transfer, provider, data, and contract safeguards.",
  targetKeyword: "who owns a gohighlevel subaccount",
  intent: "informational",
  cluster: "gohighlevel",
  relatedTool: "/tools/agency-margin-calculator",
  relatedBest: "/alternative-to-gohighlevel",
  dek: "A contract determines legal ownership, but the HighLevel agency account determines much of the practical control. The agency owner controls sub-account administration and participates in transfers; connected domains, phone numbers, email providers, payment accounts, and data may have different owners. Define each asset, access right, export duty, transfer duty, and termination step in writing before launch.",
  sections: [
    {
      h2: "Ownership is a bundle, not one checkbox",
      body: "A client may own its customer relationships and business records while an agency administers the HighLevel sub-account containing them. The agency may own the snapshot or implementation method. The client may own its domain and Stripe account. A phone number may sit in an agency-controlled provider account. OAuth connections may belong to individual users. The contract, platform role, and provider account can therefore point to different controllers.\n\nHighLevel's transfer documentation shows the practical importance of agency control: a sub-account transfer between agencies involves authorization from the From Agency, and some assets or connections do not move unchanged. HighLevel also offers an eject process that can turn a sub-account into a new standalone agency, but that is still an administrative process rather than an automatic client right independent of the account owner.\n\nReddit posts from clients who lost access after an agency relationship ended illustrate the risk, but individual disputes do not establish legal ownership. The durable response is an asset schedule and offboarding procedure signed before conflict exists.",
    },
    {
      h2: "Legal ownership or practical control problem?",
      body: "A **legal ownership question** asks what the contract, privacy terms, intellectual-property terms, and applicable law say. This guide is operational information, not legal advice; ambiguous or disputed rights need qualified counsel. A **practical control question** asks which current administrator can log in, export, transfer, reconnect, pay, or revoke access.\n\nThe two can diverge. A client may contractually own its data but lack the agency permission required to transfer the sub-account. An agency may control the login but have a contractual duty to provide exports. A domain may be registered in the client's name but delegated to agency DNS. A phone number may be business-critical but held in a provider account that requires a separate port.\n\nMap both columns for every asset. If legal ownership says *client* and practical control says *agency*, add a time-bound delivery or transfer duty. If practical control is shared, name who decides during an incident. If ownership is genuinely agency-retained, disclose the consequence before the client builds dependency.",
      diagram: { type: "compare", title: "Two questions for every asset", left: { heading: "Legal and commercial", items: ["Who owns the data or work?", "What licence survives termination?", "Who pays outstanding charges?", "What must be returned or deleted?"] }, right: { heading: "Practical control", items: ["Who has the admin login?", "Who can export or transfer?", "Who owns domain and numbers?", "Who can reconnect providers?"] } },
    },
    {
      h2: "The client-safe contract schedule",
      body: "Attach a plain-language schedule listing the sub-account, contacts, conversations, files, workflows, funnels, templates, custom code, domains, DNS, phone numbers, A2P registrations, email domains, provider accounts, payment accounts, analytics, and credentials. For each, state owner, controller, payer, permitted use, export format, transfer method, and deletion or retention rule.\n\nDefine termination triggers and timing. State how much notice is required, which invoices must be settled, whether services continue during transfer, who pays provider and transfer costs, and how quickly the agency supplies available exports or authorizations. Name non-transferable or rebuild-required assets in advance.\n\nSeparate the client's data from the agency's reusable intellectual property. The agency can retain a generic method or template while delivering the client's records and agreed custom work. Avoid vague language such as *you own everything* when the platform cannot produce everything in a portable form. Promise only the operations you can perform and test them during the relationship.",
    },
    {
      h2: "The offboarding runbook",
      body: "**Thirty days before cutover:** confirm destination eligibility, obtain written authorization, freeze the asset matrix, and identify the From Agency and To Agency owners. Export available records and archive required evidence. Inventory integrations, phone numbers, domains, payment accounts, workflows, users, and future appointments.\n\n**Before transfer:** reconcile billing, define a change freeze, set workflows to the state required by current HighLevel instructions, and prepare reconnection credentials. Preserve consent, DND, and suppression state. Notify client users of access changes without exposing secrets.\n\n**During cutover:** track the official transfer or ejection request, move or reconnect domains and providers in a controlled sequence, and maintain a manual lead and appointment queue. Do not assume phone, email, social, Stripe, SaaS, and OAuth behavior is identical after the move.\n\n**After cutover:** verify contacts, conversations, appointments, opportunities, workflows, sending, booking, payments, and user access. Rotate agency-held secrets, remove former users, deliver the agreed archive, and record deletion or retention. Keep a signed acceptance of exceptions rather than leaving unresolved assets implicit.",
    },
    {
      h2: "Where SeldonFrame helps",
      body: "SeldonFrame is designed around explicit workspace identity and builder ownership of customized blocks. Open-source code and exportable blocks give agencies and builders more options for preserving the delivery method outside a single hosted account. Direct provider accounts on eligible plans can also place domains, messaging, AI, and related credentials closer to the party named in the contract.\n\nIts focused front-office scope makes the asset schedule smaller than a full marketing suite when the client only needs site, conversations, CRM, intake, booking, agents, and follow-up. That can make control and offboarding easier to explain before sale.\n\nThe best use is prospective: design ownership correctly at onboarding, use client-controlled domains where appropriate, name provider owners, schedule exports, and document the handoff. Architecture can support a fair relationship, but the agency still has to make and keep the promise.",
    },
    {
      h2: "Where SeldonFrame cannot help",
      body: "SeldonFrame cannot force a GoHighLevel agency to authorize a transfer, recover records from an inaccessible account, decide a legal dispute, or port a phone number held by an uncooperative provider. It cannot make every HighLevel asset portable or restore undocumented workflow history. Those problems must be addressed through the current administrator, provider, contract, and appropriate legal process.\n\nOpen source does not automatically give a nontechnical client a maintained deployment, secure backups, or working exports. Someone must operate the system and providers. SeldonFrame is also not the better fit when the client requires HighLevel's deep funnels, campaigns, snapshots, and ecosystem and has a trustworthy agency agreement covering control.\n\nDo not market SeldonFrame by telling clients that every GoHighLevel relationship is lock-in. Many agencies transfer accounts professionally, and HighLevel documents transfer and ejection paths. The honest claim is narrower: ownership and offboarding should be explicit, tested, and matched to the platform's real capabilities. Use [the export guide](/guides/can-you-export-gohighlevel) to build the asset matrix before choosing a destination.",
    },
  ],
  faq: [
    { q: "Does the client own a GoHighLevel sub-account?", a: "The contract determines legal rights, while the agency account and provider accounts determine practical administrative control. Review both. A client may own its data yet still need the From Agency to authorize a platform transfer." },
    { q: "Can a GoHighLevel agency refuse to transfer a sub-account?", a: "HighLevel's documented transfer process involves the From Agency's authorization. Whether refusal violates an agreement is a contractual or legal question. Define transfer duties and timing in writing before launch." },
    { q: "What does not transfer with a GoHighLevel sub-account?", a: "HighLevel's current transfer FAQ lists exclusions and reconnection work involving items such as auth connections, social settings, Stripe or SaaS configuration, smart lists, domains, and some email or phone setups. Verify the current document for the account." },
    { q: "Does SeldonFrame guarantee client ownership?", a: "SeldonFrame's open-source and builder-owned block model supports portability, but contracts, provider-account ownership, access roles, exports, and operations must still be configured correctly. Architecture supports ownership; it does not replace governance." },
  ],
  sources: [
    { label: "HighLevel — Sub-account transfer FAQ", url: "https://help.gohighlevel.com/support/solutions/articles/48001207259" },
    { label: "HighLevel — Eject a sub-account to a new agency", url: "https://help.gohighlevel.com/support/solutions/articles/155000003465-sub-account-transfers-eject-sub-account-to-a-new-agency" },
    { label: "HighLevel — What happens to data after cancellation", url: "https://help.gohighlevel.com/support/solutions/articles/155000004281-what-happen-s-to-your-data-when-you-cancel-your-highlevel-subscription-" },
    { label: "Reddit — Sub-account move and agency authorization discussion", url: "https://www.reddit.com/r/gohighlevel/comments/1kqnbao" },
  ],
};

