import { getSiteOrigin } from "@/lib/site-url";
import type { Property } from "@/types/property";
import { formatPropertyLocation } from "@/types/property";

/* ────────────────────────────────────────────────────────────────────────────
 * JSON-LD Schema.org helpers — Total Living
 *
 * Estos componentes renderizan <script type="application/ld+json"> que Google
 * usa para rich snippets, Knowledge Panel y Real Estate Listings.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Datos genéricos de la organización Total Living. */
export function OrganizationJsonLd() {
  const origin = getSiteOrigin();

  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Total Living",
    url: origin,
    logo: `${origin}/logo-symbol.svg`,
    description:
      "Firma inmobiliaria premium en Querétaro. Estrategia real detrás de cada propiedad: venta, renta, desarrollos e inversión.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Querétaro",
      addressRegion: "Querétaro",
      addressCountry: "MX",
    },
    areaServed: {
      "@type": "City",
      name: "Querétaro",
    },
    sameAs: [
      "https://www.instagram.com/totalliving.mx",
      "https://www.facebook.com/totallivingmx",
      "https://www.tiktok.com/@totalliving.mx",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Breadcrumb list para Google rich snippets. */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** WebSite schema — activa el "sitelinks search box" en Google. */
export function WebSiteJsonLd() {
  const origin = getSiteOrigin();

  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Total Living",
    url: origin,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${origin}/propiedades/venta?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Ficha estructurada de propiedad (RealEstateListing / SingleFamilyResidence / Apartment). */
export function PropertyJsonLd({ property }: { property: Property }) {
  const origin = getSiteOrigin();
  const pageUrl = `${origin}/propiedades/${property.id}`;
  const locationName = formatPropertyLocation(property);

  // Mapeo del tipo de propiedad interna a Schema.org
  let schemaType = "SingleFamilyResidence";
  if (property.property_type === "Departamento" || property.property_type === "Penthouse") {
    schemaType = "Apartment";
  } else if (property.property_type === "Terreno") {
    schemaType = "Landform";
  } else if (
    property.property_type === "Local Comercial" ||
    property.property_type === "Bodega" ||
    property.property_type === "Nave industrial" ||
    property.property_type === "Oficina" ||
    property.property_type === "Consultorio"
  ) {
    schemaType = "CommercialProperties";
  }

  const data = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: property.title,
    description: property.description,
    url: pageUrl,
    image: property.cover_image_url || `${origin}/logo-symbol.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address || "",
      addressLocality: property.city || "Querétaro",
      addressRegion: property.state || "Querétaro",
      postalCode: property.postal_code || "",
      addressCountry: "MX",
    },
    geo:
      property.latitude && property.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: property.latitude,
            longitude: property.longitude,
          }
        : undefined,
    numberOfRooms: property.bedrooms || undefined,
    numberOfBathroomsTotal:
      property.full_bathrooms + (property.half_bathrooms ? 0.5 : 0),
    floorSize:
      property.build_area_m2 && parseFloat(property.build_area_m2) > 0
        ? {
            "@type": "QuantitativeValue",
            value: parseFloat(property.build_area_m2),
            unitCode: "MTK", // Metros cuadrados
          }
        : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
