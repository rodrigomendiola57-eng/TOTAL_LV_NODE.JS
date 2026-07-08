import { getAllProperties } from "@/lib/api";
import { Building2, MessagesSquare, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardHomePage() {
  const properties = await getAllProperties();
  const featuredCount = properties.filter((p) => p.is_featured).length;
  const developmentsCount = properties.filter(
    (p) => p.property_type === "Condominio" || p.property_type === "Casa en condominio",
  ).length;

  const stats = [
    {
      label: "Propiedades activas",
      value: properties.length,
      icon: Building2,
      href: "/dashboard/propiedades",
    },
    {
      label: "Destacadas",
      value: featuredCount,
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
      value: 4,
      icon: MessagesSquare,
      href: "/dashboard/crm",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="font-outfit font-light text-[10px] uppercase tracking-[0.22em] text-tl-gold">
          Resumen
        </p>
        <h1 className="mt-2 font-cormorant text-4xl font-light text-tl-beige">
          Panel de Control
        </h1>
        <p className="mt-2 max-w-2xl font-outfit font-light text-sm text-tl-beige/65">
          Vista general del catálogo inmobiliario y la actividad comercial de
          Total Living.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-tl-gold/20 bg-tl-black/60 p-5 transition-colors hover:border-tl-gold/40 hover:bg-tl-black/80"
          >
            <div className="flex items-center justify-between">
              <p className="font-outfit font-light text-[10px] uppercase tracking-[0.16em] text-tl-beige/50">
                {stat.label}
              </p>
              <stat.icon className="h-4 w-4 text-tl-gold/70 transition-colors group-hover:text-tl-gold" />
            </div>
            <p className="mt-4 font-cormorant text-4xl text-tl-beige">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-tl-gold/20 bg-tl-black/60 p-6">
        <p className="font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-gold">
          Accesos rápidos
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <QuickLink href="/dashboard/propiedades" label="Gestionar propiedades" />
          <QuickLink href="/dashboard/crm" label="Abrir CRM omnicanal" />
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
      className="rounded-full border border-tl-gold/35 px-5 py-2.5 font-outfit font-light text-xs uppercase tracking-[0.14em] text-tl-beige/80 transition-colors hover:border-tl-gold hover:text-tl-gold"
    >
      {label}
    </Link>
  );
}
