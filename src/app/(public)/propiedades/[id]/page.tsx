import { getPropertyById, getAllProperties } from "@/lib/api";
import { getPropertyPhotos } from "@/lib/api/property-photos";
import { PropertyPhotoGallery } from "@/components/ui/PropertyPhotoGallery";
import {
  formatPropertyBathrooms,
  formatPropertyLocation,
} from "@/types/property";
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

function formatPrice(value: string, currency: string): string {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return `${value} ${currency}`;

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(parsed);
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

  return (
    <main className="flex flex-1 flex-col bg-tl-black text-tl-beige">
      <PropertyPhotoGallery
        photos={photos}
        title={property.title}
        fallbackUrl={property.cover_image_url}
        variant="hero"
      />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pb-20 pt-10">
        <p className="font-outfit font-light text-xs uppercase tracking-[0.2em] text-tl-gold">
          {property.property_type} · {property.operation_type}
        </p>
        <h1 className="mt-4 font-cormorant text-5xl font-light text-tl-beige sm:text-6xl">
          {property.title}
        </h1>
      <p className="mt-4 font-outfit font-light text-base text-tl-beige/80">
        {formatPropertyLocation(property)}
      </p>
      {property.description ? (
        <p className="mt-4 max-w-3xl font-outfit font-light text-sm leading-relaxed text-tl-beige/75">
          {property.description}
        </p>
      ) : null}

      <section className="mt-12 rounded-2xl border border-tl-gold/30 bg-tl-black/60 p-8">
        <p className="font-outfit text-2xl font-extralight tracking-[0.02em] text-tl-gold">
          {formatPrice(property.price, property.currency)}
        </p>

        <div className="mt-8 grid gap-6 border-t border-tl-gold/20 pt-6 sm:grid-cols-3">
          <div>
            <p className="font-outfit font-light text-xs uppercase tracking-[0.15em] text-tl-olive">
              Recámaras
            </p>
            <p className="mt-2 font-cormorant text-3xl text-tl-beige">
              {property.bedrooms}
            </p>
          </div>
          <div>
            <p className="font-outfit font-light text-xs uppercase tracking-[0.15em] text-tl-olive">
              Baños
            </p>
            <p className="mt-2 font-cormorant text-3xl text-tl-beige">
              {formatPropertyBathrooms(property)}
            </p>
          </div>
          <div>
            <p className="font-outfit font-light text-xs uppercase tracking-[0.15em] text-tl-olive">
              Superficie construida
            </p>
            <p className="mt-2 font-cormorant text-3xl text-tl-beige">
              {property.build_area_m2} m2
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-10 rounded-full border border-tl-gold px-6 py-3 font-outfit font-light text-xs uppercase tracking-[0.18em] text-tl-gold transition-colors hover:bg-tl-gold hover:text-tl-black"
        >
          Contactar
        </button>
      </section>
      </div>
    </main>
  );
}
