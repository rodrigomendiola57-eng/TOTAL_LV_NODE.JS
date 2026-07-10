/**
 * Mapea amenidades de desarrollos (texto libre) a un icono de Bootstrap Icons
 * por coincidencia de palabra clave, con un fallback elegante.
 */
const KEYWORD_ICONS: { keywords: string[]; icon: string }[] = [
  { keywords: ["alberca", "piscina", "infinity", "pool"], icon: "water" },
  { keywords: ["gimnasio", "gym", "fitness"], icon: "heart-pulse" },
  { keywords: ["roof", "rooftop", "sky", "terraza", "lounge"], icon: "building-up" },
  { keywords: ["coworking", "business", "office"], icon: "laptop" },
  { keywords: ["seguridad", "acceso", "vigilancia", "24/7"], icon: "shield-check" },
  { keywords: ["pádel", "padel", "cancha", "tenis", "deporte"], icon: "dribbble" },
  { keywords: ["pet", "mascota"], icon: "heart" },
  { keywords: ["spa", "sauna", "wellness"], icon: "flower1" },
  { keywords: ["wine", "cava", "bar"], icon: "cup-straw" },
  { keywords: ["asador", "grill", "bbq"], icon: "fire" },
  { keywords: ["juegos", "infantil", "niños", "kids"], icon: "balloon" },
  { keywords: ["salón", "salon", "usos múltiples", "eventos"], icon: "people" },
  { keywords: ["área verde", "areas verdes", "jardín", "jardin", "parque"], icon: "tree" },
  { keywords: ["ciclo", "bici", "bike"], icon: "bicycle" },
  { keywords: ["domótica", "domotica", "smart"], icon: "cpu" },
  { keywords: ["concierge", "recepción", "recepcion"], icon: "bell" },
];

export function getDevelopmentAmenityIcon(amenity: string): string {
  const normalized = amenity.toLowerCase();
  for (const { keywords, icon } of KEYWORD_ICONS) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return icon;
    }
  }
  return "check2-circle";
}
