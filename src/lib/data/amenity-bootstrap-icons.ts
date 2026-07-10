/**
 * Mapeo de amenidad (slug) → nombre de ícono de Bootstrap Icons.
 * Se usa en la ficha pública para un estilo minimalista y uniforme.
 * Todos los nombres fueron verificados contra `bootstrap-icons`.
 */
const AMENITY_BOOTSTRAP_ICONS: Record<string, string> = {
  // Seguridad
  "caseta-vigilancia": "shield-shaded",
  "vigilancia-24-7": "shield-check",
  "acceso-controlado": "key",
  "circuito-cerrado": "camera-video",
  "privada-cerrada": "shield-lock",
  "porton-electrico": "door-closed",
  alarma: "bell",
  interfon: "telephone",
  "fraccionamiento-privado": "houses",
  portero: "person-badge",

  // Amenidades del desarrollo
  alberca: "water",
  gimnasio: "heart-pulse",
  "casa-club": "buildings",
  "salon-eventos": "calendar-event",
  "juegos-infantiles": "balloon",
  "cancha-padel": "dribbble",
  "cancha-tenis": "dribbble",
  "cancha-multiusos": "trophy",
  asadores: "fire",
  "business-center": "briefcase",
  "sala-juntas": "people",
  spa: "flower1",
  sauna: "thermometer-sun",
  jacuzzi: "droplet",
  "roof-garden": "tree",
  "pet-friendly": "heart",
  ciclovia: "bicycle",
  lago: "water",
  ludoteca: "puzzle",
  cine: "film",

  // Interiores
  "cocina-integral": "egg-fried",
  "cocina-equipada": "egg-fried",
  cocina: "egg-fried",
  closets: "door-open",
  "aire-acondicionado": "snow",
  calefaccion: "thermometer-half",
  chimenea: "fire",
  "cuarto-lavado": "droplet-half",
  "cuarto-servicio": "door-closed",
  estudio: "laptop",
  "family-room": "tv",
  "bodega-storage": "box-seam",
  domotica: "cpu",
  "pisos-madera": "grid-1x2",
  "doble-altura": "arrows-vertical",
  elevador: "arrow-down-up",
  amueblado: "lamp",
  "conexion-para-lavadora": "droplet-half",
  "dormitorio-principal": "door-open",
  "recamara-en-planta-baja": "door-open",

  // Exteriores y áreas verdes
  "jardin-privado": "tree",
  terraza: "brightness-high",
  balcon: "window",
  "alberca-privada": "water",
  "asador-propio": "fire",
  "patio-servicio": "grid",
  "estacionamiento-techado": "car-front",
  "paneles-solares": "brightness-high",
  fogatero: "fire",
  "estacionamiento-de-visitas": "car-front",
  "facilidad-para-estacionarse": "p-square",
  patio: "grid",
  "riego-por-aspersion": "moisture",

  // Servicios
  "agua-potable": "droplet",
  drenaje: "water",
  electricidad: "plug",
  "gas-natural": "fire",
  "internet-fibra": "wifi",
  cisterna: "bucket",
  tinaco: "bucket",
  "planta-luz": "lightning-charge",
  "calentador-solar": "sun",
  conmutador: "telephone",
  hidroneumatico: "speedometer2",
  "permitido-fumar": "wind",

  // Ubicación y vistas
  "vista-montana": "triangle",
  "vista-lago": "water",
  "vista-panoramica": "binoculars",
  "cerca-escuelas": "mortarboard",
  "cerca-comercios": "shop",
  "cerca-hospitales": "hospital",
  "acceso-autopista": "signpost-split",

  // Accesibilidad
  "accesible-para-adultos-mayores": "person-wheelchair",
  "accesible-para-personas-con-discapacidad": "person-wheelchair",
};

const FALLBACK_ICON = "check2-circle";

export function getAmenityBootstrapIcon(slug: string): string {
  return AMENITY_BOOTSTRAP_ICONS[slug] ?? FALLBACK_ICON;
}
