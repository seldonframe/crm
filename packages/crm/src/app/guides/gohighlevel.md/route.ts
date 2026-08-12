import { logMarkdownFetch } from "@/lib/marketplace/md-analytics";
import {
  GOHIGHLEVEL_COLLECTION_PATH,
  renderGohighlevelCollectionMarkdown,
} from "@/lib/seo/gohighlevel-discovery";

export const dynamic = "force-dynamic";

export function GET(req: Request): Response {
  logMarkdownFetch(req, {
    surface: "guide",
    mode: "explicit_md",
    path: "/guides/gohighlevel.md",
  });

  return new Response(renderGohighlevelCollectionMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<https://www.seldonframe.com${GOHIGHLEVEL_COLLECTION_PATH}>; rel="alternate"; type="text/html"`,
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
