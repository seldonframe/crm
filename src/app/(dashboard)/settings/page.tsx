import Link from "next/link";

const sections = [
  { href: "/settings/profile", title: "Business Profile" },
  { href: "/settings/pipeline", title: "Pipeline" },
  { href: "/settings/fields", title: "Custom Fields" },
  { href: "/settings/team", title: "Team" },
  { href: "/settings/webhooks", title: "Webhooks" },
  { href: "/settings/api", title: "API Keys" },
];

export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="crm-card p-4 hover:bg-[hsl(var(--color-surface-raised))]">
            {section.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
