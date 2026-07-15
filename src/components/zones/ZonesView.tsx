"use client";

import { ZoneFullscreenSection } from "@/components/zones/ZoneFullscreenSection";
import { ZoneNavigator } from "@/components/zones/ZoneNavigator";
import { ZoneReveal } from "@/components/zones/ZoneReveal";
import { ZoneScrollContext } from "@/components/zones/zone-scroll-context";
import { useZonePropertyCounts } from "@/hooks/useZonePropertyCounts";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";
import type { ZoneCatalogEntry } from "@/types/zone";
import type { ZonesPageContent } from "@/types/zones-page";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useRef } from "react";
import Image from "next/image";

interface ZonesViewProps {
  zones: ZoneCatalogEntry[];
  page: ZonesPageContent;
}

export function ZonesView({ zones, page }: ZonesViewProps) {
  const { locale } = useLocale();
  const scrollRef = useRef<HTMLElement>(null);
  const { counts: propertyCounts, isLoading: countsLoading } =
    useZonePropertyCounts();
  const totalProperties = Object.values(propertyCounts).reduce((a, b) => a + b, 0);
  const heroImage = page.hero_image_url || page.hero_image_external_url;

  return (
    <ZoneScrollContext.Provider value={scrollRef}>
      <div className="relative">
        <main
          ref={scrollRef}
          className="relative h-dvh snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth bg-[#1a1a18]"
        >
          <section
            id="zonas-intro"
            className="relative flex min-h-dvh snap-start snap-always flex-col justify-end overflow-hidden"
          >
            {heroImage ? (
              <div className="absolute inset-0">
                <Image
                  src={heroImage}
                  alt={page.hero_title || "Zonas"}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                  priority
                />
              </div>
            ) : (
              <div className="absolute inset-0 bg-[#1a1a18]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/65" />

            <div
              className={cn(
                "relative z-10 mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8 sm:pb-32 lg:px-10",
                HERO_CONTENT_OFFSET,
              )}
            >
              <ZoneReveal delay={0.02}>
                <p className="font-outfit text-[10px] font-light uppercase tracking-[0.32em] text-tl-gold/90 sm:text-xs sm:tracking-[0.36em]">
                  {page.hero_eyebrow}
                </p>
              </ZoneReveal>

              <ZoneReveal delay={0.06} y={28}>
                <h1 className="mt-4 max-w-3xl font-cormorant text-[clamp(2.75rem,8vw,5.5rem)] font-light leading-[0.92] text-tl-beige">
                  {page.hero_title}
                </h1>
              </ZoneReveal>

              <ZoneReveal delay={0.1} y={20}>
                <p className="mt-5 max-w-2xl font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/75 sm:text-base">
                  {page.hero_subtitle}
                </p>
              </ZoneReveal>

              <ZoneReveal delay={0.14} y={16}>
                <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-8">
                  <div>
                    <span className="font-cormorant text-4xl font-light leading-none text-tl-gold">
                      {zones.length}
                    </span>
                    <p className="mt-1.5 font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-beige/50">
                      {locale === "en" ? "Premium zones" : "Zonas premium"}
                    </p>
                  </div>
                  <div>
                    <span className="font-cormorant text-4xl font-light leading-none text-tl-gold">
                      {countsLoading ? "—" : totalProperties}
                    </span>
                    <p className="mt-1.5 font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-beige/50">
                      {locale === "en" ? "Active listings" : "Propiedades activas"}
                    </p>
                  </div>
                </div>
              </ZoneReveal>
            </div>

            <ZoneReveal
              delay={0.18}
              y={12}
              className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 pb-[env(safe-area-inset-bottom,0px)]"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-beige/45">
                  {page.scroll_hint || (locale === "en" ? "Scroll down" : "Desplázate")}
                </span>
                <ChevronDown
                  className="h-5 w-5 animate-bounce text-tl-gold/60"
                  strokeWidth={1.5}
                />
              </div>
            </ZoneReveal>
          </section>

          {zones.map((zone) => (
            <ZoneFullscreenSection
              key={zone.slug}
              zone={zone}
              propertyCount={propertyCounts[zone.name] ?? 0}
              countsLoading={countsLoading}
            />
          ))}
        </main>

        {/* Índice fuera del scroll: fixed + animación al entrar siempre */}
        <ZoneNavigator zones={zones} />
      </div>
    </ZoneScrollContext.Provider>
  );
}
