"use client";

import { cn } from "@/lib/utils";
import {
  Building2,
  Landmark,
  LayoutDashboard,
  MessagesSquare,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[] = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/dashboard/desarrollos", label: "Desarrollos", icon: Landmark },
  { href: "/dashboard/crm", label: "CRM Omnicanal", icon: MessagesSquare },
  { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-tl-gold/15 bg-tl-black">
      <div className="border-b border-tl-gold/15 px-6 py-7">
        <p className="font-outfit font-light text-[10px] uppercase tracking-[0.28em] text-tl-gold">
          Total Living
        </p>
        <h1 className="mt-2 font-cormorant text-2xl font-light text-tl-beige">
          Panel Admin
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 font-outfit font-light text-sm transition-colors",
                isActive
                  ? "bg-tl-gold/15 text-tl-gold"
                  : "text-tl-beige/70 hover:bg-tl-olive/30 hover:text-tl-beige",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-tl-gold/15 px-6 py-5">
        <p className="font-outfit font-light text-[10px] uppercase tracking-[0.2em] text-tl-beige/50">
          CRM & Catálogo
        </p>
        <p className="mt-1 font-outfit font-light text-xs text-tl-beige/70">
          v0.1 — Fase 6
        </p>
      </div>
    </aside>
  );
}
