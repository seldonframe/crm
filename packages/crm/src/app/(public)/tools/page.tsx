// /tools — the free-tools hub (PostPlanify motion: high-intent utility pages
// that rank and convert).
//
// 2026-08-24 — the hand-maintained TOOLS array that used to live here moved to
// lib/seo/tools-pages.ts, which sitemap.ts and llms.txt/route.ts now read too.
// Adding a tool is one registry entry plus its page directory; nothing here
// needs touching.
import type { Metadata } from "next";
import type { ReactElement } from "react";
import Link from "next/link";
import { MarketplaceNav, MarketplaceFooter } from "@/components/marketplace/marketplace-chrome";
import { MarketplaceStyles } from "@/components/marketplace/marketplace-styles";
import { MKT } from "@/components/marketplace/marketplace-data";
import { TOOL_PAGES } from "@/lib/seo/tools-pages";

export const metadata: Metadata = {
  title: "Free tools for local service businesses — SeldonFrame",
  description: "Free calculators and tools for service businesses and the agencies that serve them: missed-call cost, AI receptionist ROI, and more.",
  alternates: { canonical: "/tools" },
};

export default function ToolsHubPage(): ReactElement {
  return (
    <div className="sf-mkt" style={{ minHeight: "100vh", background: MKT.paper, color: MKT.ink, fontFamily: MKT.fontSans, overflowX: "hidden" }}>
      <MarketplaceStyles />
      <MarketplaceNav />
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 32px 70px", width: "100%" }}>
        <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800, letterSpacing: "-0.03em" }}>Free tools</h1>
        <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.55, color: "rgba(34,29,23,0.7)", maxWidth: 640 }}>
          Free calculators for local service businesses and the agencies that serve them. No signup required.
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.6, color: "rgba(34,29,23,0.6)", maxWidth: 640 }}>
          Prefer the big picture?{" "}
          <Link href="/charts" className="sf-link" style={{ color: MKT.green, fontWeight: 700 }}>
            Explore our live charts →
          </Link>
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginTop: 30 }}>
          {TOOL_PAGES.map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="sf-link" style={{ border: `1px solid ${MKT.ink10}`, borderRadius: 14, padding: "20px 22px", textDecoration: "none", color: MKT.ink, background: "rgba(255,255,255,0.55)", display: "block" }}>
              <div style={{ fontSize: 17, fontWeight: 800 }}>{t.title}</div>
              <p style={{ margin: "8px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "rgba(34,29,23,0.62)" }}>{t.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
