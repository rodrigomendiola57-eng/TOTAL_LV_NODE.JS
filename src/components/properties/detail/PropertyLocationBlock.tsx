"use client";

import { DetailButton } from "@/components/properties/detail/DetailButton";
import type { Property } from "@/types/property";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";

const PropertyLocationMap = dynamic(
  () =>
    import("@/components/properties/detail/PropertyLocationMap").then(
      (module) => module.PropertyLocationMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[min(52vw,17rem)] animate-pulse bg-tl-olive/20 sm:h-80 lg:h-[27rem]" />
    ),
  },
);

interface PropertyLocationBlockProps {
  property: Property;
  mapsUrl: string;
}

export function PropertyLocationBlock({
  property,
  mapsUrl,
}: PropertyLocationBlockProps) {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
      <PropertyLocationMap
        latitude={property.latitude}
        longitude={property.longitude}
        title={property.title}
      />

      <div className="flex flex-col gap-5 border-t border-white/8 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0 space-y-2 text-center sm:text-left">
          <p className="font-outfit text-[clamp(1rem,2vw,1.1rem)] font-extralight tracking-[0.01em] text-tl-beige/88">
            {property.address}
          </p>
          <p className="font-outfit text-sm font-extralight tracking-[0.04em] text-tl-gold/75">
            {property.city}, {property.state} · CP {property.postal_code}
          </p>
        </div>

        <DetailButton
          href={mapsUrl}
          label="Abrir en Google Maps"
          icon={ArrowUpRight}
          variant="ghost"
          external
          className="w-full sm:w-auto sm:min-w-[12rem]"
        />
      </div>
    </div>
  );
}
