// Shared marketing-homepage copy constants.
//
// Extracted from app/(public)/page.tsx so the SAME positioning line is the
// single source for both the human HTML homepage (PublicHomePage metadata +
// hero) and its agent-Markdown twin (/home.md → renderHomeMarkdown). Keeping it
// here — a plain, dependency-free module — lets the pure Markdown renderer import
// the line WITHOUT pulling the server page component (and its auth() call) into
// its module graph.

import { AGENCY_POSITIONING, AGENCY_HERO_SUBHEAD } from "@/lib/marketing/public-claims";

/** The one-line product positioning used in the homepage metadata/description
 *  and quoted verbatim at the top of /home.md. */
export const POSITIONING_ONE_LINER = `${AGENCY_POSITIONING} ${AGENCY_HERO_SUBHEAD}`;
