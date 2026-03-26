import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { activities, contacts } from "@/db/schema";
import { getOrgId } from "@/lib/auth/helpers";
import { getLabels } from "@/lib/soul/labels";

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orgId = await getOrgId();

  if (!orgId) {
    notFound();
  }

  const [labels, row, timeline] = await Promise.all([
    getLabels(),
    db
      .select()
      .from(contacts)
      .where(and(eq(contacts.orgId, orgId), eq(contacts.id, id)))
      .limit(1)
      .then((result) => result[0]),
    db.select().from(activities).where(and(eq(activities.orgId, orgId), eq(activities.contactId, id))),
  ]);

  if (!row) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">
        {labels.contact.singular}: {row.firstName} {row.lastName}
      </h1>

      <div className="crm-card p-4">
        <p className="text-sm">Email: {row.email ?? "—"}</p>
        <p className="text-sm">Status: {row.status}</p>
      </div>

      <div className="crm-card p-4">
        <h2 className="mb-2 text-lg font-semibold">Activity Timeline</h2>
        {timeline.length === 0 ? (
          <p className="text-sm text-[hsl(var(--color-text-secondary))]">No activity yet.</p>
        ) : (
          <ul className="space-y-2">
            {timeline.map((item) => (
              <li key={item.id} className="text-sm">
                <span className="font-medium">{item.type}</span> — {item.subject ?? "No subject"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
