import { requireAuth } from "@/lib/auth/helpers";
import { SoulProvider } from "@/components/soul/soul-provider";
import { getSoul } from "@/lib/soul/server";
import { adjustBrightness } from "@/lib/utils/colors";
import { Sidebar } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/layout/command-palette";
import { DemoBanner } from "@/components/layout/demo-banner";
import { DensityToggle } from "@/components/shared/density-toggle";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();
  const soul = await getSoul();

  const bodyStyle = soul?.branding
    ? ({
        "--soul-primary": soul.branding.primaryColor,
        "--soul-primary-hover": adjustBrightness(soul.branding.primaryColor, -8),
        "--soul-accent": soul.branding.accentColor,
      } as React.CSSProperties)
    : undefined;

  return (
    <SoulProvider soul={soul}>
      <div className="crm-page" data-soul-primary style={bodyStyle}>
        <div className="flex flex-col gap-4 md:flex-row">
          <Sidebar />
          <div className="flex-1 space-y-4">
            <DemoBanner />
            <header className="crm-card flex items-center justify-between p-3">
              <h1 className="text-sm font-medium text-[hsl(var(--color-text-secondary))]">CRM Framework</h1>
              <DensityToggle />
            </header>
            {children}
          </div>
        </div>
        <CommandPalette />
      </div>
    </SoulProvider>
  );
}
