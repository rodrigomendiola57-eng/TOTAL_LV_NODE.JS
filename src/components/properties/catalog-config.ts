export interface PropertyCatalogConfig {
  title: string;
  subtitle: string;
  heroImage: string;
  emptyMessage: string;
  contactHref: string;
  resultsLabel: string;
}

export const VENTA_CATALOG: PropertyCatalogConfig = {
  title: "Propiedades en Venta",
  subtitle:
    "Descubre espacios diseñados para convertirse en tu próximo legado",
  heroImage:
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2070&auto=format&fit=crop",
  emptyMessage:
    "Actualmente estamos actualizando nuestro portafolio de venta. Por favor, vuelve pronto o contacta a un asesor.",
  contactHref: "/contacto",
  resultsLabel: "en venta",
};

export const RENTA_CATALOG: PropertyCatalogConfig = {
  title: "Propiedades en Renta",
  subtitle: "Residencias y espacios premium listos para tu estilo de vida",
  heroImage:
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
  emptyMessage:
    "Por el momento no hay propiedades en renta disponibles. Contáctanos y te avisamos cuando haya nuevas opciones.",
  contactHref: "/contacto",
  resultsLabel: "en renta",
};

export const DESARROLLOS_CATALOG: PropertyCatalogConfig = {
  title: "Desarrollos",
  subtitle: "Proyectos inmobiliarios de alto valor en las zonas más exclusivas",
  heroImage:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  emptyMessage:
    "Estamos preparando nuevos desarrollos para ti. Mientras tanto, un asesor puede orientarte sobre preventas.",
  contactHref: "/contacto",
  resultsLabel: "desarrollos",
};
