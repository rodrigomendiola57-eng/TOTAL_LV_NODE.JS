// @ts-nocheck
"use client";

import { ZoneGrowthBadge } from "@/components/zones/ZoneGrowthBadge";
import { ZoneReveal } from "@/components/zones/ZoneReveal";
import { zonePropertiesHref } from "@/lib/data/zones";
import type { ZoneCatalogEntry } from "@/types/zone";
import { useZoneScrollRoot } from "@/components/zones/zone-scroll-context";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ZoneFullscreenSectionProps {
  zone: ZoneCatalogEntry;
  propertyCount: number;
  countsLoading?: boolean;
}

export function ZoneFullscreenSection({
  zone,
  propertyCount,
  countsLoading = false,
}: ZoneFullscreenSectionProps) {
  const { locale } = useLocale();
  const scrollRoot = useZoneScrollRoot();
  const reducedMotion = useReducedMotion();
  const [viewportRoot, setViewportRoot] = useState<Element | null>(null);
  const propertiesHref = zonePropertiesHref(zone.name);
  const indexLabel = String(zone.id).padStart(2, "0");

  useEffect(() => {
    setViewportRoot(scrollRoot?.current ?? null);
  }, [scrollRoot]);

  return (
    <section
      id={`zona-${zone.slug}`}
      data-zone-slug={zone.slug}
      className="relative flex min-h-dvh snap-start snap-always items-end overflow-hidden"
    >
      {reducedMotion ? (
        <div className="absolute inset-0">
          {zone.image && (
            <Image
              src={zone.image}
              alt={zone.name}
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
        </div>
      ) : (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{
            once: true,
            amount: 0.25,
            ...(viewportRoot ? { root: viewportRoot } : {}),
          }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {zone.image && (
            <Image
              src={zone.image}
              alt={zone.name}
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/70" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-5 pb-32 pt-24 sm:px-8 sm:pb-36 sm:pt-28 lg:px-10 lg:pb-28 lg:pt-24">
        <ZoneReveal delay={0.02}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-outfit text-[11px] font-light tabular-nums tracking-[0.28em] text-tl-gold/80">
              {indexLabel}
            </span>
            <span className="h-px w-8 bg-tl-gold/40" aria-hidden />
            <ZoneGrowthBadge label={zone.growthLabel} />
          </div>
        </ZoneReveal>

        <ZoneReveal delay={0.06} y={28}>
          <h2 className="mt-6 max-w-4xl font-cormorant text-[clamp(2.25rem,6vw,4.5rem)] font-light leading-[0.95] tracking-[0.01em] text-tl-beige">
            {zone.name}
          </h2>
        </ZoneReveal>

        <ZoneReveal delay={0.1} y={20}>
          <p className="mt-5 max-w-2xl font-outfit text-[clamp(0.95rem,2vw,1.1rem)] font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/78">
            {zone.description}
          </p>
        </ZoneReveal>

        {zone.subZones.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2 sm:gap-2.5">
            {zone.subZones.map((subZone) => (
              <span
                key={subZone}
                className="inline-flex items-center gap-2 rounded-full border border-tl-gold/30 bg-tl-black/55 px-3.5 py-2 font-outfit text-[11px] font-light tracking-[0.04em] text-tl-beige sm:px-4 sm:text-xs"
              >
                <MapPin
                  className="h-3 w-3 shrink-0 text-tl-gold/80"
                  strokeWidth={1.5}
                />
                {subZone}
              </span>
            ))}
          </div>
        ) : null}

        <ZoneReveal delay={0.14} y={16}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={propertiesHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-tl-gold bg-tl-gold px-6 py-3 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-black shadow-[0_12px_40px_rgba(214,181,133,0.22)] transition-colors hover:bg-[#e2c59a]"
            >
              <Building2 className="h-4 w-4" strokeWidth={1.5} />
              {locale === "en" ? "View properties in this region" : "Ver propiedades en esta región"}
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <span className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-tl-black/50 px-6 py-3 font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-beige/75">
              {countsLoading
                ? (locale === "en" ? "Checking availability..." : "Consultando disponibilidad…")
                : `${propertyCount} ${propertyCount === 1 ? (locale === "en" ? "property available" : "propiedad disponible") : (locale === "en" ? "properties available" : "propiedades disponibles")}`}
            </span>
          </div>
        </ZoneReveal>
      </div>
    </section>
  );
}
