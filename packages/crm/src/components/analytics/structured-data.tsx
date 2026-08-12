// Structured data (JSON-LD) for SeldonFrame's marketing surface.
//
// Renders Organization + WebSite + SoftwareApplication schema as
// `<script type="application/ld+json">` blocks. AI engines
// (Perplexity, ChatGPT Search, Claude Search, Google AI Overview)
// extract these to anchor entity definitions and citation links.
//
// Host-aware, like the GoogleAnalytics component:
//   1. seldonframe.com / www.seldonframe.com (marketing) → render ✅
//   2. app.seldonframe.com (operator dashboard)          → SKIP ❌
//   3. <slug>.app.seldonframe.com (workspace subdomains) → SKIP ❌
//   4. localhost / preview deploys                       → SKIP ❌
//
// Why we don't render on app.seldonframe.com or workspaces:
//   - The operator dashboard isn't the marketing entity; injecting
//     SoftwareApplication schema there confuses crawlers about which
//     URL is canonical for the product page.
//   - Workspace subdomains represent the operator's business
//     (HVAC contractor, dental practice, etc.), not SeldonFrame.
//     Those workspaces ship their own LocalBusiness schema generated
//     per workspace — not SeldonFrame's Organization schema.
//
// Product facts come from the same dependency-free public claims module used by
// the homepage and docs. That prevents stale JSON-LD from silently advertising
// a retired pricing ladder after the visible product has moved on.

import {
  AGENCY_PLAN_FACTS,
  AGENCY_POSITIONING,
  LICENSE_LABEL,
} from "@/lib/marketing/public-claims";

const MARKETING_ORIGIN = "https://www.seldonframe.com";
const ORGANIZATION_ID = `${MARKETING_ORIGIN}/#org`;

/**
 * Allowlist of hosts where the SeldonFrame-marketing JSON-LD is
 * safe to render. Mirrors GA_ALLOWED_HOSTS in google-analytics.tsx.
 */
const STRUCTURED_DATA_ALLOWED_HOSTS = new Set<string>([
  "seldonframe.com",
  "www.seldonframe.com",
]);

/**
 * Decide whether to inject SeldonFrame-marketing JSON-LD based on
 * the request host. Called from the root layout server-side
 * (via next/headers).
 *
 * NOTE: stricter than GA's allowlist. GA includes
 * app.seldonframe.com (we want analytics on the dashboard too).
 * Structured data does NOT include the dashboard — the dashboard
 * is not the marketing entity.
 */
export function shouldRenderMarketingStructuredData(host: string): boolean {
  const cleanHost = host.split(":")[0].toLowerCase();
  return STRUCTURED_DATA_ALLOWED_HOSTS.has(cleanHost);
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "SeldonFrame",
  url: MARKETING_ORIGIN,
  logo: `${MARKETING_ORIGIN}/brand/seldonframe-icon.svg`,
  description: AGENCY_POSITIONING,
  sameAs: [
    "https://github.com/seldonframe/seldonframe",
    "https://www.npmjs.com/package/@seldonframe/mcp",
    "https://x.com/seldonframe",
    "https://discord.gg/sbVUu976NW",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${MARKETING_ORIGIN}/#website`,
  name: "SeldonFrame",
  url: MARKETING_ORIGIN,
  publisher: { "@id": ORGANIZATION_ID },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${MARKETING_ORIGIN}/#software`,
  name: "SeldonFrame",
  applicationCategory: "BusinessApplication",
  operatingSystem: `Web, Self-hosted (${LICENSE_LABEL})`,
  description: AGENCY_POSITIONING,
  offers: AGENCY_PLAN_FACTS.map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    price: String(plan.priceMonthly),
    priceCurrency: "USD",
    description: plan.audience,
    url: `${MARKETING_ORIGIN}/pricing?plan=${plan.id}`,
  })),
  provider: { "@id": ORGANIZATION_ID },
  url: MARKETING_ORIGIN,
};

/**
 * Renders the three SeldonFrame-marketing JSON-LD scripts.
 *
 * Caller is responsible for the host-allowlist check via
 * `shouldRenderMarketingStructuredData()`. This component is rendered
 * unconditionally once that check passes.
 */
export function MarketingStructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
    </>
  );
}
