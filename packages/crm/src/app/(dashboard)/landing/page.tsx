import { createLandingPageAction, listLandingPages } from "@/lib/landing/actions";
import { getLabels } from "@/lib/soul/labels";
import { LandingPagesContent } from "@/components/landing/landing-pages-content";

export default async function LandingPagesDashboard() {
  const [labels, pages] = await Promise.all([getLabels(), listLandingPages()]);

  return (
    <section className="animate-page-enter space-y-4">
      <div>
        <h1 className="text-page-title">Pages</h1>
        <p className="text-label text-[hsl(var(--color-text-secondary))]">
          Build and publish modular pages with integrated {labels.intakeForm.singular.toLowerCase()} and booking sections.
        </p>
      </div>

      <LandingPagesContent
        pages={pages.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          status: p.status,
          updatedAt: p.updatedAt.toISOString(),
        }))}
        createAction={createLandingPageAction}
      />
    </section>
  );
}
