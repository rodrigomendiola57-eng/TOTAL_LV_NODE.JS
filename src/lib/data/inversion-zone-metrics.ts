import type {
  AsesoriaInvestmentMetric,
  AsesoriaOpportunityZone,
} from "@/lib/data/asesoria";

/**
 * Métricas de inversión por zona del catálogo Querétaro.
 *
 * Fuentes (mercado 2025–2026, no promesa oficial):
 * - Variant Realty — top zonas plusvalía Querétaro 2026
 * - Atlas Desarrollos — Juriquilla vs Zibatá (crecimiento anual est. 2026)
 * - TheLatinvestor — rental yields / vacancia residencial Querétaro 2026
 * - Inmuebles24 / Líder Empresarial — rentabilidad bruta ciudad ~6.8% (2025)
 * - Homes Querétaro / HolaNeo — plusvalía y vacancia por corredor
 *
 * Plusvalía: punto medio de rangos publicados (se temperan claims de desarrollador).
 * Horizonte: años estimados para consolidar ~30% de plusvalía acumulada a esa tasa.
 * Ocupación: 100 − vacancia reportada / inferida por corredor.
 */
export type InversionZoneProfile = {
  id: string;
  slug: string;
  shortName: string;
  plusvalia: number;
  horizonteAnios: number;
  ocupacion: number;
  demandScore: number;
  /** Rendimiento neto de renta tipificado (TheLatinvestor y afines). */
  roiLabel: string;
  note: string;
};

export const INVERSION_ZONE_PROFILES: InversionZoneProfile[] = [
  {
    id: "campanario",
    slug: "campanario-altozano",
    shortName: "Campanario",
    plusvalia: 8,
    horizonteAnios: 4.5,
    ocupacion: 88,
    demandScore: 78,
    roiLabel: "3.5–4.7% neto",
    note: "Lujo consolidado: alta retención de valor, menor rotación y yield de renta más bajo por ticket elevado.",
  },
  {
    id: "centro",
    slug: "centro-tradicional",
    shortName: "Centro",
    plusvalia: 7,
    horizonteAnios: 4.2,
    ocupacion: 97,
    demandScore: 72,
    roiLabel: "4.8–5.8% neto",
    note: "Demanda urbana y turística estable; plusvalía más moderada que los corredores planeados del norte.",
  },
  {
    id: "centro-sur",
    slug: "centro-sur",
    shortName: "Centro Sur",
    plusvalia: 9,
    horizonteAnios: 3.2,
    ocupacion: 94,
    demandScore: 84,
    roiLabel: "4.9–5.3% neto",
    note: "Corredor corporativo con buena colocación en renta a profesionistas; equilibrio plusvalía–flujo.",
  },
  {
    id: "ciudad-del-sol",
    slug: "ciudad-del-sol",
    shortName: "Ciudad del Sol",
    plusvalia: 8,
    horizonteAnios: 3.6,
    ocupacion: 91,
    demandScore: 70,
    roiLabel: "4.5–5.5% neto",
    note: "Poniente familiar consolidado: crecimiento medio y demanda local constante, sin picos de especulación.",
  },
  {
    id: "corregidora",
    slug: "corregidora",
    shortName: "Corregidora",
    plusvalia: 9,
    horizonteAnios: 3.4,
    ocupacion: 92,
    demandScore: 76,
    roiLabel: "5–6% neto",
    note: "Más terreno por peso y expansión residencial (Vista Real, Tejeda); ticket de entrada competitivo.",
  },
  {
    id: "el-refugio",
    slug: "el-refugio",
    shortName: "El Refugio",
    plusvalia: 8.5,
    horizonteAnios: 3.3,
    ocupacion: 96,
    demandScore: 86,
    roiLabel: "5.2–5.6% neto",
    note: "Alta absorción familiar y vacancia baja; relación valor–precio fuerte para renta e inversión media.",
  },
  {
    id: "juriquilla",
    slug: "juriquilla-jurica",
    shortName: "Juriquilla",
    plusvalia: 10,
    horizonteAnios: 3.2,
    ocupacion: 97,
    demandScore: 90,
    roiLabel: "5–7.2% neto",
    note: "Mercado premium maduro: plusvalía sostenida y vacancia muy baja; depas 2 rec. con yields netos altos.",
  },
  {
    id: "zibata",
    slug: "zibata-zakia",
    shortName: "Zibatá",
    plusvalia: 11,
    horizonteAnios: 2.8,
    ocupacion: 94,
    demandScore: 92,
    roiLabel: "5.5–6.4% neto",
    note: "Master plan con plusvalía acelerada (rangos públicos ~10–12%); fuerte presión de demanda e inventario nuevo.",
  },
];

