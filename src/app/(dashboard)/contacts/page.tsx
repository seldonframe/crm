import Link from "next/link";
import { listContacts } from "@/lib/contacts/actions";
import { getLabels } from "@/lib/soul/labels";
import { EmptyState } from "@/components/shared/empty-state";
import { CreateContactForm } from "@/components/contacts/create-contact-form";

export default async function ContactsPage() {
  const [labels, rows] = await Promise.all([getLabels(), listContacts()]);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{labels.contact.plural}</h1>
        <p className="text-sm text-[hsl(var(--color-text-secondary))]">Manage and segment your {labels.contact.plural.toLowerCase()}.</p>
      </div>

      <CreateContactForm />

      {rows.length === 0 ? (
        <EmptyState
          title={`Add your first ${labels.contact.singular}`}
          description="Start tracking relationships and touchpoints in one place."
          ctaLabel={`Create ${labels.contact.singular}`}
          ctaHref="#"
        />
      ) : (
        <div className="crm-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[hsl(var(--color-surface-raised))] text-left">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-3 py-2">
                    <Link href={`/contacts/${row.id}`} className="underline">
                      {row.firstName} {row.lastName}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{row.email ?? "—"}</td>
                  <td className="px-3 py-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
