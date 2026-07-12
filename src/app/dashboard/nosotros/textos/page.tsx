import { AboutTextsManager } from "@/components/dashboard/nosotros/AboutTextsManager";
import Link from "next/link";

export default function DashboardNosotrosTextosPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/nosotros"
        className="inline-flex font-outfit text-xs uppercase tracking-[0.14em] text-tl-beige/50 hover:text-tl-gold"
      >
        ← Nosotros
      </Link>
      <AboutTextsManager />
    </div>
  );
}
