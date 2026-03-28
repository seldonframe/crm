import Link from "next/link";
import { eq } from "drizzle-orm";
import { createAppointmentTypeAction, listAppointmentTypes, listBookings } from "@/lib/bookings/actions";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/helpers";
import { listContacts } from "@/lib/contacts/actions";
import { getAvailableBookingProviders } from "@/lib/bookings/providers";
import { getLabels } from "@/lib/soul/labels";
import { CreateBookingForm } from "@/components/bookings/create-booking-form";

export default async function BookingsPage() {
  const [user, labels, bookingTypes, bookings, contacts, providers] = await Promise.all([
    getCurrentUser(),
    getLabels(),
    listAppointmentTypes(),
    listBookings(),
    listContacts(),
    getAvailableBookingProviders(),
  ]);

  let orgSlug = "";

  if (user?.orgId) {
    const [org] = await db.select({ slug: organizations.slug }).from(organizations).where(eq(organizations.id, user.orgId)).limit(1);
    orgSlug = org?.slug ?? "";
  }

  return (
    <section className="animate-page-enter space-y-4">
      <div>
        <h1 className="text-page-title">{labels.activity.plural} · Booking</h1>
        <p className="text-label text-[hsl(var(--color-text-secondary))]">Schedule client sessions and keep {labels.activity.plural.toLowerCase()} synced.</p>
      </div>

      <form action={createAppointmentTypeAction} className="crm-card grid gap-3 p-4 md:grid-cols-[1fr_140px_120px_1fr_220px_auto] md:items-end">
        <div>
          <label htmlFor="appointment-name" className="text-label text-[hsl(var(--color-text-secondary))]">Appointment name</label>
          <input id="appointment-name" className="crm-input mt-1 h-10 px-3" name="name" placeholder="Strategy Call" required />
        </div>

        <div>
          <label htmlFor="appointment-duration" className="text-label text-[hsl(var(--color-text-secondary))]">Duration</label>
          <select id="appointment-duration" className="crm-input mt-1 h-10 px-3" name="durationMinutes" defaultValue="30">
            <option value="30">30 min</option>
            <option value="60">60 min</option>
          </select>
        </div>

        <div>
          <label htmlFor="appointment-price" className="text-label text-[hsl(var(--color-text-secondary))]">Price</label>
          <input id="appointment-price" className="crm-input mt-1 h-10 px-3" name="price" type="number" min={0} step="0.01" defaultValue="0" />
        </div>

        <div>
          <label htmlFor="appointment-description" className="text-label text-[hsl(var(--color-text-secondary))]">Description</label>
          <input id="appointment-description" className="crm-input mt-1 h-10 px-3" name="description" placeholder="Initial planning session" />
        </div>

        <div>
          <label htmlFor="appointment-slug" className="text-label text-[hsl(var(--color-text-secondary))]">Public slug</label>
          <input id="appointment-slug" className="crm-input mt-1 h-10 px-3" name="slug" placeholder="strategy-call" required />
        </div>

        <button type="submit" className="crm-button-primary h-10 px-4">Create Type</button>
      </form>

      <div className="crm-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--color-surface-raised))] text-left text-label">
            <tr>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Duration</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Description</th>
              <th className="px-3 py-3">Public URL</th>
            </tr>
          </thead>
          <tbody>
            {bookingTypes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-[hsl(var(--color-text-secondary))]">No appointment types yet.</td>
              </tr>
            ) : (
              bookingTypes.map((row) => {
                const metadata = (row.metadata as { durationMinutes?: number; description?: string; price?: number } | null) ?? null;
                return (
                  <tr key={row.id} className="crm-table-row">
                    <td className="px-3 py-3 font-medium text-foreground">{row.title}</td>
                    <td className="px-3 py-3">{metadata?.durationMinutes ?? 30} min</td>
                    <td className="px-3 py-3">${Number(metadata?.price ?? 0).toFixed(2)}</td>
                    <td className="px-3 py-3 text-[hsl(var(--color-text-secondary))]">{metadata?.description || "—"}</td>
                    <td className="px-3 py-3">
                      <Link href={orgSlug ? `/book/${orgSlug}/${row.bookingSlug}` : "#"} className="text-primary underline-offset-4 hover:underline">
                        /book/[orgSlug]/{row.bookingSlug}
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <CreateBookingForm contacts={contacts} providers={providers} />

      <div className="crm-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--color-surface-raised))] text-left text-label">
            <tr>
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">When</th>
              <th className="px-3 py-3">Provider</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Join</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((row) => (
              <tr key={row.id} className="crm-table-row">
                <td className="px-3 py-3 font-medium text-foreground">{row.title}</td>
                <td className="px-3 py-3 text-[hsl(var(--color-text-secondary))]">
                  {new Date(row.startsAt).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </td>
                <td className="px-3 py-3">{row.provider}</td>
                <td className="px-3 py-3">
                  <span className="crm-badge">{row.status}</span>
                </td>
                <td className="px-3 py-3">
                  {row.meetingUrl ? (
                    <Link href={row.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">
                      Open
                    </Link>
                  ) : (
                    <span className="text-[hsl(var(--color-text-muted))]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
