// 2026-08-24 — Pure Markdown renderer for the /tools/<slug>.md twins.
//
// Every other page family already has Markdown twins (best-of, guides, blog,
// comparisons, charts); the free tools had none, so an agent asked "what does
// SeldonFrame's no-show calculator do" had nothing token-light to read. This
// renders from the SAME registry the hub and sitemap read (tools-pages.ts), so
// the twin can never describe a tool that isn't listed.
//
// Two shapes, deliberately:
//   • Tools with a verified `markdown` block get the full twin (what it
//     computes, its inputs, its outputs).
//   • Tools without one get the short twin — title, summary, link. We do NOT
//     invent an input list for a widget we haven't audited (house rule:
//     every claim must be true today).
//
// Mirrors best-markdown.ts; served by the static dotted route folders at
// app/tools/<slug>.md/route.ts.

import { getToolPage, TOOL_PAGES, type ToolPage } from "./tools-pages";

const BASE = "https://www.seldonframe.com";

/** The two CTAs every tool twin ends on — the same pair the HTML pages use. */
const START_URL = `${BASE}/signup`;
const TOOLS_URL = `${BASE}/tools`;

function relatedLine(slug: string): string {
  const tool: ToolPage = getToolPage(slug);
  return `- [${tool.title}](${BASE}/tools/${tool.slug}): ${tool.summary}.`;
}

export function renderToolMarkdown(slug: string): string {
  const tool = getToolPage(slug);
  const L: string[] = [];

  L.push(`# ${tool.title}`);
  L.push("");
  L.push(`> ${tool.description}`);
  L.push("");
  L.push(`HTML version: ${BASE}/tools/${slug}`);
  L.push("");
  // NOTE: deliberately no blanket "nothing leaves your browser" claim here.
  // Most of these tools are pure client-side, but /tools/website-grader fetches
  // and scores the URL you give it through a server route, so the promise would
  // be a lie for at least one page. Per-tool privacy claims live in the
  // registry's `markdown.what`, where they can be true one tool at a time.
  L.push(
    tool.interactive
      ? "Free to use, and no signup is required."
      : "Free to use. This page is a front door to the SeldonFrame build flow, not a calculator.",
  );
  L.push("");

  const md = tool.markdown;
  if (md) {
    L.push("## What it does");
    L.push("");
    L.push(md.what);
    L.push("");

    L.push("## What you enter");
    L.push("");
    for (const input of md.inputs) L.push(`- ${input}`);
    L.push("");

    L.push("## What you get back");
    L.push("");
    for (const output of md.outputs) L.push(`- ${output}`);
    L.push("");

    if (md.related && md.related.length > 0) {
      L.push("## Related free tools");
      L.push("");
      for (const rel of md.related) L.push(relatedLine(rel));
      L.push("");
    }
  } else {
    L.push("## What it does");
    L.push("");
    L.push(`In one line: ${tool.summary}.`);
    L.push("");
    L.push(`Open ${BASE}/tools/${slug} to use it — the interactive version is the tool.`);
    L.push("");
  }

  L.push("## About SeldonFrame");
  L.push("");
  L.push(
    "SeldonFrame builds a whole AI front office for a local service business: hosted website, booking page, intake form, CRM and AI agents, in about three minutes. The first workspace is free forever, and paid plans are $29/mo flat solo or $99 to $299/mo agency.",
  );
  L.push("");
  L.push(`- Build one free: ${START_URL}`);
  L.push(`- Every free tool: ${TOOLS_URL}`);
  L.push("");

  return L.join("\n");
}

/** Every slug that has a Markdown twin. Currently: all of them. */
export function allToolMarkdownSlugs(): string[] {
  return TOOL_PAGES.map((t) => t.slug);
}
