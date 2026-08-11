/**
 * Detects a particularly costly public-copy mistake: presenting the Builder
 * price as if it included agency resale capabilities. This is intentionally a
 * small semantic guard rather than a general-purpose price parser. It is used
 * by content tests to catch regressions while leaving competitor comparisons
 * and historical pricing claims alone.
 */

export type PublicPricingAudit = {
  ok: boolean;
  reasons: string[];
};

const BUILDER_PRICE_PATTERN =
  /\$\s*29(?:\.00)?(?!\d)|\b29(?:\.00)?\s+dollars?\b|\btwenty[-\s]nine\s+dollars?\b/gi;

const PRODUCT_PATTERN = /\b(?:seldonframe|builder)\b/i;

const RESALE_PATTERN =
  /\b(?:agency|white[-\s]?label(?:ed|ing)?|resell(?:ing)?|resale|sub[-\s]?accounts?|client\s+(?:accounts?|portals?|sub[-\s]?accounts?|workspaces?)|(?:sell|selling)\s+(?:to|for)\s+clients?)\b/i;

const AGENCY_DISTINCTION_PATTERN =
  /\bagency\s+starter\b|\$\s*(?:99|199|299)(?!\d)|\bagency\s+plans?\b/i;

const EXPLICIT_EXCLUSION_PATTERN =
  /\bdoes\s+not\s+include\b|\bdoesn't\s+include\b|\bnot\s+for\s+(?:resale|clients?)\b|\bwithout\s+(?:white[-\s]?label|client\s+(?:accounts?|portals?|workspaces?))\b|\bwith\s+no\s+(?:client\s+(?:sub[-\s]?accounts?|accounts?|portals?|workspaces?)|white[-\s]?label)\b|\bown[-\s]business\b/i;

const SENTENCE_BOUNDARY_PATTERN = /[.!?;\n]/g;

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function contextAround(text: string, start: number, end: number): string {
  let sentenceStart = 0;
  let sentenceEnd = text.length;

  for (const boundary of text.matchAll(SENTENCE_BOUNDARY_PATTERN)) {
    const index = boundary.index ?? 0;
    if (index < start) {
      sentenceStart = index + 1;
      continue;
    }
    if (index >= end) {
      sentenceEnd = index;
      break;
    }
  }

  // Include the whole sentence plus a nearby ±180-character window. This
  // catches explicit boundaries after punctuation without making a distant
  // paragraph part of the audit context.
  const startIndex = Math.max(0, Math.min(sentenceStart, start - 180));
  const endIndex = Math.min(text.length, Math.max(sentenceEnd, end + 180));
  return text.slice(startIndex, endIndex);
}

/**
 * Audits SeldonFrame-owned public copy for Builder/Agency pricing confusion.
 *
 * A `$29` token is only considered when SeldonFrame or Builder appears in the
 * same sentence (or nearby 180-character context). Competitor-only passages
 * therefore remain outside this guard. If agency/resale language is present,
 * the copy must either name the Agency ladder or explicitly state that those
 * capabilities are excluded from Builder.
 */
export function auditPublicPricingText(text: string): PublicPricingAudit {
  const normalized = normalize(text);
  const reasons: string[] = [];

  for (const match of normalized.matchAll(BUILDER_PRICE_PATTERN)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const context = contextAround(normalized, start, end);

    if (!PRODUCT_PATTERN.test(context)) {
      continue;
    }

    if (!RESALE_PATTERN.test(context)) {
      continue;
    }

    if (AGENCY_DISTINCTION_PATTERN.test(context) || EXPLICIT_EXCLUSION_PATTERN.test(context)) {
      continue;
    }

    reasons.push(
      `Builder pricing near ${match[0]} is paired with agency or resale language without an explicit Agency pricing or capability boundary.`,
    );
  }

  return { ok: reasons.length === 0, reasons };
}
