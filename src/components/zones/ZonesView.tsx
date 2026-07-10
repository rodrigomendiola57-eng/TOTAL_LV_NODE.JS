"use client";

import { ZoneFullscreenSection } from "@/components/zones/ZoneFullscreenSection";
import { ZoneNavigator } from "@/components/zones/ZoneNavigator";
import { ZoneReveal } from "@/components/zones/ZoneReveal";
import { ZoneScrollContext } from "@/components/zones/zone-scroll-context";
import { useZonePropertyCounts } from "@/hooks/useZonePropertyCounts";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";
import type { ZoneCatalogEntry } from "@/types/zone";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

interface ZonesViewProps {
  zones: ZoneCatalogEntry[];
}

export function ZonesView({ zones }: ZonesViewProps) {
  const scrollRef = useRef<HTMLElement>(null);
  const { counts: propertyCounts, isLoading: countsLoading } =
    useZonePropertyCounts();
  const totalProperties = Object.values(propertyCounts).reduce((a, b) => a + b, 0);

  return (
    <ZoneScrollContext.Provider value={scrollRef}>
      <main
        ref={scrollRef}
        className="relative h-dvh snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth bg-[#1a1a18]"
      >
        <section
          id="zonas-intro"
          className="relative flex min-h-dvh snap-start snap-always flex-col justify-end overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/65" />

          <div
            className={cn(
              "relative z-10 mx-auto w-full max-w-6xl px-5 pb-28 sm:px-8 sm:pb-32 lg:px-10",
              HERO_CONTENT_OFFSET,
            )}
          >
            <ZoneReveal delay={0.1}>
              <p className="font-outfit text-[10px] font-light uppercase tracking-[0.32em] text-tl-gold/90 sm:text-xs sm:tracking-[0.36em]">
                Total Living · Zonas
              </p>
            </ZoneReveal>

            <ZoneReveal delay={0.2} y={48}>
              <h1 className="mt-4 max-w-3xl font-cormorant text-[clamp(2.75rem,8vw,5.5rem)] font-light leading-[0.92] text-tl-beige">
                Ubicaciones estratégicas en Querétaro
              </h1>
            </ZoneReveal>

            <ZoneReveal delay={0.32} y={32}>
              <p className="mt-5 max-w-2xl font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/75 sm:text-base">
                Explora las {zones.length} zonas principales donde concentramos
                nuestro portafolio. Cada región con su propio perfil de
                plusvalía, estilo de vida y oportunidades inmobiliarias.
              </p>
            </ZoneReveal>

            <ZoneReveal delay={0.44} y={28}>
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-8">
                <div>
                  <span className="font-cormorant text-4xl font-light leading-none text-tl-gold">
                    {zones.length}
                  </span>
                  <p className="mt-1.5 font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-beige/50">
                    Zonas premium
                  </p>
                </div>
                <div>
                  <span className="font-cormorant text-4xl font-light leading-none text-tl-gold">
                    {countsLoading ? "—" : totalProperties}
                  </span>
                  <p className="mt-1.5 font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-beige/50">
                    Propiedades activas
                  </p>
                </div>
              </div>
            </ZoneReveal>
          </div>

          <ZoneReveal delay={0.6} y={16} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 pb-[env(safe-area-inset-bottom,0px)]">
            <div className="flex flex-col items-center gap-2">
              <span className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-beige/45">
                Desplázate
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

        <ZoneNavigator zones={zones} />
      </main>
    </ZoneScrollContext.Provider>
  );
}
