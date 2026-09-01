// /tools/a2p-10dlc-checker.md — Markdown twin of the free tool.
import { renderToolMarkdown } from "@/lib/seo/tools-markdown";
import { logMarkdownFetch } from "@/lib/marketplace/md-analytics";

export const dynamic = "force-dynamic";

export function GET(req: Request): Response {
  logMarkdownFetch(req, { surface: "tool_page", mode: "explicit_md", path: "/tools/a2p-10dlc-checker.md" });
  const md = renderToolMarkdown("a2p-10dlc-checker");
  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: '<https://www.seldonframe.com/tools/a2p-10dlc-checker>; rel="alternate"; type="text/html"',
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
