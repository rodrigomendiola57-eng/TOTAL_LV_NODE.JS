import { ZonesCatalogManager } from "@/components/dashboard/zonas/ZonesCatalogManager";
import { listZonesApi, type ZoneApiModel } from "@/lib/api/zones";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardZonasCatalogoPage() {
  let initialRows: ZoneApiModel[] = [];
  try {
    initialRows = await listZonesApi({ all: true, revalidate: false });
  } catch {
    initialRows = [];
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/zonas"
        className="inline-flex font-outfit text-xs uppercase tracking-[0.14em] text-tl-beige/50 hover:text-tl-gold"
      >
        ← Zonas
      </Link>
      <ZonesCatalogManager initialRows={initialRows} />
    </div>
  );
}
