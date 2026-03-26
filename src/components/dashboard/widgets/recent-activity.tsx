import { formatRelativeDate } from "@/lib/utils/formatters";

export function RecentActivityWidget({
  items,
}: {
  items: Array<{ id: string; type: string; subject: string | null; createdAt: Date }>;
}) {
  return (
    <article className="crm-card p-4">
      <h3 className="mb-3 text-lg font-semibold">Recent Activity</h3>
      {items.length === 0 ? (
        <p className="text-sm text-[hsl(var(--color-text-secondary))]">No recent activity.</p>
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 6).map((item) => (
            <li key={item.id} className="text-sm">
              <span className="font-medium">{item.type}</span> · {item.subject ?? "No subject"} · {formatRelativeDate(item.createdAt)}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
