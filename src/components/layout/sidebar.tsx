import Link from "next/link";
import { getLabels } from "@/lib/soul/labels";

export async function Sidebar() {
  const labels = await getLabels();

  const nav = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/contacts", label: labels.contact.plural },
    { href: "/deals", label: labels.deal.plural },
    { href: "/activities", label: labels.activity.plural },
    { href: "/forms", label: labels.intakeForm.plural },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <aside className="crm-card w-full md:w-64 p-4">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[hsl(var(--color-text-muted))]">Seldon Frame</p>
      <nav className="space-y-1">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[hsl(var(--color-surface-raised))]">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
