// /tools/ai-receptionist-script-generator.md — Markdown twin of the free tool.
import { renderToolMarkdown } from "@/lib/seo/tools-markdown";
import { logMarkdownFetch } from "@/lib/marketplace/md-analytics";

export const dynamic = "force-dynamic";

export function GET(req: Request): Response {
  logMarkdownFetch(req, { surface: "tool_page", mode: "explicit_md", path: "/tools/ai-receptionist-script-generator.md" });
  const md = renderToolMarkdown("ai-receptionist-script-generator");
  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: '<https://www.seldonframe.com/tools/ai-receptionist-script-generator>; rel="alternate"; type="text/html"',
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
