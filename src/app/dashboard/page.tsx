import { getPropertyStats } from "@/lib/api";
import { listDevelopmentsApi } from "@/lib/api/developments";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { Building2, MessagesSquare, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

export const revalidate = 20;

async function getActiveLeadCount(): Promise<number> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/leads/`, {
      next: { revalidate: 20 },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return 0;
    const leads = (await response.json()) as Array<{ status: string }>;
    return Array.isArray(leads)
      ? leads.filter((lead) => lead.status !== "Cerrado").length
      : 0;
  } catch {
    return 0;
  }
}

async function getDevelopmentsCount(): Promise<number> {
  try {
    const rows = await listDevelopmentsApi();
    return rows.length;
  } catch {
    return 0;
  }
}

export default async function DashboardHomePage() {
  const [propertyStats, activeLeads, developmentsCount] = await Promise.all([
    getPropertyStats(),
    getActiveLeadCount(),
    getDevelopmentsCount(),
  ]);

  const stats = [
    {
      label: "Propiedades activas",
      value: propertyStats.total,
      icon: Building2,
      href: "/dashboard/propiedades",
    },
    {
      label: "Destacadas",
      value: propertyStats.featured,
      icon: Star,
      href: "/dashboard/propiedades",
    },
    {
      label: "Desarrollos",
      value: developmentsCount,
      icon: TrendingUp,
      href: "/dashboard/desarrollos",
    },
    {
      label: "Leads activos",
      value: activeLeads,
      icon: MessagesSquare,
      href: "/dashboard/crm",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold">
          Dashboard
        </p>
        <h1 className="mt-2 font-outfit text-[1.85rem] font-extralight leading-tight text-tl-beige sm:text-4xl">
          Panel de Control
        </h1>
        <p className="mt-2 max-w-2xl font-outfit text-sm font-light leading-relaxed text-tl-beige/65">
          Vista general del catálogo inmobiliario y la actividad comercial de
          Total Living.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            prefetch
            className="group rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] p-4 transition-colors active:border-tl-gold/40 sm:p-5 sm:hover:border-tl-gold/30"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-outfit text-[9px] font-light uppercase leading-snug tracking-[0.14em] text-tl-beige/45 sm:text-[10px] sm:tracking-[0.16em]">
                {stat.label}
              </p>
              <stat.icon className="mt-0.5 h-4 w-4 shrink-0 text-tl-gold/80 transition-colors group-hover:text-tl-gold" />
            </div>
            <p className="mt-3 font-outfit text-3xl font-extralight text-tl-beige sm:mt-4 sm:text-4xl">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] p-4 sm:p-6">
        <p className="font-outfit text-[10px] font-extralight uppercase tracking-[0.18em] text-tl-gold">
          Accesos rápidos
        </p>
        <div className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:flex-row sm:flex-wrap sm:gap-3">
          <QuickLink href="/dashboard/propiedades" label="Gestionar propiedades" />
          <QuickLink href="/dashboard/crm" label="Ver leads del sitio" />
          <QuickLink href="/dashboard/desarrollos" label="Ver desarrollos" />
        </div>
      </section>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      prefetch
      className="inline-flex min-h-12 items-center justify-center rounded-full border border-tl-gold/35 px-5 py-3 text-center font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-beige transition-colors active:border-tl-gold active:text-tl-gold sm:min-h-0 sm:py-2.5 sm:text-xs sm:hover:border-tl-gold sm:hover:text-tl-gold"
    >
      {label}
    </Link>
  );
}
