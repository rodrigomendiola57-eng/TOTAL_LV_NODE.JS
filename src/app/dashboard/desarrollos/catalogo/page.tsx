import { DevelopmentsCatalogManager } from "@/components/dashboard/desarrollos/DevelopmentsCatalogManager";
import {
  listDevelopmentsApi,
  type DevelopmentApiModel,
} from "@/lib/api/developments";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardDesarrollosCatalogoPage() {
  let initialRows: DevelopmentApiModel[] = [];
  try {
    initialRows = await listDevelopmentsApi();
  } catch {
    initialRows = [];
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/desarrollos"
        className="inline-flex font-outfit text-xs uppercase tracking-[0.14em] text-tl-beige/50 hover:text-tl-gold"
      >
        ← Desarrollos
      </Link>
      <DevelopmentsCatalogManager initialRows={initialRows} />
    </div>
  );
}
