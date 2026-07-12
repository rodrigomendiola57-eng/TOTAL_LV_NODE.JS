"use client";

import { LineSidebar } from "@/components/ui/LineSidebar";
import type { ZoneCatalogEntry } from "@/types/zone";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ZoneNavigatorProps {
  zones: ZoneCatalogEntry[];
}

function shortZoneName(name: string): string {
  // Quita "Zona " y usa el tramo principal (antes de " / ").
  const base = name.replace(/^Zona\s+/i, "").trim();
  const primary = (base.split(" / ")[0] ?? base).trim();
  return primary || name;
}

export function ZoneNavigator({ zones }: ZoneNavigatorProps) {
  const [activeSlug, setActiveSlug] = useState<string>("intro");

  const navItems = useMemo(
    () => [
      { slug: "intro", label: "Inicio", targetId: "zonas-intro" },
      ...zones.map((zone) => ({
        slug: zone.slug,
        label: shortZoneName(zone.name),
        targetId: `zona-${zone.slug}`,
      })),
    ],
    [zones],
  );

  const labels = useMemo(() => navItems.map((item) => item.label), [navItems]);

  const activeIndex = useMemo(() => {
    const index = navItems.findIndex((item) => item.slug === activeSlug);
    return index >= 0 ? index : 0;
  }, [activeSlug, navItems]);

  useEffect(() => {
    const scrollRoot = document.querySelector("main.snap-y");
    const sections = [
      document.getElementById("zonas-intro"),
      ...zones.map((zone) => document.getElementById(`zona-${zone.slug}`)),
    ].filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length === 0) return;

        const id = visible[0].target.id;
        if (id === "zonas-intro") {
          setActiveSlug("intro");
        } else {
          setActiveSlug(id.replace("zona-", ""));
        }
      },
      {
        root: scrollRoot,
        rootMargin: "-30% 0px -30% 0px",
        threshold: [0.25, 0.5, 0.75],
      },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [zones]);

  const scrollTo = useCallback((targetId: string) => {
    const element = document.getElementById(targetId);
    const scrollRoot = document.querySelector("main.snap-y");
    if (element && scrollRoot) {
      scrollRoot.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    } else {
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleDesktopClick = useCallback(
    (index: number) => {
      const item = navItems[index];
      if (!item) return;
      setActiveSlug(item.slug);
      scrollTo(item.targetId);
    },
    [navItems, scrollTo],
  );

  return (
    <>
      {/* Desktop: LineSidebar en card oscuro — solo lg+ */}
      <div className="pointer-events-none fixed right-3 top-1/2 z-40 hidden max-h-[min(82dvh,40rem)] w-[min(17.5rem,22vw)] -translate-y-1/2 lg:block xl:right-5 xl:w-[min(19rem,24vw)]">
        <div className="pointer-events-auto max-h-[min(82dvh,40rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/12 bg-black/55 px-3.5 py-4 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-md [scrollbar-width:thin] xl:px-4 xl:py-5">
          <LineSidebar
            items={labels}
            activeIndex={activeIndex}
            accentColor="#d6b585"
            textColor="rgba(242, 236, 224, 0.62)"
            markerColor="rgba(214, 181, 133, 0.4)"
            showIndex
            showMarker
            proximityRadius={90}
            maxShift={10}
            falloff="smooth"
            markerLength={36}
            markerGap={6}
            tickScale={0.4}
            scaleTick
            itemGap={12}
            fontSize={0.72}
            smoothing={90}
            alignEnd
            onItemClick={handleDesktopClick}
            className="tl-zones-line-sidebar w-full"
          />
        </div>
      </div>

      {/* Móvil: chips horizontales (sin LineSidebar) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-tl-gold/15 bg-tl-black/92 lg:hidden">
        <div className="pointer-events-auto flex gap-1 overflow-x-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => {
              setActiveSlug("intro");
              scrollTo("zonas-intro");
            }}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-2 font-outfit text-[10px] font-light uppercase tracking-[0.14em] transition-colors",
              activeSlug === "intro"
                ? "border-tl-gold bg-tl-gold/20 text-tl-gold"
                : "border-white/20 bg-tl-black/40 text-tl-beige/70",
            )}
          >
            Inicio
          </button>
          {zones.map((zone) => (
            <button
              key={zone.slug}
              type="button"
              onClick={() => {
                setActiveSlug(zone.slug);
                scrollTo(`zona-${zone.slug}`);
              }}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-2 font-outfit text-[10px] font-light uppercase tracking-[0.14em] transition-colors",
                activeSlug === zone.slug
                  ? "border-tl-gold bg-tl-gold/20 text-tl-gold"
                  : "border-white/20 bg-tl-black/40 text-tl-beige/70",
              )}
            >
              {shortZoneName(zone.name)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
