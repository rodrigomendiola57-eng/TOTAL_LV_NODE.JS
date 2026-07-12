import type { QueretaroZone } from "@/types/property";

export type ZoneGrowthLabel =
  | "Plusvalía premium"
  | "Crecimiento alto"
  | "Crecimiento medio"
  | "Emergente";

/** Shape del catálogo público / dashboard (alineado a API Django). */
export interface ZoneCatalogEntry {
  id: number;
  slug: string;
  name: QueretaroZone;
  growthLabel: ZoneGrowthLabel;
  description: string;
  subZones: string[];
  image: string;
  isPublished?: boolean;
  order?: number;
  updatedAt?: string;
}
