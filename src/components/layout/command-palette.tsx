"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";

const items = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Contacts", href: "/contacts" },
  { label: "Deals", href: "/deals" },
  { label: "Activities", href: "/activities" },
  { label: "Settings", href: "/settings" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((current) => !current);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 p-4" onClick={() => setOpen(false)}>
      <div className="mx-auto mt-24 max-w-xl crm-card p-2" onClick={(e) => e.stopPropagation()}>
        <Command>
          <Command.Input className="crm-input mb-2 h-10 w-full px-3" placeholder="Type a command or search..." />
          <Command.List>
            {items.map((item) => (
              <Command.Item
                key={item.href}
                className="cursor-pointer rounded-md px-3 py-2 text-sm data-[selected=true]:bg-[hsl(var(--color-surface-raised))]"
                onSelect={() => {
                  router.push(item.href);
                  setOpen(false);
                }}
              >
                {item.label}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
