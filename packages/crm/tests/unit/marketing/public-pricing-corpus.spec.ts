import test from "node:test";
import assert from "node:assert/strict";

import { LandingMarketingFaqSection } from "../../../src/components/landing/marketing-faq-section";
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

test("core marketing surfaces use the shared Builder and Agency pricing boundaries", async () => {
  const faq = collectText(LandingMarketingFaqSection()).join(" ");
  const agencyPricing = collectText(LandingMarketingPricingSection({ tierLadderOn: true })).join(" ");
  const builderPricing = collectText(LandingMarketingPricingSection()).join(" ");
  const receptionist = collectText(await AiReceptionistCostCalculatorPage()).join(" ");
  const gohighlevel = collectText(await GohighlevelCostCalculatorPage()).join(" ");
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

  for (const [name, text] of [
    ["faq", faq],
    ["agency pricing", agencyPricing],
    ["builder pricing", builderPricing],
    ["AI receptionist calculator", receptionist],
    ["GoHighLevel calculator", gohighlevel],
  ] as const) {
    const result = auditPublicPricingText(text);
    assert.equal(result.ok, true, `${name} has a misleading Builder/Agency claim: ${result.reasons.join("; ")}`);
  }

  assert.match(faq, new RegExp(AGENCY_PRICING_CLAIM.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(builderPricing, /Builder is \$29\/mo for businesses you own and operate/i);
});

test("every registered guide that mentions Builder pricing passes the semantic audit", () => {
  const builderPricePattern = /\$\s*29\b|\b29(?:\.00)?\s+dollars?\b|\btwenty[-\s]nine\s+dollars?/i;

  for (const guide of GUIDES) {
    const markdown = renderGuideMarkdown(guide.slug);
    const text = [
      guide.title,
      guide.description,
      guide.dek,
      ...guide.sections.flatMap((section) => [section.h2, section.body, section.callout?.text ?? ""]),
      ...guide.faq.flatMap((faq) => [faq.q, faq.a]),
    ]
      .concat(markdown)
      .join(" ");
    if (!builderPricePattern.test(text)) continue;

    const result = auditPublicPricingText(text);
    assert.equal(result.ok, true, `${guide.slug} has a misleading Builder/Agency claim: ${result.reasons.join("; ")}`);
  }
});

test("agency-intent guides keep Builder pricing separate from client resale", () => {
  const agencyIntentSlugs = [
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
    "gpt-store-alternative-for-developers",
  ] as const;

  for (const slug of agencyIntentSlugs) {
    const guide = getGuide(slug);
    const markdown = renderGuideMarkdown(slug);
    const text = [
      guide.title,
      guide.description,
      guide.dek,
      ...guide.sections.flatMap((section) => [section.h2, section.body, section.callout?.text ?? ""]),
      ...guide.faq.flatMap((faq) => [faq.q, faq.a]),
    ].concat(markdown).join(" ");
    const result = auditPublicPricingText(text);
    assert.equal(result.ok, true, `${slug} has a misleading Builder/Agency claim: ${result.reasons.join("; ")}`);
  }
});
