import { ZonesTextsManager } from "@/components/dashboard/zonas/ZonesTextsManager";
import Link from "next/link";

export default function DashboardZonasTextosPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/zonas"
        className="inline-flex font-outfit text-xs uppercase tracking-[0.14em] text-tl-beige/50 hover:text-tl-gold"
      >
        ← Zonas
      </Link>
      <ZonesTextsManager />
    </div>
  );
}
