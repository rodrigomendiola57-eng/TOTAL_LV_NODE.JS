import type { HomePageContent } from "@/types/home-content";

/** Fallback local si la API no responde (espejo del contenido actual del sitio). */
export const HOME_CONTENT_FALLBACK: HomePageContent = {
  id: 1,
  is_published: true,
  updated_at: "",
  hero_eyebrow: "Real Estate Premium",
  hero_title: "Total Living",
  hero_subtitle: "Estrategia Real detrás de cada Propiedad",
  hero_background_url: null,
  hero_video_url: null,
  about_eyebrow: "Quiénes somos",
  about_title: "Estrategia Real detrás de cada Propiedad",
  about_body:
    "Total Living es una firma inmobiliaria premium en Querétaro. Acompañamos cada decisión con análisis, estrategia y ejecución para que inviertas con claridad y tranquilidad.",
  about_cta_label: "Conoce al equipo",
  about_cta_url: "/nosotros",
  about_social_label: "Síguenos",
  about_slides: [],
  featured_eyebrow: "Selección Total Living",
  featured_title: "Propiedades Destacadas",
  featured_empty_message:
    "Aún no hay propiedades destacadas publicadas. En breve mostraremos nuevas oportunidades premium.",
  featured_links: [
    { label: "Propiedades en Venta", href: "/propiedades/venta" },
    { label: "Propiedades en Renta", href: "/propiedades/renta" },
    { label: "Desarrollos", href: "/propiedades/desarrollos" },
  ],
  city_highlight: {
    aria_label: "Querétaro — epicentro del lujo inmobiliario",
    city_name: "Querétaro",
    title: "El epicentro del lujo y la plusvalía",
    description:
      "Querétaro concentra la mayor proyección de desarrollo inmobiliario premium en el Bajío. La zona correcta, en el momento exacto, transforma una simple compra en un legado patrimonial.",
    image_desktop_url: "/images/home/queretaro-desktop.jpg",
    image_mobile_url: "/images/home/queretaro-mobile.jpg",
    external_desktop_url: "/images/home/queretaro-desktop.jpg",
    external_mobile_url: "/images/home/queretaro-mobile.jpg",
  },
  zones_eyebrow: "Zonas",
  zones_title: "Ubicaciones Estratégicas",
  zones_description:
    "Explora las 8 zonas principales de Querétaro con experiencia inmersiva a pantalla completa: Campanario, Juriquilla, Zibatá, Centro y más.",
  zones_cta_label: "Explorar zonas",
  zones_cta_url: "/zonas",
  contact_eyebrow: "Contacto",
  contact_title: "¿Listo para dar el siguiente paso?",
  contact_description:
    "Visita nuestro módulo de contacto y cuéntanos qué buscas. Tu consulta llegará directo al equipo comercial.",
  contact_cta_label: "Ir a contacto",
  contact_cta_url: "/contacto",
  expertise_title: "Inteligencia Inmobiliaria para Decisiones Reales",
  expertise_subtitle:
    "Un solo equipo para asesorarte, analizar el mercado y ejecutar con el estándar premium que tu patrimonio merece.",
  expertise_services: [],
  expertise_pillars: [],
  journal_posts: [],
};
