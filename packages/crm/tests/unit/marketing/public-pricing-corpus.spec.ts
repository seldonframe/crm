import test from "node:test";
import assert from "node:assert/strict";

import { LandingMarketingFaqSection } from "../../../src/components/landing/marketing-faq-section";
import { MarketingFaq } from "../../../src/components/marketing/faq";
import TermsPage from "../../../src/app/terms/page";
import { LandingMarketingPricingSection } from "../../../src/components/landing/marketing-pricing-section";
import AiReceptionistCostCalculatorPage from "../../../src/app/(public)/tools/ai-receptionist-cost-calculator/page";
import GohighlevelCostCalculatorPage from "../../../src/app/(public)/tools/gohighlevel-cost-calculator/page";
import { AGENCY_PRICING_CLAIM } from "../../../src/lib/marketing/public-claims";
import { auditPublicPricingText } from "../../../src/lib/marketing/public-pricing-audit";
import { GUIDES, getGuide } from "../../../src/lib/seo/guides";
import { renderGuideMarkdown } from "../../../src/lib/seo/guide-markdown";

function collectText(node: unknown, out: string[] = []): string[] {
  if (typeof node === "string" || typeof node === "number") {
    out.push(String(node));
    return out;
  }
  if (!node || typeof node !== "object") return out;
  const props = (node as { props?: { children?: unknown; dangerouslySetInnerHTML?: { __html?: string } } }).props;
  const html = props?.dangerouslySetInnerHTML?.__html;
  if (html) out.push(html.replace(/<[^>]+>/g, " "));
  const children = props?.children;
  if (Array.isArray(children)) {
    for (const child of children) collectText(child, out);
  } else {
    collectText(children, out);
  }
  return out;
}

function collectLinks(node: unknown, out: string[] = []): string[] {
  if (!node || typeof node !== "object") return out;
  const props = (node as { props?: { href?: unknown; children?: unknown } }).props;
  if (typeof props?.href === "string") out.push(props.href);
  const children = props?.children;
  if (Array.isArray(children)) {
    for (const child of children) collectLinks(child, out);
  } else {
    collectLinks(children, out);
  }
  return out;
}

