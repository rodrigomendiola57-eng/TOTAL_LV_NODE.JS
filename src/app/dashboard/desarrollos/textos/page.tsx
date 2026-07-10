import { DevelopmentsTextsManager } from "@/components/dashboard/desarrollos/DevelopmentsTextsManager";
import Link from "next/link";

export default function DashboardDesarrollosTextosPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/desarrollos"
        className="inline-flex font-outfit text-xs uppercase tracking-[0.14em] text-tl-beige/50 hover:text-tl-gold"
      >
        ← Desarrollos
      </Link>
      <DevelopmentsTextsManager />
    </div>
  );
}
