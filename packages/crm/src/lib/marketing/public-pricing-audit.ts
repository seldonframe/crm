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
  /\$\s*29(?:\.00)?(?!\d)(?:\s*(?:\/\s*mo|a\s+month))?|\b29(?:\.00)?\s+dollars?\b|\btwenty[-\s]nine\s+dollars?\b/gi;
const BUILDER_PRICE_TOKEN_PATTERN =
  /\$\s*29(?:\.00)?(?!\d)(?:\s*(?:\/\s*mo|a\s+month))?|\b29(?:\.00)?\s+dollars?\b|\btwenty[-\s]nine\s+dollars?\b/i;
const PRODUCT_PATTERN = /\b(?:seldonframe|builder)\b/i;
const RESALE_PATTERN =
  /\b(?:agency|white[-\s]?label(?:ed|ing)?|resell(?:ing)?|resale|sub[-\s]?accounts?|client\s+(?:accounts?|portals?|sub[-\s]?accounts?|workspaces?)|(?:sell|selling)\s+(?:to|for)\s+clients?)\b/i;
const EXPLICIT_EXCLUSION_PATTERN =
  /\bdoes\s+not\s+include\b|\bdoesn't\s+include\b|\bnot\s+for\s+(?:resale|clients?)\b|\bwithout\s+(?:white[-\s]?label|client\s+(?:accounts?|portals?|workspaces?|resale))\b|\bwith\s+no\s+(?:client\s+(?:sub[-\s]?accounts?|accounts?|portals?|workspaces?)|white[-\s]?label)\b|\bno\s+client\s+(?:resale|sub[-\s]?accounts?|accounts?|portals?|workspaces?)\b/i;
const OWN_BUSINESS_PATTERN =
  /\bown[-\s]business(?:es)?\b|\byour\s+own\s+business(?:es)?\b|\bown\s+workspace(?:s)?\b|\byour\s+own\s+workspace(?:s)?\b|\bbusiness(?:es)?\s+(?:you|the\s+operator|they)\s+own\b|\bbusiness(?:es)?\s+you\s+own\s+and\s+operate\b|\bbusiness\s+you\s+operate(?:\s+yourself)?\b|\boperate\s+(?:it|them|yourself)\s+yourself\b/i;
const SENTENCE_BOUNDARY_PATTERN = /[.!?\n]/g;
const AGENCY_PRICE_PATTERN = /\$\s*(?:99|199|299)(?!\d)|\b(?:99|199|299)\s+dollars?\b/i;
const AGENCY_RANGE_PATTERN = /\$\s*99\s*[-–—]\s*\$\s*299|\b99\s*(?:to|through)\s*299\s+dollars?\b/i;
const AGENCY_LADDER_PATTERN =
  /\bagency\s+(?:starter|growth|scale|plans?)\b[^.!?\n]{0,180}(?:\$\s*(?:99|199|299)(?!\d)|\b(?:99|199|299)\s+dollars?\b)|(?:\$\s*(?:99|199|299)(?!\d)|\b(?:99|199|299)\s+dollars?\b)[^.!?\n]{0,180}\bagency\s+(?:starter|growth|scale|plans?)\b/i;
const POSITIVE_RESALE_VERB_PATTERN =
  /\b(?:is|are|include|includes|included|available|supported|offered|provided|comes\s+with|has|supports|offers)\b/i;

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function rangeAround(text: string, start: number, end: number, boundaries: RegExp): string {
  let rangeStart = 0;
  let rangeEnd = text.length;

  for (const boundary of text.matchAll(boundaries)) {
    const index = boundary.index ?? 0;
    if (index < start) {
      rangeStart = index + 1;
      continue;
    }
    if (index >= end) {
      rangeEnd = index;
      break;
    }
  }

  return text.slice(rangeStart, rangeEnd);
}

function nextSentence(text: string, end: number): string {
  const boundaryOffset = text.slice(end).search(/[.!?\n]/);
  if (boundaryOffset < 0) return "";
  const nextStart = text.slice(end + boundaryOffset + 1).search(/\S/);
  if (nextStart < 0) return "";
  const absoluteStart = end + boundaryOffset + 1 + nextStart;
  const nextEnd = text.slice(absoluteStart).search(/[.!?\n]/);
  return text.slice(absoluteStart, nextEnd < 0 ? text.length : absoluteStart + nextEnd);
}

function nextSemicolonClause(text: string, end: number): string {
  const semicolonOffset = text.slice(end).indexOf(";");
  if (semicolonOffset < 0) return "";
  const clauseStart = end + semicolonOffset + 1;
  const firstContent = text.slice(clauseStart).search(/\S/);
  if (firstContent < 0) return "";
  const absoluteStart = clauseStart + firstContent;
  const nextBoundary = text.slice(absoluteStart).search(/[.!?;\n]/);
  return text.slice(absoluteStart, nextBoundary < 0 ? text.length : absoluteStart + nextBoundary);
}

function currentClause(text: string, start: number, end: number): string {
  return rangeAround(text, start, end, /[.!?;\n]/g);
}

