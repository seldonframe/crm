import type { Guide } from "./types";

export const guide: Guide = {
  slug: "gohighlevel-wallets-and-rebilling",
  title: "GoHighLevel Wallets and Rebilling: Stop Surprise Charges",
  description:
    "A plain-English map of GoHighLevel agency wallets, sub-account wallets, usage charges, rebilling, markup, and monthly margin controls.",
  targetKeyword: "gohighlevel wallets and rebilling",
  intent: "informational",
  cluster: "gohighlevel",
  relatedTool: "/tools/gohighlevel-cost-calculator",
  relatedBest: "/alternative-to-gohighlevel",
  dek: "GoHighLevel usage can surprise agencies because the agency wallet often funds a charge before client rebilling recovers it. Rebilling changes who ultimately bears eligible usage; it does not make usage disappear. Map every product to its funding wallet, rebilling rule, markup eligibility, client payment method, refill threshold, and failed-payment fallback before promising a flat margin.",
  sections: [
    {
      h2: "The money path in plain English",
      body: "HighLevel's pricing guide describes an agency wallet used for consumption products such as phone, email, AI, and premium workflow actions. The wallet can auto-refill, which prevents service interruption but can make spend feel disconnected from individual client activity. Rebilling can pass eligible charges to a sub-account, while markup capabilities depend on plan and product rules.\n\nThat creates three different questions: **Who funds the service at the moment of use? Who is invoiced or debited afterward? Who absorbs the cost when the client's payment fails?** An agency can configure a client card and still see its own wallet charged first because the platform needs a funding source for immediate consumption.\n\nReddit posts describing unexpected agency email charges illustrate the confusion, but a post cannot establish that the platform billed incorrectly. The first task is reconciliation against documented wallet events, sub-account usage, rebilling configuration, and payment status. Surprise is not the same as an error; it often means the cash-flow path was never modelled.",
      diagram: { type: "flow", title: "Typical usage cash flow", steps: [
        { label: "Client action", sub: "email, SMS, call, AI" },
        { label: "Agency wallet", sub: "service funded" },
        { label: "Usage ledger", sub: "client attributed" },
        { label: "Rebilling", sub: "eligible cost recovered" },
        { label: "Agency margin", sub: "after failures and fees" },
      ] },
    },
    {
      h2: "Platform problem or billing-model problem?",
      body: "A likely **configuration problem** exists when rebilling is disabled for a product or sub-account, the wrong SaaS plan is attached, markup is unavailable on the agency plan, a client payment method is absent, or failed payments fall back to the agency. A **forecasting problem** exists when the offer includes unlimited usage without a measured allowance or when auto-refill masks a sudden campaign.\n\nA likely **platform billing problem** requires a reconciled discrepancy: a wallet event with no corresponding usage, the wrong sub-account attribution, a charge inconsistent with the published rule, or an amount that remains after refunds and timing differences are considered. Capture transaction IDs, product, location, timestamps, usage quantity, rebilling settings, client invoice, and payment status before opening a ticket.\n\nDo not compare the agency card statement directly with client invoices and assume every timing difference is loss. Wallet funding, usage posting, rebilling, payment processing, taxes, and failed collections can settle on different dates. Reconcile by event and client, then compare monthly totals.",
    },
    {
      h2: "Build the cost map before selling",
      body: "Create one row for every variable product: email, SMS and MMS, phone minutes, number rental, A2P registration, AI text, voice AI, premium workflow actions, branded apps, support upgrades, compliance add-ons, and any external provider. Record the unit, current published price, funding wallet, free allowance, rebilling eligibility, markup eligibility, tax treatment, and owner.\n\nNext, model low, expected, and high usage for one client. Averages alone hide burst risk: one imported campaign or runaway workflow can consume far more than a quiet month. Define alerts at both the client and agency level. The agency should know which account caused an auto-refill before the card statement arrives.\n\nFinally, match the commercial promise to the cost behavior. A flat plan can include a stated fair-use allowance with overage treatment. A pass-through plan can show provider cost separately. A managed plan can include a buffer that pays for monitoring and collection risk. Whatever the model, disclose it. Calling variable usage *included* without a boundary turns the agency into the insurer of every client's behavior.",
    },
    {
      h2: "The monthly reconciliation checklist",
      body: "Export or review wallet transactions and group them by product and sub-account. Compare quantities with provider or HighLevel usage records. Match eligible rebilling to client invoices or wallet deductions. Separate successful collection, pending settlement, failed payment, refund, credit, tax, and processor fee.\n\nInvestigate the largest month-over-month movements first. Ask whether the client count changed, a campaign launched, an AI feature was enabled, a workflow looped, or a refill threshold was altered. Set a review trigger for any account whose usage exceeds its allowance or historical range.\n\nKeep a reserve for timing and collection risk. If the agency funds usage before charging the client, the agency is extending short-term credit even when rebilling is automated. Define what happens when a client card fails: pause variable services, draw from a prepaid balance, notify the client, or absorb a limited grace amount.\n\nUpdate pricing references from official documentation because rates and product packaging change. A calculator based on last year's screenshots can be precise and still wrong. Use [the GoHighLevel cost calculator](/tools/gohighlevel-cost-calculator) as a model, then verify current in-app rates for the account.",
    },
    {
      h2: "Where SeldonFrame helps",
      body: "SeldonFrame helps eligible agencies through a BYOK model in which provider usage can be billed in the agency's own provider accounts. That can make the path from client action to provider event and cost more direct, and it avoids treating a platform wallet as the only source of truth. A focused front-office package also gives the agency fewer variable product categories to model than a broad marketing suite.\n\nAgency plans provide client-workspace economics separately from the own-business Builder tier, so an agency can price workspace capacity and provider consumption as distinct layers. This is useful when the offer is AI answering, booking, and service-business follow-up rather than a large catalog of add-ons.\n\nDirect billing is not automatically simpler for everyone. It is most helpful for agencies willing to manage provider accounts, assign usage, set alerts, and explain variable cost. The gain is control and observability, not the disappearance of cost.",
    },
    {
      h2: "Where SeldonFrame cannot help",
      body: "SeldonFrame cannot make phone, SMS, email, AI, domains, or other provider usage free. It cannot prevent a badly designed workflow from consuming resources, guarantee a client will pay, or remove taxes and processor fees. BYOK can move charges closer to the agency, which means credentials, balances, limits, security, and provider support become direct agency responsibilities.\n\nIt is not a substitute for HighLevel if the agency depends on SaaS configurator behavior, deep rebilling automation, markup controls, branded mobile apps, or the broader product catalog. Those capabilities may justify the HighLevel plan when they are used and priced correctly.\n\nDo not switch based on a card-statement surprise before reconciling it. A platform migration will not repair an unlimited offer or missing usage policy. First identify the event, responsible client, collection path, and contractual treatment. Then compare the total operating model in [hidden GoHighLevel fees](/guides/hidden-gohighlevel-fees) and the narrower SeldonFrame alternative.",
    },
  ],
  faq: [
    { q: "Why is my GoHighLevel agency wallet charged when a client has a card?", a: "The agency wallet can fund consumption at the time of use, while eligible rebilling recovers the amount through a separate client charge. Check product-specific rebilling settings, client payment status, and transaction timing before treating the charge as unrecovered." },
    { q: "Does GoHighLevel rebilling include markup?", a: "Markup availability depends on the agency plan and product rules. HighLevel's current pricing and rebilling documentation should be checked before quoting a margin because plan packaging and eligible products can change." },
    { q: "How do I prevent surprise GoHighLevel usage costs?", a: "Map every variable product, set client and agency alerts, define allowances and overages, monitor auto-refills, reconcile by sub-account monthly, and establish a failed-payment policy. Do not rely on the base subscription as the total cost." },
    { q: "Does SeldonFrame eliminate usage billing?", a: "No. Eligible plans can use direct provider credentials for clearer cost attribution, but communication and AI providers still charge for consumption. The agency must monitor and price those costs." },
  ],
  sources: [
    { label: "HighLevel — Pricing and billing guide", url: "https://help.gohighlevel.com/support/solutions/articles/155000001156-highlevel-pricing-guide" },
    { label: "HighLevel — Rebilling, reselling, and wallets explained", url: "https://help.gohighlevel.com/support/solutions/articles/155000002095-rebilling-reselling-and-wallets-explained" },
    { label: "Reddit — Agency discussion of email usage charged to the agency wallet", url: "https://www.reddit.com/r/gohighlevel/comments/1qk2qay/ghl_still_charging_our_agency_for_email_usage/" },
    { label: "G2 — HighLevel review synthesis", url: "https://www.g2.com/products/highlevel/reviews?qs=pros-and-cons" },
  ],
};

