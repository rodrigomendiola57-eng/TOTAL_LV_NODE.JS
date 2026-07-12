/**
 * Mapea amenidades de desarrollos (texto libre) a un icono de Bootstrap Icons
 * por coincidencia de palabra clave, con un fallback elegante.
 */
const KEYWORD_ICONS: { keywords: string[]; icon: string }[] = [
  { keywords: ["alberca", "piscina", "infinity", "pool", "climatizada"], icon: "water" },
  { keywords: ["gimnasio", "gym", "fitness"], icon: "heart-pulse" },
  { keywords: ["roof", "rooftop", "sky lounge"], icon: "building-up" },
  { keywords: ["terraza techada", "techada"], icon: "house" },
  { keywords: ["terraza", "lounge"], icon: "umbrella" },
  { keywords: ["coworking", "business", "office"], icon: "laptop" },
  {
    keywords: ["seguridad", "acceso", "vigilancia", "vigilado", "24/7", "caseta"],
    icon: "shield-check",
  },
  { keywords: ["pádel", "padel", "cancha", "tenis", "deporte"], icon: "dribbble" },
  { keywords: ["pet", "mascota"], icon: "heart" },
  { keywords: ["spa", "sauna", "wellness"], icon: "flower1" },
  { keywords: ["wine", "cava", "bar"], icon: "cup-straw" },
  { keywords: ["fogatero", "fogata", "asador", "grill", "bbq"], icon: "fire" },
  { keywords: ["juegos", "infantil", "niños", "kids"], icon: "balloon" },
  { keywords: ["salón", "salon", "usos múltiples", "eventos"], icon: "people" },
  {
    keywords: ["área verde", "areas verdes", "áreas verdes", "jardín", "jardin", "parque"],
    icon: "tree",
  },
  { keywords: ["camastro", "asoleadero", "solárium", "solarium"], icon: "brightness-high" },
  { keywords: ["baño", "baños", "restroom", "sanitario"], icon: "person-bounding-box" },
  {
    keywords: ["estacionamiento", "parking", "cochera", "visitas"],
    icon: "p-circle",
  },
  { keywords: ["ciclo", "bici", "bike"], icon: "bicycle" },
  { keywords: ["domótica", "domotica", "smart"], icon: "cpu" },
  { keywords: ["concierge", "recepción", "recepcion"], icon: "bell" },
  { keywords: ["casa club", "club house", "clubhouse"], icon: "building" },
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
