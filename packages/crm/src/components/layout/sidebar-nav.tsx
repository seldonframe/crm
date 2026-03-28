"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Calendar, FileText, Layout, LayoutDashboard, Mail, Settings, Users, Zap } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: "dashboard" | "contacts" | "deals" | "booking" | "pages" | "email" | "forms" | "automations" | "settings";
};

const iconMap = {
  dashboard: LayoutDashboard,
  contacts: Users,
  deals: Briefcase,
  booking: Calendar,
  pages: Layout,
  email: Mail,
  forms: FileText,
  automations: Zap,
  settings: Settings,
} as const;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
      {nav.map((item) => {
        const Icon = iconMap[item.icon];
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            data-active={active}
            className="crm-sidebar-link flex items-center gap-2.5 px-3 py-2.5 text-label"
          >
            <Icon className="crm-sidebar-icon h-4 w-4 shrink-0" />
            <span className="crm-sidebar-text">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
