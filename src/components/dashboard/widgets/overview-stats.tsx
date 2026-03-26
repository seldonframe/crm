import { formatCurrencyCompact } from "@/lib/utils/formatters";

export function OverviewStats({
  totalContacts,
  totalDeals,
  pipelineValue,
}: {
  totalContacts: number;
  totalDeals: number;
  pipelineValue: number;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <article className="crm-card p-4">
        <p className="text-xs text-[hsl(var(--color-text-muted))]">Contacts</p>
        <p className="text-xl font-semibold">{totalContacts}</p>
      </article>
      <article className="crm-card p-4">
        <p className="text-xs text-[hsl(var(--color-text-muted))]">Deals</p>
        <p className="text-xl font-semibold">{totalDeals}</p>
      </article>
      <article className="crm-card p-4">
        <p className="text-xs text-[hsl(var(--color-text-muted))]">Pipeline Value</p>
        <p className="text-xl font-semibold">{formatCurrencyCompact(pipelineValue)}</p>
      </article>
    </div>
  );
}
