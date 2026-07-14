const TRANSLATIONS: Record<string, string> = {
  // Budget / Capital
  "$2 – $4 MDP": "$2M – $4M MXN",
  "$4 – $7 MDP": "$4M – $7M MXN",
  "$7 – $12 MDP": "$7M – $12M MXN",
  "$12 – $20 MDP": "$12M – $20M MXN",
  "Más de $20 MDP": "Over $20M MXN",
  "Por definir con asesor": "To be defined with advisor",
  "$1 – $2 MDP": "$1M – $2M MXN",
  "Más de $12 MDP": "Over $12M MXN",
  "Aún no lo sé": "Don't know yet",

  // Property types
  "Casa": "House",
  "Departamento": "Apartment",
  "Penthouse": "Penthouse",
  "Casa en condominio": "Gated Community / Townhouse",
  "Terreno": "Land / Lot",
  "Indistinto": "Any",
  "Otro": "Other",
  "Preventa / desarrollo": "Pre-sale / Development",

  // Timelines / Horizon
  "0–30 días": "0–30 days",
  "1–3 meses": "1–3 months",
  "3–6 meses": "3–6 months",
  "Solo exploro": "Just exploring",
  "Lo antes posible": "As soon as possible",
  "Sin prisa": "No rush",
  "1–3 años": "1–3 years",
  "3–5 años": "3–5 years",
  "5+ años": "5+ years",
  "Aún exploro": "Just exploring",

  // Bedrooms
  "2+": "2+ beds",
  "3+": "3+ beds",
  "4+": "4+ beds",

  // Zones
  "Juriquilla": "Juriquilla",
  "Campanario": "Campanario",
  "Zibatá": "Zibatá",
  "Corregidora": "Corregidora",
  "Centro": "Downtown",
  "El Refugio": "El Refugio",
  "Centro Sur": "Centro Sur",
  "Ciudad del Sol": "Ciudad del Sol",
  "Otra zona": "Other zone",

  // Financing
  "Contado": "Cash / Cash-buy",
  "Crédito": "Mortgage / Financing",
  "Mixto": "Mixed / Cash & Mortgage",
  "Por definir": "To be defined",

  // Exclusive
  "Sí, exclusivo": "Yes, exclusive",
  "Aún no": "Not yet",
  "Sí, exclusiva": "Yes, exclusive",
  "Estoy explorando": "Just exploring",
  "Prefiero no exclusivo": "Prefer non-exclusive",

  // Condition
  "Lista para mostrar": "Move-in ready",
  "Mejoras menores": "Minor repairs needed",
  "Necesita remodelación": "Needs renovation",

  // Occupancy
  "Vacía": "Vacant",
  "Habitada": "Occupied (Owner)",
  "Rentada": "Rented (Tenant)",

  // Investment objectives
  "Plusvalía": "Capital Gain / Appreciation",
  "Flujo de renta": "Rental income / Cash flow",
  "Preservar capital": "Capital preservation",

  // Experience
  "Primera inversión": "First investment",
  "Ya he invertido": "Experienced",
  "Tengo portafolio": "Active portfolio",

  // Liquidity
  "Alta liquidez": "High liquidity",
  "Equilibrio": "Balanced / Moderate",
  "Puedo esperar": "Can wait / Long-term",
};

export function translateOptions<T extends { value: string; label: string }>(
  options: readonly T[],
  locale: string,
): T[] {
  if (locale !== "en") return [...options];
  return options.map((opt) => ({
    ...opt,
    label: TRANSLATIONS[opt.label] ?? opt.label,
  }));
}
