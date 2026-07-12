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
  const title = `${property.title} | Total Living`;
  const description = [
    `Mira esta propiedad en Total Living.`,
    `${operation} en ${location}.`,
    price,
    property.bedrooms > 0 ? `${property.bedrooms} recámaras.` : null,
  ]
    .filter(Boolean)
    .join(" ");

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
      title: "Mira esta propiedad en Total Living",
      description: `${property.title} · ${operation} · ${location} · ${price}`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Mira esta propiedad en Total Living",
      description: `${property.title} · ${location} · ${price}`,
    },
  };
}

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

  return (
    <PropertyDetailView
      property={property}
      photos={photos}
      similarProperties={similarProperties}
    />
  );
}
