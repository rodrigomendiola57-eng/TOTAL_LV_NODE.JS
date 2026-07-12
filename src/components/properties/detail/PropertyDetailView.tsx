import { PropertyContactCard } from "@/components/properties/detail/PropertyContactCard";
import { PropertyDetailGallery } from "@/components/properties/detail/PropertyDetailGallery";
import { PropertyDetailSection } from "@/components/properties/detail/PropertyDetailSection";
import { PropertyLocationBlock } from "@/components/properties/detail/PropertyLocationBlock";
import { PropertyAmenitiesPanel } from "@/components/properties/detail/PropertyAmenitiesPanel";
import { PropertyMetricsRibbon } from "@/components/properties/detail/PropertyMetricsRibbon";
import { PropertySimilarPanel } from "@/components/properties/detail/PropertySimilarPanel";
import { PropertySpecsPanel } from "@/components/properties/detail/PropertySpecsPanel";
import { formatPrice } from "@/lib/format-price";
import {
  buildPropertyHighlights,
  buildPropertySpecs,
  formatPropertyDescription,
  getCatalogBackHref,
  getPropertyMapsUrl,
} from "@/lib/property-detail";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";
import type { Property } from "@/types/property";
import { formatPropertyLocation } from "@/types/property";
import type { PropertyPhoto } from "@/types/property-photo";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";

interface PropertyDetailViewProps {
  property: Property;
  photos: PropertyPhoto[];
  similarProperties: Property[];
}

export function PropertyDetailView({
  property,
  photos,
  similarProperties,
}: PropertyDetailViewProps) {
  const highlights = buildPropertyHighlights(property);
  const specs = buildPropertySpecs(property);
  const amenities = property.amenities_detail ?? [];
  const description = formatPropertyDescription(property.description);
  const mapsUrl = getPropertyMapsUrl(property);
  const backHref = getCatalogBackHref(property);
  const backLabel =
    property.operation_type === "Renta"
      ? "Propiedades en renta"
      : "Propiedades en venta";

  return (
    <main className="relative flex flex-1 flex-col overflow-x-hidden bg-tl-black pb-28 text-tl-beige lg:pb-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(ellipse_at_top,rgba(214,181,133,0.07),transparent_58%)]"
        aria-hidden="true"
      />

      <div
        className={`relative mx-auto w-full max-w-7xl px-4 sm:px-6 ${HERO_CONTENT_OFFSET}`}
      >
        <nav className="mb-6 flex items-center gap-2 font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-beige/50">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-2 py-1 transition-colors hover:border-white/10 hover:text-tl-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </Link>
          <span className="text-tl-gold/30">/</span>
          <span className="line-clamp-1 text-tl-beige/65">{property.title}</span>
        </nav>

        <PropertyDetailGallery
          photos={photos}
          title={property.title}
          fallbackUrl={property.cover_image_url}
        />

        {highlights.length > 0 ? (
          <div className="hidden lg:mt-6 lg:block">
            <PropertyMetricsRibbon items={highlights} />
          </div>
        ) : null}

        <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-12">
            <header className="space-y-5">
              <div className="space-y-4">
                <p className="font-outfit text-[clamp(1.85rem,7vw,2.35rem)] font-extralight leading-none tracking-[0.01em] text-tl-gold lg:hidden">
                  {formatPrice(property.price, property.currency)}
                </p>

                <h1 className="max-w-4xl font-outfit text-fluid-h2 font-extralight tracking-[0.01em] text-tl-beige">
                  {property.title}
                </h1>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                  <p className="inline-flex items-center gap-2 font-outfit text-sm font-extralight text-tl-beige/72">
                    <MapPin
                      className="h-4 w-4 shrink-0 text-tl-gold/85"
                      strokeWidth={1.5}
                    />
                    {formatPropertyLocation(property)}
                  </p>
                  <span className="hidden h-4 w-px bg-white/10 sm:block" />
                  <p className="font-outfit text-sm font-extralight text-tl-beige/48">
                    {property.address}
                  </p>
                </div>
              </div>
            </header>

            {highlights.length > 0 ? (
              <div className="lg:hidden">
                <PropertyMetricsRibbon items={highlights} />
              </div>
            ) : null}

            {specs.length > 0 || property.technical_sheet_url ? (
              <PropertyDetailSection
                title="Ficha técnica"
                subtitle="Especificaciones y medidas"
              >
                <PropertySpecsPanel items={specs} property={property} />
              </PropertyDetailSection>
            ) : null}

            {description ? (
              <PropertyDetailSection
                title="Descripción"
                subtitle="Detalles de la propiedad"
              >
                <div className="whitespace-pre-line font-outfit text-[0.95rem] font-extralight leading-8 tracking-[0.02em] text-tl-beige/72 sm:text-base sm:leading-8">
                  {description}
                </div>
              </PropertyDetailSection>
            ) : null}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              <PropertyContactCard property={property} />
              <PropertySimilarPanel
                properties={similarProperties}
                zone={property.zone}
              />
            </div>
          </aside>
        </div>

        {/* Secciones a todo el ancho, centradas */}
        <div className="mt-12 space-y-12 lg:mt-16 lg:space-y-16">
          {amenities.length > 0 ? (
            <PropertyDetailSection
              title="Amenidades"
              subtitle="Lo que ofrece este desarrollo"
              wide
            >
              <PropertyAmenitiesPanel amenities={amenities} />
            </PropertyDetailSection>
          ) : null}

          <PropertyDetailSection
            title="Ubicación"
            subtitle="Consulta la zona en el mapa"
            wide
          >
            <PropertyLocationBlock property={property} mapsUrl={mapsUrl} />
          </PropertyDetailSection>

          {similarProperties.length > 0 ? (
            <PropertySimilarPanel
              properties={similarProperties}
              zone={property.zone}
              variant="carousel"
            />
          ) : null}
        </div>
      </div>

      <PropertyContactCard property={property} variant="mobile" />
    </main>
  );
}
