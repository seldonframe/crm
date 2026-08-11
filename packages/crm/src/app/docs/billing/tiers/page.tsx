// v1.30.2 — Docs article: Plan tiers.

import { ArticleShell, InAppLink } from "../../article-shell";

export default function Page() {
  return (
    <ArticleShell
      category="Billing & plans"
      categoryHref="/docs"
      title="Plan tiers"
      lede="What's included at each plan and what triggers a move up. Choose Builder or Managed for your own operation; choose Agency when you deploy client workspaces."
      githubPath="app/docs/billing/tiers/page.tsx"
    >
      <h2>Builder ($29/mo)</h2>
      <ul>
        <li>Up to 10 landing pages</li>
        <li>Your own custom domain</li>
        <li>Your branding (logo, colors, fonts)</li>
        <li>Edit your whole site by chatting — no code</li>
        <li>Bring your own AI key at provider cost</li>
        <li>Full CRM, booking, intake, and AI agents for businesses you operate</li>
        <li>Community support (Discord)</li>
      </ul>

      <h2>Managed ($49/mo)</h2>
      <ul>
        <li>One full AI front office: website + booking + intake + CRM + chatbot</li>
        <li>Custom domain + your branding</li>
        <li>Full CRM — contacts, deals, custom fields, kanban, customer portal</li>
        <li>Booking page + intake forms, wired to the CRM</li>
        <li>Website chatbot that books against the real calendar</li>
        <li>Missed-call text-back so you never lose a lead</li>
        <li>Managed AI on SeldonFrame's keys under fair use</li>
        <li>Email support (24h response)</li>
      </ul>

      <h2>Agency Starter ($99/mo)</h2>
      <ul>
        <li>10 client workspaces included</li>
        <li>White-label brand (your name + logo across the dashboard your clients see)</li>
        <li>Per-workspace custom domains</li>
        <li>0% GMV on agency resale</li>
        <li>BYOK AI at provider cost</li>
      </ul>

      <h2>Agency Growth ($199/mo) and Agency Scale ($299/mo)</h2>
      <ul>
        <li>Growth includes 30 client sub-accounts and one-click deploy operations.</li>
        <li>Scale includes unlimited client sub-accounts, API + MCP access, and marketplace rent-out.</li>
        <li>Both plans include full white-label, branded client portals, and 0% GMV.</li>
      </ul>

      <h2>What triggers a move up</h2>
      <ul>
        <li>Wanting SeldonFrame-managed AI instead of your own provider key (Builder → Managed).</li>
        <li>Wanting to white-label and resell to clients (→ Agency Starter).</li>
        <li>Going past 10 client workspaces (Agency Starter → Agency Growth).</li>
        <li>Going past 30 client workspaces or needing API/MCP and marketplace access (Agency Growth → Agency Scale).</li>
      </ul>

      <h2>Switching tiers</h2>
      <p>
        <InAppLink href="/settings/billing">Settings → Billing</InAppLink> →
        pick a new tier. Upgrades are immediate; downgrades take effect
        at the end of the current billing period. Stripe handles the
        proration.
      </p>

      <h2>Next</h2>
      <ul>
        <li><InAppLink href="/docs/billing/pricing">Pricing</InAppLink></li>
        <li><InAppLink href="/docs/billing/invoices">Invoices & receipts</InAppLink></li>
      </ul>
    </ArticleShell>
  );
}
