import type { Metadata } from "next";
import Link from "next/link";
import type { ReactElement } from "react";

import { MarketplaceFooter, MarketplaceNav } from "@/components/marketplace/marketplace-chrome";
import { MKT } from "@/components/marketplace/marketplace-data";
import { MarketplaceStyles } from "@/components/marketplace/marketplace-styles";
import {
  GOHIGHLEVEL_COLLECTION_DESCRIPTION,
  GOHIGHLEVEL_COLLECTION_INTRO,
  GOHIGHLEVEL_COLLECTION_MARKDOWN_PATH,
  GOHIGHLEVEL_COLLECTION_PATH,
  GOHIGHLEVEL_COLLECTION_TITLE,
  resolvedGohighlevelGroups,
} from "@/lib/seo/gohighlevel-discovery";

const BASE_URL = "https://www.seldonframe.com";

export const metadata: Metadata = {
  title: `${GOHIGHLEVEL_COLLECTION_TITLE} — SeldonFrame`,
  description: GOHIGHLEVEL_COLLECTION_DESCRIPTION,
  alternates: {
    canonical: GOHIGHLEVEL_COLLECTION_PATH,
    types: { "text/markdown": GOHIGHLEVEL_COLLECTION_MARKDOWN_PATH },
  },
  openGraph: {
    title: GOHIGHLEVEL_COLLECTION_TITLE,
    description: GOHIGHLEVEL_COLLECTION_DESCRIPTION,
    type: "website",
    url: GOHIGHLEVEL_COLLECTION_PATH,
  },
};

