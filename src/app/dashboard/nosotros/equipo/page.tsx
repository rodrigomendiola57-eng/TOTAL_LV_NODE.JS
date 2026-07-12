import { TeamCatalogManager } from "@/components/dashboard/nosotros/TeamCatalogManager";
import Link from "next/link";

export default function DashboardNosotrosEquipoPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/nosotros"
        className="inline-flex font-outfit text-xs uppercase tracking-[0.14em] text-tl-beige/50 hover:text-tl-gold"
      >
        ← Nosotros
      </Link>
      <TeamCatalogManager />
    </div>
  );
}