function boundedContext(text: string, start: number, end: number): string {
  return text.slice(Math.max(0, start - 180), Math.min(text.length, end + 180));
}

/**
 * A `$29` token is considered only when SeldonFrame or Builder appears in the
 * same bounded context. Agency/resale language must be resolved in the same
 * price sentence: either an explicit Builder exclusion, an own-business
 * disclosure, or a named Agency tier with its $99/$199/$299 ladder. A
 * competitor-only sentence never enters the audit.
 */
export function auditPublicPricingText(text: string): PublicPricingAudit {
  const normalized = normalize(text);
  const reasons: string[] = [];

  for (const match of normalized.matchAll(BUILDER_PRICE_PATTERN)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const sentence = rangeAround(normalized, start, end, SENTENCE_BOUNDARY_PATTERN);
    const context = boundedContext(normalized, start, end);
    const followingSentence = nextSentence(normalized, end);
    const priceClause = currentClause(normalized, start, end);
    const followingSemicolonClause = nextSemicolonClause(normalized, end);

    // Resale language must be in the price sentence or the immediately
    // following sentence. A broad window is used only for product identity;
    // otherwise a long pricing card can borrow unrelated "client" copy.
    if (/\bgohighlevel\b/i.test(sentence) && !/\b(?:seldonframe|builder)\b/i.test(sentence)) continue;
    if (!PRODUCT_PATTERN.test(context) || (!RESALE_PATTERN.test(sentence) && !RESALE_PATTERN.test(followingSentence))) continue;

    const exclusionMatch = sentence.match(EXPLICIT_EXCLUSION_PATTERN);
    const beforeExclusion = exclusionMatch?.index === undefined
      ? sentence
      : sentence.slice(0, exclusionMatch.index);
    const hasPositiveResaleBeforeExclusion = RESALE_PATTERN.test(
      beforeExclusion.replace(/\bagency\s+platform\s+fee\b/gi, ""),
    );
    const exclusionTail = exclusionMatch?.index === undefined ? "" : sentence.slice(exclusionMatch.index + exclusionMatch[0].length);
    const hasContradictoryResale =
      RESALE_PATTERN.test(exclusionTail) &&
      (/(?:\bbut\b|\bhowever\b|;)/i.test(exclusionTail) || POSITIVE_RESALE_VERB_PATTERN.test(exclusionTail));
    const tiedExclusion =
      BUILDER_PRICE_TOKEN_PATTERN.test(sentence) &&
      /\b(?:builder|seldonframe)\b/i.test(sentence) &&
      Boolean(exclusionMatch) &&
      !hasPositiveResaleBeforeExclusion &&
      !hasContradictoryResale;
    const builderClause = sentence.split(";")[0];
    const builderClauseHasResale = RESALE_PATTERN.test(builderClause) && !EXPLICIT_EXCLUSION_PATTERN.test(builderClause);
    const ownBusinessOnly =
      OWN_BUSINESS_PATTERN.test(sentence) &&
      !hasPositiveResaleBeforeExclusion &&
      !RESALE_PATTERN.test(followingSentence) &&
      !AGENCY_LADDER_PATTERN.test(sentence);
    const directAgencyLadder =
      BUILDER_PRICE_TOKEN_PATTERN.test(sentence) &&
      /\bagenc(?:y|ies)\b/i.test(sentence) &&
      (AGENCY_PRICE_PATTERN.test(sentence) || AGENCY_RANGE_PATTERN.test(sentence)) &&
      !builderClauseHasResale;
    const followingBuilderExclusion =
      /^(?:this\s+builder\b|builder\b|it\s+does\s+not\s+include\b)/i.test(followingSentence.trim()) &&
      EXPLICIT_EXCLUSION_PATTERN.test(followingSentence) &&
      !RESALE_PATTERN.test(sentence);
    const adjacentAgencyLadder =
      /^agency\s+(?:starter|growth|scale|plans?)\b/i.test(followingSentence.trim()) &&
      AGENCY_PRICE_PATTERN.test(followingSentence) &&
      !RESALE_PATTERN.test(sentence);
    // A paired Builder/Agency distinction is valid only when it is written as
    // adjacent semicolon-separated clauses. Do not let an unrelated own-
    // business sentence and Agency price somewhere in the broad identity
    // context rescue a Builder claim that promises resale.
    const explicitPairedDistinction =
      OWN_BUSINESS_PATTERN.test(priceClause) &&
      !RESALE_PATTERN.test(priceClause) &&
      /^agency\s+(?:starter|growth|scale|plans?)\b/i.test(followingSemicolonClause.trim()) &&
      (AGENCY_PRICE_PATTERN.test(followingSemicolonClause) || AGENCY_RANGE_PATTERN.test(followingSemicolonClause));

    if (tiedExclusion || ownBusinessOnly || directAgencyLadder || adjacentAgencyLadder || followingBuilderExclusion || explicitPairedDistinction) continue;

    reasons.push(
      `Builder pricing near ${match[0]} is paired with agency or resale language without an explicit Agency pricing or capability boundary.`,
    );
  }

  return { ok: reasons.length === 0, reasons };
}
