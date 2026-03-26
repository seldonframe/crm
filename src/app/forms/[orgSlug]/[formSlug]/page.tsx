import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { intakeForms } from "@/db/schema";
import { PublicForm } from "@/components/forms/public-form";

export default async function PublicIntakePage({
  params,
}: {
  params: Promise<{ orgSlug: string; formSlug: string }>;
}) {
  const { orgSlug, formSlug } = await params;

  const [form] = await db.select().from(intakeForms).where(eq(intakeForms.slug, formSlug)).limit(1);

  if (!form) {
    notFound();
  }

  return (
    <main className="crm-page flex items-center justify-center">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold">{form.name}</h1>
        <PublicForm
          orgSlug={orgSlug}
          formSlug={formSlug}
          fields={Array.isArray(form.fields) ? (form.fields as Array<{ key: string; label: string; type: string; required: boolean; options?: string[] }>) : []}
        />
      </div>
    </main>
  );
}
