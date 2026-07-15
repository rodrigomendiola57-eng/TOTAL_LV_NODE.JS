import { PropertyDetailView } from "@/components/properties/detail/PropertyDetailView";
import { getPropertyById, getAllProperties, getSimilarProperties } from "@/lib/api";
import { getPropertyPhotos } from "@/lib/api/property-photos";
import { formatPrice } from "@/lib/format-price";
import { absoluteSiteUrl, getSiteOrigin } from "@/lib/site-url";
import { formatPropertyLocation } from "@/types/property";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const properties = await getAllProperties();
    return properties.map((property) => ({
      id: String(property.id),
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return { title: "Propiedad no encontrada | Total Living" };
  }

  const location = formatPropertyLocation(property);
  const price = formatPrice(property.price, property.currency);
  const operation = property.operation_type || "Propiedad";
  const pageUrl = absoluteSiteUrl(`/propiedades/${property.id}`);
  const title = `${property.title} — ${operation} en ${location}`;
  const descriptionParts = [
    `${property.title}.`,
    `${operation} en ${location}.`,
    price ? `Precio: ${price}.` : null,
    property.bedrooms > 0 ? `${property.bedrooms} recámaras.` : null,
    property.full_bathrooms > 0
      ? `${property.full_bathrooms} baños.`
      : null,
    property.build_area_m2 && parseFloat(property.build_area_m2) > 0
      ? `${property.build_area_m2} m² de construcción.`
      : null,
    property.property_type ? `Tipo: ${property.property_type}.` : null,
  ];
  const description = descriptionParts.filter(Boolean).join(" ");

  return {
    metadataBase: new URL(getSiteOrigin()),
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "website",
      locale: "es_MX",
      siteName: "Total Living",
      url: pageUrl,
      title: `${property.title} — ${price} | ${operation} en ${location}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.title} — ${price}`,
      description: `${operation} en ${location}. ${price}`,
    },
  };
}

import { PropertyJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  const photos = await getPropertyPhotos(property.id).catch(() => []);
  const similarProperties = await getSimilarProperties(property.id);

  const origin = getSiteOrigin();
  const catalogLabel = property.operation_type === "Renta" ? "Propiedades en Renta" : "Propiedades en Venta";
  const catalogPath = property.operation_type === "Renta" ? "/propiedades/renta" : "/propiedades/venta";

  const breadcrumbs = [
    { name: "Inicio", url: origin },
    { name: catalogLabel, url: `${origin}${catalogPath}` },
    { name: property.title, url: `${origin}/propiedades/${property.id}` },
  ];

  return (
    <>
      <PropertyJsonLd property={property} />
      <BreadcrumbJsonLd items={breadcrumbs} />
      <PropertyDetailView
        property={property}
        photos={photos}
        similarProperties={similarProperties}
      />
    </>
  );
}
