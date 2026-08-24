// TDD guardrail for the /guides content-engine registry — unique slugs, every
// lookup resolves, structural minimums (sections/faq/sources), never-lies
// (>=1 real https source per article), valid cluster + related links, and the
// Markdown twin renders for every guide without leaking undefined/null.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  GUIDES,
  CLUSTER_LABELS,
  getGuide,
  allGuideSlugs,
  guidesInCluster,
  populatedClusters,
  type GuideCluster,
} from "../../../src/lib/seo/guides";
import { renderGuideMarkdown } from "../../../src/lib/seo/guide-markdown";
import { stripInlineMarkup } from "../../../src/lib/seo/guide-inline";

const CLUSTERS: ReadonlySet<GuideCluster> = new Set(Object.keys(CLUSTER_LABELS) as GuideCluster[]);

// ─── registry shape ─────────────────────────────────────────────────────────

test("guide slugs are unique", () => {
  const slugs = GUIDES.map((g) => g.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate guide slug");
});

test("slugs are url-safe (lowercase, hyphenated, no spaces)", () => {
  for (const g of GUIDES) {
    assert.match(g.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `bad slug: ${g.slug}`);
  }
});

test("getGuide resolves every slug and throws on unknown", () => {
  for (const g of GUIDES) assert.equal(getGuide(g.slug).slug, g.slug);
  assert.throws(() => getGuide("not-a-real-guide"), /unknown guide slug/);
});

test("AI front office definition guide is answer-first and agency-aware", () => {
  const guide = getGuide("what-is-an-ai-front-office");
  const text = [guide.dek, ...guide.sections.map((section) => section.body), ...guide.faq.map((item) => item.a)].join(" ");

  assert.equal(guide.cluster, "ai-agents");
  assert.match(guide.dek, /AI front office/i);
  assert.match(text, /website/i);
  assert.match(text, /conversations?/i);
  assert.match(text, /CRM|intake/i);
  assert.match(text, /booking/i);
  assert.match(text, /agent/i);
  assert.match(text, /reviews?|follow-up/i);
  assert.match(text, /Disclosure/i);
  assert.match(text, /Builder.*\$29|\$29.*Builder/i);
  assert.match(text, /Agency.*\$99|\$99.*Agency/i);
  assert.match(text, /ai-front-office-examples|AI front office examples/i);
  assert.match(text, /ai-front-office-software-for-agencies|AI front office software/i);
  assert.match(text, /five connected core surfaces/i);
  assert.match(text, /follow-up.*extension/i);
  assert.doesNotMatch(text, /five connected surfaces.*Reviews and follow-up are the close-the-loop extension/i);
});

test("small-business GoHighLevel guide separates Builder from Agency pricing", () => {
  const guide = getGuide("is-gohighlevel-worth-it-for-small-business");
  const text = [guide.dek, ...guide.sections.map((section) => section.body), ...guide.faq.map((item) => item.a)].join(" ");

  assert.match(text, /Builder is \$29\/mo for businesses you own and operate yourself/i);
  assert.match(text, /Agency plans start at \$99\/mo for 10 client workspaces/i);
  assert.match(text, /does not include client sub-accounts or agency resale/i);
  assert.doesNotMatch(text, /SeldonFrame is \*\*\$29 a month, flat\*\*/i);
});

test("AI front office examples guide covers the seven required workflows", () => {
  const guide = getGuide("ai-front-office-examples");
  const requiredWorkflows = [
    "Missed-call recovery",
    "After-hours answering and booking",
    "Speed-to-lead qualification",
    "Quote or estimate intake",
    "Appointment confirmation and no-show reduction",
    "Review requests and response handling",
    "Dormant-customer reactivation",
  ];
  const headings = guide.sections.map((section) => section.h2);
  assert.deepEqual(
    headings.filter((heading) => requiredWorkflows.includes(heading)),
    requiredWorkflows,
    "examples guide should contain exactly the seven required workflow headings",
  );
  for (const workflow of requiredWorkflows) {
    const section = guide.sections.find((candidate) => candidate.h2 === workflow);
    assert.ok(section, `missing workflow section: ${workflow}`);
    assert.match(section.body, /Trigger:/i);
    assert.match(section.body, /Action:/i);
    assert.match(section.body, /System of record:/i);
    assert.match(section.body, /Human handoff:/i);
    assert.match(section.body, /Outcome:/i);
  }
});

test("agency software guide has the ten-criterion checklist and pricing boundary", () => {
  const guide = getGuide("ai-front-office-software-for-agencies");
  const text = [guide.dek, ...guide.sections.map((section) => `${section.h2} ${section.body}`), ...guide.faq.map((item) => item.a)].join(" ");
  const criteria = [
    "client isolation",
    "agency branding",
    "client portals",
    "reusable deployment",
    "voice, chat, SMS",
    "BYOK",
    "testing, evaluations",
    "data export",
    "billing shape",
    "open-source and self-hosting",
  ];
  for (const criterion of criteria) assert.match(text, new RegExp(criterion, "i"), `missing criterion: ${criterion}`);
  assert.match(text, /Disclosure/i);
  assert.match(text, /Agency Starter.*\$99|\$99.*Agency Starter/i);
  assert.match(text, /10 client workspaces/i);
  assert.match(text, /Builder.*\$29|\$29.*Builder/i);
  assert.match(text, /own-business|own and operate/i);
  assert.match(text, /does not include client sub-accounts|not.*client sub-accounts/i);
  assert.match(text, /ai-front-office-examples|AI front office examples/i);
});

test("allGuideSlugs matches GUIDES length with no duplicates", () => {
  const slugs = allGuideSlugs();
  assert.equal(slugs.length, GUIDES.length);
  assert.equal(new Set(slugs).size, slugs.length);
});

const GOHIGHLEVEL_DIAGNOSTIC_SLUGS = [
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

test("GoHighLevel diagnostic cluster is long-form, balanced, sourced, and agent-readable", () => {
  for (const slug of GOHIGHLEVEL_DIAGNOSTIC_SLUGS) {
    const guide = getGuide(slug);
    const headings = guide.sections.map((section) => section.h2);
    const readerCopy = [guide.dek, ...guide.sections.map((section) => section.body), ...guide.faq.flatMap((item) => [item.q, item.a])].join(" ");
    const wordCount = readerCopy.trim().split(/\s+/).length;

    assert.equal(guide.cluster, "gohighlevel", `${slug}: wrong cluster`);
    assert.ok(guide.sections.length >= 6, `${slug}: expected at least 6 sections`);
    assert.ok(guide.faq.length >= 4, `${slug}: expected at least 4 FAQs`);
    assert.ok(wordCount >= 800, `${slug}: expected at least 800 words, got ${wordCount}`);
    assert.ok(headings.includes("Where SeldonFrame helps"), `${slug}: missing SeldonFrame fit section`);
    assert.ok(headings.includes("Where SeldonFrame cannot help"), `${slug}: missing SeldonFrame non-fit section`);
    assert.ok(
      guide.sources.some((source) => /(?:help\.)?gohighlevel\.com/i.test(source.url)),
      `${slug}: missing official HighLevel source`,
    );
    assert.ok(
      guide.sources.some((source) => /reddit\.com|g2\.com/i.test(source.url)),
      `${slug}: missing community or aggregate review source`,
    );
    assert.ok(
      existsSync(join(process.cwd(), "src", "app", "guides", `${slug}.md`, "route.ts")),
      `${slug}: missing static Markdown route`,
    );
  }
});

// ─── per-guide structure + never-lies ───────────────────────────────────────

for (const g of GUIDES) {
  test(`guide '${g.slug}' has title, description, targetKeyword`, () => {
    assert.ok(g.title.trim().length > 0, "empty title");
    assert.ok(g.description.trim().length > 20, "description too short");
    assert.ok(g.targetKeyword.trim().length > 0, "empty targetKeyword");
    assert.ok(g.dek.trim().length > 20, "dek too short");
  });

  test(`guide '${g.slug}' has a valid cluster`, () => {
    assert.ok(CLUSTERS.has(g.cluster), `invalid cluster '${g.cluster}'`);
  });

  test(`guide '${g.slug}' has >=3 sections with h2 + body`, () => {
    assert.ok(g.sections.length >= 3, `expected >=3 sections, got ${g.sections.length}`);
    for (const s of g.sections) {
      assert.ok(s.h2.trim().length > 0, "empty h2");
      assert.ok(s.body.trim().length > 40, `section '${s.h2}' body too short`);
      assert.ok(!/<[a-z][^>]*>/i.test(s.body), `section '${s.h2}' contains raw HTML`);
      // markdown-lite balance sanity: "**" must appear an even number of times per body.
      const boldMarkers = (s.body.match(/\*\*/g) ?? []).length;
      assert.equal(boldMarkers % 2, 0, `section '${s.h2}' has unclosed ** bold markers`);
      // single-asterisk parity: after removing **bold** spans, any remaining
      // "*" (from *italic*) must also come in matched pairs, never a lone one.
      const withoutBold = s.body.replace(/\*\*[^*]+\*\*/g, "");
      const singleAsterisks = (withoutBold.match(/\*/g) ?? []).length;
      assert.equal(singleAsterisks % 2, 0, `section '${s.h2}' has an unclosed * italic marker`);
    }
  });

  test(`guide '${g.slug}' stripInlineMarkup removes every markdown-lite token`, () => {
    const strings: string[] = [
      g.title,
      g.description,
      g.dek,
      ...g.sections.map((s) => s.body),
      ...g.faq.flatMap((f) => [f.q, f.a]),
    ];
    for (const raw of strings) {
      const stripped = stripInlineMarkup(raw);
      assert.ok(!stripped.includes("**"), `stripInlineMarkup left "**" behind: "${stripped.slice(0, 80)}"`);
      assert.ok(!stripped.includes("]("), `stripInlineMarkup left "](" behind: "${stripped.slice(0, 80)}"`);
      assert.ok(!/\*/.test(stripped), `stripInlineMarkup left a lone "*" behind: "${stripped.slice(0, 80)}"`);
    }
  });

  test(`guide '${g.slug}' diagrams (if any) have non-empty labels + valid values`, () => {
    for (const s of g.sections) {
      if (!s.diagram) continue;
      const d = s.diagram;
      if (d.type === "flow" || d.type === "stack") {
        const items = d.type === "flow" ? d.steps : d.layers;
        assert.ok(items.length > 0, `${s.h2}: diagram has no items`);
        for (const item of items) assert.ok(item.label.trim().length > 0, `${s.h2}: diagram item has empty label`);
      }
      if (d.type === "loop") {
        assert.ok(d.steps.length > 0, `${s.h2}: loop has no steps`);
        for (const step of d.steps) assert.ok(step.trim().length > 0, `${s.h2}: loop step has empty label`);
      }
      if (d.type === "compare") {
        assert.ok(d.left.items.length >= 1, `${s.h2}: compare left has no items`);
        assert.ok(d.right.items.length >= 1, `${s.h2}: compare right has no items`);
      }
      if (d.type === "bars") {
        assert.ok(d.items.length > 0, `${s.h2}: bars has no items`);
        for (const item of d.items) {
          assert.ok(Number.isFinite(item.value) && item.value > 0, `${s.h2}: bar '${item.label}' value not finite/positive`);
          assert.ok(item.display.trim().length > 0, `${s.h2}: bar '${item.label}' has empty display`);
        }
      }
      // A ragged row renders a broken pipe table (cells shift into the wrong
      // column), which is exactly the failure an answer engine would quote.
      if (d.type === "table") {
        assert.ok(d.columns.length >= 2, `${s.h2}: table needs >=2 columns`);
        assert.ok(d.rows.length > 0, `${s.h2}: table has no rows`);
        for (const col of d.columns) assert.ok(col.trim().length > 0, `${s.h2}: table has an empty column header`);
        for (const [i, row] of d.rows.entries()) {
          assert.equal(row.cells.length, d.columns.length, `${s.h2}: table row ${i} has ${row.cells.length} cells for ${d.columns.length} columns`);
          for (const cell of row.cells) assert.ok(cell.trim().length > 0, `${s.h2}: table row ${i} has an empty cell`);
        }
      }
    }
  });

  test(`guide '${g.slug}' callouts (if any) have non-empty text`, () => {
    for (const s of g.sections) {
      if (!s.callout) continue;
      assert.ok(s.callout.text.trim().length > 0, `${s.h2}: callout has empty text`);
    }
  });

  test(`guide '${g.slug}' has >=2 FAQ entries`, () => {
    assert.ok(g.faq.length >= 2, `expected >=2 faq, got ${g.faq.length}`);
    for (const f of g.faq) {
      assert.ok(f.q.trim().length > 0, "empty FAQ question");
      assert.ok(f.a.trim().length > 0, "empty FAQ answer");
    }
  });

  test(`guide '${g.slug}' cites >=1 real https source (never-lies)`, () => {
    assert.ok(g.sources.length >= 1, "no source cited");
    for (const s of g.sources) {
      assert.ok(s.label.trim().length > 0, "empty source label");
      assert.ok(/^https:\/\/\S+$/.test(s.url), `source url not https / has whitespace: "${s.url}"`);
    }
  });

  test(`guide '${g.slug}' links to a /tools pillar and any relatedBest is a path`, () => {
    assert.ok(g.relatedTool.startsWith("/tools/"), `relatedTool should be a /tools path, got '${g.relatedTool}'`);
    if (g.relatedBest !== undefined) {
      assert.ok(g.relatedBest.startsWith("/"), `relatedBest should be a path, got '${g.relatedBest}'`);
    }
  });
}

// ─── clusters ────────────────────────────────────────────────────────────────

test("guidesInCluster + populatedClusters are consistent with GUIDES", () => {
  const total = populatedClusters().reduce((n, c) => n + c.guides.length, 0);
  assert.equal(total, GUIDES.length, "populatedClusters dropped or duplicated guides");
  for (const c of populatedClusters()) {
    assert.equal(c.guides.length, guidesInCluster(c.cluster).length);
    assert.ok(c.label.trim().length > 0, `cluster '${c.cluster}' has no label`);
  }
});

// ─── markdown twin ───────────────────────────────────────────────────────────

test("renderGuideMarkdown renders every guide without throwing or leaking", () => {
  for (const slug of allGuideSlugs()) {
    let md = "";
    assert.doesNotThrow(() => {
      md = renderGuideMarkdown(slug);
    }, `renderGuideMarkdown threw for ${slug}`);
    assert.ok(md.length > 200, `${slug}: markdown too short`);
    assert.match(md, /^# .+/m, `${slug}: missing H1`);
    assert.ok(!/\bundefined\b|\bnull\b/.test(md), `${slug}: leaked undefined/null`);
  }
});
