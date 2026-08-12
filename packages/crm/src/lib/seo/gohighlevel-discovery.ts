import { getGuide, type Guide } from "./guides";

const BASE_URL = "https://www.seldonframe.com";

export const GOHIGHLEVEL_COLLECTION_PATH = "/guides/gohighlevel";
export const GOHIGHLEVEL_COLLECTION_MARKDOWN_PATH = "/guides/gohighlevel.md";
export const GOHIGHLEVEL_COLLECTION_TITLE = "GoHighLevel Agency Troubleshooting and Migration Guides";
export const GOHIGHLEVEL_COLLECTION_DESCRIPTION =
  "Diagnose GoHighLevel agency problems, understand the real cost, compare alternatives honestly, and plan migration or offboarding without guessing.";
export const GOHIGHLEVEL_COLLECTION_INTRO =
  "Use this collection to identify whether a GoHighLevel problem belongs to HighLevel, your configuration, an external provider, or the agency model itself before you decide to fix the stack, migrate, or keep it.";

export const GOHIGHLEVEL_DIAGNOSTIC_SLUGS = [
  "gohighlevel-client-onboarding-takes-too-long",
  "gohighlevel-agency-model-not-passive-saas",
  "gohighlevel-support-problems",
  "gohighlevel-bugs-and-outages",
  "why-gohighlevel-emails-go-to-spam",
  "gohighlevel-sms-not-delivering",
  "gohighlevel-wallets-and-rebilling",
  "gohighlevel-workflow-problems",
  "can-you-export-gohighlevel",
  "who-owns-a-gohighlevel-subaccount",
] as const;

type DiscoveryGroupSpec = {
  id: "diagnose" | "economics" | "compare" | "migration";
  heading: string;
  description: string;
  slugs: readonly string[];
};

export const GOHIGHLEVEL_COLLECTION_GROUPS: readonly DiscoveryGroupSpec[] = [
  {
    id: "diagnose",
    heading: "Diagnose an operating problem",
    description:
      "Start with the symptom. These field guides separate platform behavior from configuration, provider, compliance, and agency-process failures.",
    slugs: GOHIGHLEVEL_DIAGNOSTIC_SLUGS,
  },
  {
    id: "economics",
    heading: "Understand pricing and agency economics",
    description:
      "Model the base plan, per-location add-ons, usage, support work, and the margin implications before treating the sticker price as total cost.",
    slugs: [
      "how-much-does-gohighlevel-cost",
      "gohighlevel-pricing-plans-explained",
      "hidden-gohighlevel-fees",
      "is-gohighlevel-ai-employee-worth-it",
      "gohighlevel-saas-mode-vs-flat-pricing",
      "why-agencies-leave-gohighlevel",
    ],
  },
  {
    id: "compare",
    heading: "Compare the alternatives honestly",
    description:
      "Compare by operating model and client need. GoHighLevel remains strong for deep funnels, campaigns, snapshots, and its implementation ecosystem.",
    slugs: [
      "gohighlevel-vs-seldonframe",
      "gohighlevel-vs-hubspot",
      "best-gohighlevel-alternatives",
      "best-gohighlevel-alternative-for-solopreneurs",
      "is-gohighlevel-worth-it-for-small-business",
    ],
  },
  {
    id: "migration",
    heading: "Plan migration, ownership, and portability",
    description:
      "Inventory the assets, provider accounts, transfer authority, and operational gaps before cancelling or promising a clean handoff.",
    slugs: [
      "can-you-export-gohighlevel",
      "who-owns-a-gohighlevel-subaccount",
      "how-to-switch-from-gohighlevel",
      "how-to-replace-gohighlevel",
      "do-i-need-gohighlevel",
    ],
  },
] as const;

export type ResolvedGohighlevelGroup = Omit<DiscoveryGroupSpec, "slugs"> & { guides: Guide[] };

const diagnosticSlugSet = new Set<string>(GOHIGHLEVEL_DIAGNOSTIC_SLUGS);

export function isGohighlevelDiagnostic(slug: string): boolean {
  return diagnosticSlugSet.has(slug);
}

export function resolvedGohighlevelGroups(): ResolvedGohighlevelGroup[] {
  return GOHIGHLEVEL_COLLECTION_GROUPS.map(({ slugs, ...group }) => ({
    ...group,
    guides: slugs.map((slug) => getGuide(slug)),
  }));
}

export function gohighlevelDiagnosticSiblings(slug: string, limit = 3): Guide[] {
  const currentIndex = GOHIGHLEVEL_DIAGNOSTIC_SLUGS.findIndex((candidate) => candidate === slug);
  if (currentIndex === -1 || limit <= 0) return [];

  const siblingCount = Math.min(limit, GOHIGHLEVEL_DIAGNOSTIC_SLUGS.length - 1);
  return Array.from({ length: siblingCount }, (_, index) => {
    const nextIndex = (currentIndex + index + 1) % GOHIGHLEVEL_DIAGNOSTIC_SLUGS.length;
    return getGuide(GOHIGHLEVEL_DIAGNOSTIC_SLUGS[nextIndex]);
  });
}

export function renderGohighlevelCollectionMarkdown(): string {
  const lines = [
    `# ${GOHIGHLEVEL_COLLECTION_TITLE}`,
    "",
    GOHIGHLEVEL_COLLECTION_INTRO,
    "",
    `HTML version: ${BASE_URL}${GOHIGHLEVEL_COLLECTION_PATH}`,
    "",
  ];

  for (const group of resolvedGohighlevelGroups()) {
    lines.push(`## ${group.heading}`, "", group.description, "");
    for (const guide of group.guides) {
      lines.push(`- [${guide.title}](${BASE_URL}/guides/${guide.slug}) — ${guide.description}`);
    }
    lines.push("");
  }

  lines.push(
    "## Useful decision tools",
    "",
    `- [Compare SeldonFrame and GoHighLevel](${BASE_URL}/alternative-to-gohighlevel)`,
    `- [Calculate your GoHighLevel agency cost](${BASE_URL}/tools/gohighlevel-cost-calculator)`,
    "",
    "SeldonFrame is a focused AI-front-office alternative for agencies serving local businesses. It is not a replacement for every HighLevel funnel, campaign, snapshot, or ecosystem workflow.",
    "",
  );

  return lines.join("\n");
}
