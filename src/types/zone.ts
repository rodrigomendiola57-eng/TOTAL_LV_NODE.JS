import type { QueretaroZone } from "@/types/property";

export type ZoneGrowthLabel =
  | "Plusvalía premium"
  | "Crecimiento alto"
  | "Crecimiento medio"
  | "Emergente";

export interface ZoneCatalogEntry {
  id: number;
  slug: string;
  name: QueretaroZone;
  growthLabel: ZoneGrowthLabel;
  description: string;
  subZones: string[];
  image: string;
}
