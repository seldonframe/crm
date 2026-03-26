import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { getOrgId } from "@/lib/auth/helpers";
import { getLabels } from "@/lib/soul/labels";
import { EmptyState } from "@/components/shared/empty-state";
import { CreateDealForm } from "@/components/deals/create-deal-form";
import { KanbanBoard } from "@/components/deals/kanban-board";
import { getDefaultPipeline, listDeals } from "@/lib/deals/actions";

function compactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const [labels, pipeline, dealRows, orgId] = await Promise.all([
    getLabels(),
    getDefaultPipeline(),
    listDeals(),
    getOrgId(),
  ]);

  const contactRows = orgId
    ? await db.select({ id: contacts.id, firstName: contacts.firstName, lastName: contacts.lastName }).from(contacts).where(eq(contacts.orgId, orgId))
    : [];

  const totalValue = dealRows.reduce((sum, row) => sum + Number(row.value), 0);
  const wonCount = dealRows.filter((row) => row.probability === 100).length;
  const winRate = dealRows.length ? Math.round((wonCount / dealRows.length) * 100) : 0;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{labels.deal.plural}</h1>
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">Track and move {labels.deal.plural.toLowerCase()} through your pipeline.</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Link href="/deals?view=kanban" className="rounded-md border px-3 py-1.5">Kanban</Link>
          <Link href="/deals?view=list" className="rounded-md border px-3 py-1.5">List</Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="crm-card p-4">
          <p className="text-xs text-[hsl(var(--color-text-muted))]">Total pipeline value</p>
          <p className="mt-1 text-xl font-semibold">{compactCurrency(totalValue)}</p>
        </div>
        <div className="crm-card p-4">
          <p className="text-xs text-[hsl(var(--color-text-muted))]">Deals by stage</p>
          <p className="mt-1 text-xl font-semibold">{pipeline?.stages?.length ?? 0}</p>
        </div>
        <div className="crm-card p-4">
          <p className="text-xs text-[hsl(var(--color-text-muted))]">Win rate</p>
          <p className="mt-1 text-xl font-semibold">{winRate}%</p>
        </div>
      </div>

      <CreateDealForm contacts={contactRows} />

      {dealRows.length === 0 ? (
        <EmptyState
          title={`Create your first ${labels.deal.singular}`}
          description={`Start filling your ${labels.pipeline.singular.toLowerCase()} with active opportunities.`}
          ctaLabel={`Add ${labels.deal.singular}`}
          ctaHref="#"
        />
      ) : view === "list" ? (
        <div className="crm-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[hsl(var(--color-surface-raised))] text-left">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Stage</th>
                <th className="px-3 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {dealRows.map((deal) => (
                <tr key={deal.id} className="border-t">
                  <td className="px-3 py-2"><Link href={`/deals/${deal.id}`} className="underline">{deal.title}</Link></td>
                  <td className="px-3 py-2">{deal.stage}</td>
                  <td className="px-3 py-2">{compactCurrency(Number(deal.value))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <KanbanBoard
          stages={Array.isArray(pipeline?.stages) ? (pipeline?.stages as Array<{ name: string; color: string; probability: number }>) : []}
          deals={dealRows.map((deal) => ({ id: deal.id, title: deal.title, stage: deal.stage, value: String(deal.value) }))}
        />
      )}
    </section>
  );
}
