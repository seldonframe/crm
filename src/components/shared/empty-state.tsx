import Link from "next/link";

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="crm-card p-8 text-center">
      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[hsl(var(--color-surface-raised))]" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[hsl(var(--color-text-secondary))]">{description}</p>
      <Link href={ctaHref} className="crm-button-primary mt-4 inline-flex h-10 px-4">
        {ctaLabel}
      </Link>
    </div>
  );
}
