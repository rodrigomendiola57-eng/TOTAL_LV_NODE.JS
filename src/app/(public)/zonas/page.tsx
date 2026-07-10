import { ZonesView } from "@/components/zones/ZonesView";
import { ZONE_CATALOG } from "@/lib/data/zones";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zonas | Total Living",
  description:
    "Explora las principales zonas de Querétaro: Campanario, Juriquilla, Zibatá, Centro y más. Encuentra propiedades en las ubicaciones más estratégicas.",
};

export default function ZonasPage() {
  return <ZonesView zones={ZONE_CATALOG} />;
}
