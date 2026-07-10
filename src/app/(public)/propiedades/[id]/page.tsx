import { PropertyDetailView } from "@/components/properties/detail/PropertyDetailView";
import { getPropertyById, getAllProperties, getSimilarProperties } from "@/lib/api";
import { getPropertyPhotos } from "@/lib/api/property-photos";
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