function splitCopy(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

test("core marketing surfaces use the shared Builder and Agency pricing boundaries", async () => {
  const faqParts = collectText(LandingMarketingFaqSection());
  const agencyPricingParts = collectText(LandingMarketingPricingSection({ tierLadderOn: true }));
  const builderPricingParts = collectText(LandingMarketingPricingSection());
  const receptionistParts = collectText(await AiReceptionistCostCalculatorPage());
  const gohighlevelParts = collectText(await GohighlevelCostCalculatorPage());
  const faq = faqParts.join(" ");
  const agencyPricing = agencyPricingParts.join(" ");
  const builderPricing = builderPricingParts.join(" ");
  const receptionist = receptionistParts.join(" ");
  const gohighlevel = gohighlevelParts.join(" ");
  const receptionistLinks = collectLinks(await AiReceptionistCostCalculatorPage());
  const gohighlevelLinks = collectLinks(await GohighlevelCostCalculatorPage());

  assert.match(faq, /\$99\/mo/);
  assert.match(agencyPricing, /\$99/);
  assert.match(receptionist, /\$99/);
  assert.match(gohighlevel, /\$99/);
  assert.ok(receptionistLinks.includes("/pricing?plan=agency_starter"));
  assert.ok(gohighlevelLinks.includes("/pricing?plan=agency_starter"));
  assert.match(builderPricing, /\$29/);
  assert.match(builderPricing, /own/i);

  for (const [name] of [
    ["faq"],
    ["agency pricing"],
    ["builder pricing"],
    ["AI receptionist calculator"],
    ["GoHighLevel calculator"],
  ] as const) {
    const parts = name === "faq" ? faqParts : name === "agency pricing" ? agencyPricingParts : name === "builder pricing" ? builderPricingParts : name === "AI receptionist calculator" ? receptionistParts : gohighlevelParts;
    for (const part of parts) {
      const result = auditPublicPricingText(part);
      assert.equal(result.ok, true, `${name} has a misleading Builder/Agency claim: ${result.reasons.join("; ")}`);
    }
  }

  assert.match(faq, new RegExp(AGENCY_PRICING_CLAIM.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(builderPricing, /Builder is \$29\/mo for businesses you own and operate/i);
});

test("retained marketing FAQ and terms use the current plan ladder", () => {
  const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
  const faq = normalize(collectText(MarketingFaq()).join(" "));
  const terms = normalize(collectText(TermsPage()).join(" "));

  assert.match(faq, /Builder is \$29\/mo for businesses you own and operate yourself/i);
  assert.match(faq, /Agency plans start at \$99\/mo for 10 client workspaces/i);
  assert.doesNotMatch(faq, /Growth at \$29|Scale at \$99/i);

  assert.match(terms, /Builder is \$29\/mo for businesses you own and operate yourself/i);
  assert.match(terms, /Managed \(\$49\/month for one managed workspace\)/i);
  assert.match(terms, /Agency Starter \(\$99\/month for 10 client workspaces\)/i);
  assert.match(terms, /Agency Growth \(\$199\/month for 30 client workspaces\)/i);
  assert.match(terms, /Agency Scale \(\$299\/month for unlimited client workspaces\)/i);
  assert.doesNotMatch(terms, /Growth \(\$29\/month|Scale \(\$99\/month/i);
  assert.match(terms, /GNU Affero General Public License, version 3 \(AGPL-3\.0\)/i);
  assert.doesNotMatch(terms, /Business Source License|competing hosted service/i);
});

test("every registered guide that mentions Builder pricing passes the semantic audit", () => {
  const builderPricePattern = /\$\s*29\b|\b29(?:\.00)?\s+dollars?\b|\btwenty[-\s]nine\s+dollars?/i;

  for (const guide of GUIDES) {
    const markdown = renderGuideMarkdown(guide.slug);
    const chunks = [
      guide.title,
      guide.description,
      guide.dek,
      ...guide.sections.flatMap((section) => [section.h2, ...splitCopy(section.body), section.callout?.text ?? ""]),
      ...guide.faq.flatMap((faq) => [faq.q, faq.a]),
    ]
      .flatMap(splitCopy)
      .concat(markdown.split(/\r?\n/).flatMap(splitCopy));
    for (const text of chunks) {
      if (!builderPricePattern.test(text)) continue;
      const result = auditPublicPricingText(text);
      assert.equal(result.ok, true, `${guide.slug} has a misleading Builder/Agency claim: ${result.reasons.join("; ")}`);
    }
  }
});

test("agency-intent guides keep Builder pricing separate from client resale", () => {
  const agencyIntentSlugs = [
    "best-ai-agent-marketplaces",
    "how-to-build-and-sell-a-speed-to-lead-agent",
    "how-to-rent-out-an-ai-agent-via-mcp",
    "how-to-build-a-review-request-agent",
    "ai-marketplace-fees-compared",
    "how-do-ai-agents-get-paid",
    "how-to-get-ai-agency-clients",
    "how-to-make-money-selling-ai-agents",
    "how-to-price-an-ai-receptionist-service",
    "run-client-ai-on-your-own-keys",
    "why-agencies-leave-gohighlevel",
    "white-label-ai-front-office-without-agency-pro",
    "white-label-ai-agents",
    "ai-agency-pricing-models",
    "client-portals-for-ai-agencies",
    "ai-agent-business-ideas",
    "productized-ai-services",
    "what-to-include-in-an-ai-front-office-package",
    "where-to-sell-ai-agents",
    "selling-ai-services-on-fiverr-vs-owning-your-agent",
    "what-is-an-mcp-marketplace",
    "what-is-byok-ai",
    "gohighlevel-pricing-plans-explained",
    "hidden-gohighlevel-fees",
    "is-gohighlevel-ai-employee-worth-it",
    "gohighlevel-vs-seldonframe",
    "best-gohighlevel-alternative-for-solopreneurs",
    "gohighlevel-vs-hubspot",
    "how-to-replace-gohighlevel",
    "gohighlevel-saas-mode-vs-flat-pricing",
    "why-agencies-leave-gohighlevel",
    "is-gohighlevel-hard-to-learn",
    "how-to-switch-from-gohighlevel",
    "how-to-start-an-ai-automation-agency",
    "how-to-build-an-after-hours-answering-agent",
    "how-to-build-a-missed-call-text-back-agent",
    "gpt-store-alternative-for-developers",
  ] as const;

  for (const slug of agencyIntentSlugs) {
    const guide = getGuide(slug);
    const markdown = renderGuideMarkdown(slug);
    const chunks = [
      guide.title,
      guide.description,
      guide.dek,
      ...guide.sections.flatMap((section) => [section.h2, ...splitCopy(section.body), section.callout?.text ?? ""]),
      ...guide.faq.flatMap((faq) => [faq.q, faq.a]),
    ].concat(markdown.split(/\r?\n/).flatMap(splitCopy));
    for (const text of chunks) {
      const result = auditPublicPricingText(text);
      assert.equal(result.ok, true, `${slug} has a misleading Builder/Agency claim: ${result.reasons.join("; ")}`);
    }
  }
});