export default function GohighlevelGuidesPage(): ReactElement {
  const groups = resolvedGohighlevelGroups();
  const uniqueGuides = Array.from(
    new Map(groups.flatMap((group) => group.guides).map((guide) => [guide.slug, guide])).values(),
  );
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: GOHIGHLEVEL_COLLECTION_TITLE,
    description: GOHIGHLEVEL_COLLECTION_DESCRIPTION,
    url: `${BASE_URL}${GOHIGHLEVEL_COLLECTION_PATH}`,
    mainEntity: { "@id": `${BASE_URL}${GOHIGHLEVEL_COLLECTION_PATH}#guides` },
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BASE_URL}${GOHIGHLEVEL_COLLECTION_PATH}#guides`,
    numberOfItems: uniqueGuides.length,
    itemListElement: uniqueGuides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      url: `${BASE_URL}/guides/${guide.slug}`,
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Guides", item: `${BASE_URL}/guides` },
      {
        "@type": "ListItem",
        position: 2,
        name: "GoHighLevel agency field guide",
        item: `${BASE_URL}${GOHIGHLEVEL_COLLECTION_PATH}`,
      },
    ],
  };

  return (
    <div
      className="sf-mkt"
      style={{
        minHeight: "100vh",
        background: MKT.paper,
        color: MKT.ink,
        fontFamily: MKT.fontSans,
        overflowX: "hidden",
      }}
    >
      <MarketplaceStyles />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <MarketplaceNav />

      <main style={{ maxWidth: 980, margin: "0 auto", padding: "34px 32px 76px", width: "100%" }}>
        <nav
          aria-label="Breadcrumb"
          style={{ display: "flex", gap: 7, fontSize: 13.5, fontWeight: 650, color: "rgba(34,29,23,0.52)" }}
        >
          <Link href="/guides" className="sf-link" style={{ color: "inherit", textDecoration: "none" }}>
            Guides
          </Link>
          <span aria-hidden>/</span>
          <span style={{ color: "rgba(34,29,23,0.74)" }}>GoHighLevel</span>
        </nav>

        <header style={{ maxWidth: 820, padding: "54px 0 38px" }}>
          <p
            style={{
              margin: "0 0 14px",
              fontFamily: MKT.fontMono,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "rgba(34,29,23,0.56)",
            }}
          >
            Agency field guide · four decision paths
          </p>
          <h1 style={{ margin: 0, fontSize: "clamp(38px, 6vw, 62px)", lineHeight: 1.02, letterSpacing: "-0.045em", fontWeight: 800 }}>
            GoHighLevel problems, costs, alternatives, and exits
          </h1>
          <p style={{ margin: "22px 0 0", maxWidth: 760, fontSize: 18, lineHeight: 1.65, color: "rgba(34,29,23,0.74)" }}>
            {GOHIGHLEVEL_COLLECTION_INTRO}
          </p>
        </header>

        <nav
          aria-label="Choose a GoHighLevel research path"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            borderTop: `1px solid ${MKT.ink10}`,
            borderBottom: `1px solid ${MKT.ink10}`,
          }}
        >
          {groups.map((group, index) => (
            <Link
              key={group.id}
              href={`#${group.id}`}
              className="sf-link"
              style={{ padding: "18px 16px", color: MKT.ink, textDecoration: "none", display: "flex", gap: 12, alignItems: "baseline" }}
            >
              <span style={{ fontFamily: MKT.fontMono, fontSize: 11, color: "rgba(34,29,23,0.44)" }}>0{index + 1}</span>
              <span style={{ fontSize: 14, fontWeight: 750, lineHeight: 1.35 }}>{group.heading}</span>
            </Link>
          ))}
        </nav>

        <aside
          style={{
            marginTop: 34,
            padding: "20px 22px",
            borderLeft: `4px solid ${MKT.green}`,
            background: "rgba(255,255,255,0.48)",
          }}
        >
          <strong style={{ display: "block", fontSize: 15 }}>Where SeldonFrame fits — and where it does not</strong>
          <p style={{ margin: "7px 0 0", fontSize: 14.5, lineHeight: 1.65, color: "rgba(34,29,23,0.72)" }}>
            SeldonFrame is designed for agencies that want a focused AI front office for local-service clients, clearer workspace ownership, and a simpler operating model. It is not a drop-in replacement for every HighLevel funnel, campaign, snapshot, or ecosystem workflow. These guides make that boundary explicit.
          </p>
        </aside>

        {groups.map((group, groupIndex) => (
          <section id={group.id} key={group.id} style={{ marginTop: 58, scrollMarginTop: 100 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.72fr) minmax(260px, 1fr)", gap: 28, alignItems: "start" }}>
              <div>
                <span style={{ fontFamily: MKT.fontMono, fontSize: 12, color: "rgba(34,29,23,0.46)" }}>0{groupIndex + 1}</span>
                <h2 style={{ margin: "8px 0 0", fontSize: 28, lineHeight: 1.14, letterSpacing: "-0.03em" }}>{group.heading}</h2>
                <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.65, color: "rgba(34,29,23,0.66)" }}>{group.description}</p>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {group.guides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="sf-link"
                    style={{
                      display: "block",
                      border: `1px solid ${MKT.ink10}`,
                      borderRadius: 12,
                      padding: "17px 18px",
                      background: "rgba(255,255,255,0.56)",
                      color: MKT.ink,
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.35 }}>{guide.title}</span>
                    <span style={{ display: "block", marginTop: 6, fontSize: 13.5, lineHeight: 1.55, color: "rgba(34,29,23,0.62)" }}>
                      {guide.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section
          style={{
            marginTop: 62,
            padding: "30px",
            borderRadius: 16,
            background: MKT.green,
            color: MKT.paper,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 24, letterSpacing: "-0.025em" }}>Move from diagnosis to a decision</h2>
          <p style={{ margin: "10px 0 20px", maxWidth: 690, fontSize: 15, lineHeight: 1.65, color: "rgba(246,242,234,0.74)" }}>
            Compare the operating models, then calculate the recurring software and usage costs behind your current agency stack.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/alternative-to-gohighlevel" className="sf-link" style={{ padding: "11px 18px", borderRadius: 10, background: MKT.paper, color: MKT.green, fontWeight: 750, textDecoration: "none" }}>
              Compare SeldonFrame and GoHighLevel
            </Link>
            <Link href="/tools/gohighlevel-cost-calculator" className="sf-link" style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid rgba(246,242,234,0.28)", color: MKT.paper, fontWeight: 750, textDecoration: "none" }}>
              Calculate GoHighLevel cost
            </Link>
          </div>
        </section>
      </main>

      <MarketplaceFooter />
    </div>
  );
}
