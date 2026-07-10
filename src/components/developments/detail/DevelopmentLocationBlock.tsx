"use client";

import type { Development } from "@/types/development";
import { ArrowUpRight, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

const DevelopmentMap = dynamic(
  () =>
    import("@/components/developments/detail/DevelopmentMap").then(
      (module) => module.DevelopmentMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[24rem] w-full animate-pulse bg-tl-beige/10 sm:h-[30rem] lg:h-[34rem]" />
    ),
  },
);

interface DevelopmentLocationBlockProps {
  development: Development;
}

export function DevelopmentLocationBlock({
  development,
}: DevelopmentLocationBlockProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${development.latitude},${development.longitude}`;

  return (
    <div className="relative w-full overflow-hidden">
      <DevelopmentMap
        latitude={development.latitude}
        longitude={development.longitude}
        title={development.name}
      />

      <div className="pointer-events-none absolute inset-0 z-[400] flex items-end p-4 sm:items-center sm:p-8 lg:p-12">
        <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-tl-gold/25 bg-tl-black/92 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-7">
          <div className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-tl-gold" strokeWidth={1.5} />
            <span className="font-outfit text-[11px] font-light uppercase tracking-[0.22em] text-tl-gold">
              Dirección
            </span>
          </div>

          <p className="mt-4 font-outfit text-lg font-extralight leading-snug tracking-[0.01em] text-tl-beige">
            {development.name}
          </p>
          <p className="mt-2 font-outfit text-sm font-extralight leading-relaxed tracking-[0.01em] text-tl-beige/75">
            {development.address}
          </p>
          <p className="mt-1 font-outfit text-sm font-extralight tracking-[0.02em] text-tl-beige/55">
            {development.city}, {development.state}
          </p>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-tl-gold bg-tl-gold px-5 py-3 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-black transition-colors hover:bg-[#e2c59a]"
          >
            ¿Cómo llegar?
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </div>
  );
}