export const DEFAULT_INVERSION_ZONE_ID = "juriquilla";

export const INVERSION_METRICS_DISCLAIMER =
  "Estimaciones de mercado 2025–2026 a partir de reportes públicos; no constituyen proyección garantizada.";

export const INVERSION_METRICS_DISCLAIMER_EN =
  "Market estimates 2025–2026 based on public reports; they do not constitute a guaranteed projection.";

export function getInversionZoneProfile(
  id: string,
): InversionZoneProfile | undefined {
  return INVERSION_ZONE_PROFILES.find((zone) => zone.id === id);
}

export function buildInvestmentMetrics(
  zone: InversionZoneProfile,
  locale: string = "es",
): AsesoriaInvestmentMetric[] {
  const isEn = locale === "en";
  return [
    {
      id: "plusvalia",
      value: zone.plusvalia,
      decimals: zone.plusvalia % 1 === 0 ? 0 : 1,
      prefix: "+",
      suffix: "%",
      label: isEn
        ? `Average annual appreciation · ${zone.shortName}`
        : `Plusvalía anual promedio · ${zone.shortName}`,
    },
    {
      id: "payback",
      value: zone.horizonteAnios,
      decimals: 1,
      suffix: isEn ? " years" : " años",
      label: isEn
        ? `Average return horizon · ${zone.shortName}`
        : `Horizonte promedio de retorno · ${zone.shortName}`,
    },
    {
      id: "ocupacion",
      value: zone.ocupacion,
      suffix: "%",
      label: isEn
        ? `Estimated rental occupancy · ${zone.shortName}`
        : `Ocupación estimada en renta · ${zone.shortName}`,
    },
  ];
}

const ZONE_NOTES_EN: Record<string, string> = {
  campanario: "Consolidated luxury: high value retention, lower turnover, and lower rental yield due to high entry price.",
  centro: "Stable urban and tourist demand; more moderate appreciation than the planned northern corridors.",
  "centro-sur": "Corporate corridor with good tenant placement for professionals; balance of appreciation and cash flow.",
  "ciudad-del-sol": "Consolidated family area in the west: medium growth and constant local demand, without speculative spikes.",
  corregidora: "More space per value and residential expansion (Vista Real, Tejeda); competitive entry price.",
  "el-refugio": "High family absorption and low vacancy; strong value-to-price ratio for average rent and investment.",
  juriquilla: "Mature premium market: sustained appreciation and very low vacancy; 2-bed apartments with high net yields.",
  zibata: "Master plan with accelerated appreciation (public ranges ~10–12%); strong demand pressure and new inventory.",
};

export function toOpportunityZone(
  zone: InversionZoneProfile,
  locale: string = "es",
): AsesoriaOpportunityZone {
  const isEn = locale === "en";
  return {
    id: zone.id,
    name: zone.shortName,
    demandScore: zone.demandScore,
    roiLabel: isEn ? zone.roiLabel.replace("neto", "net") : zone.roiLabel,
    note: isEn ? (ZONE_NOTES_EN[zone.id] ?? zone.note) : zone.note,
  };
}
