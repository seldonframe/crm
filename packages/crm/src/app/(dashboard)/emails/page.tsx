import { SendEmailForm } from "@/components/emails/send-email-form";
import { EmailListTable } from "@/components/emails/email-list-table";
import { listContacts } from "@/lib/contacts/actions";
import { createEmailTemplateAction, listEmails, listEmailTemplates } from "@/lib/emails/actions";
import { getAvailableEmailProviders } from "@/lib/emails/providers";
import { getLabels } from "@/lib/soul/labels";

export default async function EmailsPage() {
  const [labels, contacts, templates, rows, providers] = await Promise.all([
    getLabels(),
    listContacts(),
    listEmailTemplates(),
    listEmails(),
    getAvailableEmailProviders(),
  ]);

  return (
    <section className="animate-page-enter space-y-4">
      <div>
        <h1 className="text-page-title">Email</h1>
        <p className="text-label text-[hsl(var(--color-text-secondary))]">
          Send transactional and campaign emails to your {labels.contact.plural.toLowerCase()} with provider fallbacks.
        </p>
      </div>

      <form action={createEmailTemplateAction} className="crm-card grid gap-3 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <input className="crm-input h-10 px-3" name="name" placeholder="Template name" required />
          <input className="crm-input h-10 px-3" name="tag" placeholder="Tag (welcome/general)" defaultValue="general" required />
        </div>

        <input className="crm-input h-10 px-3" name="subject" placeholder="Subject" required />
        <textarea className="crm-input min-h-24 p-3" name="body" placeholder="Body (supports {{firstName}})" required />

        <button type="submit" className="crm-button-primary h-10 px-4">Save Template</button>
      </form>

      <div className="crm-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--color-surface-raised))] text-left text-label">
            <tr>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Tag</th>
              <th className="px-3 py-3">Subject</th>
            </tr>
          </thead>
          <tbody>
            {templates.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-4 text-[hsl(var(--color-text-secondary))]">No templates yet.</td>
              </tr>
            ) : (
              templates.map((template) => (
                <tr key={template.id} className="crm-table-row">
                  <td className="px-3 py-3 font-medium text-foreground">{template.name}</td>
                  <td className="px-3 py-3"><span className="crm-badge">{template.tag || "general"}</span></td>
                  <td className="px-3 py-3 text-[hsl(var(--color-text-secondary))]">{template.subject}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <SendEmailForm contacts={contacts} providers={providers} />
      <EmailListTable rows={rows} />
    </section>
  );
}
