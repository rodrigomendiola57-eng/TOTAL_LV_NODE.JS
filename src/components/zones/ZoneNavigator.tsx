"use client";

import type { ZoneCatalogEntry } from "@/types/zone";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

interface ZoneNavigatorProps {
  zones: ZoneCatalogEntry[];
}

function shortZoneName(name: string): string {
  return name.replace(/^Zona\s+/i, "").split(" / ")[0] ?? name;
}

export function ZoneNavigator({ zones }: ZoneNavigatorProps) {
  const [activeSlug, setActiveSlug] = useState<string>("intro");

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

  return (
    <>
      <nav
        aria-label="Navegación de zonas"
        className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:right-8"
      >
        <ul className="pointer-events-auto space-y-1 rounded-2xl border border-white/10 bg-tl-black/45 p-2 backdrop-blur-md">
          <li>
            <button
              type="button"
              onClick={() => scrollTo("zonas-intro")}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors",
                activeSlug === "intro"
                  ? "bg-tl-gold/15 text-tl-gold"
                  : "text-tl-beige/50 hover:bg-white/[0.04] hover:text-tl-beige/80",
              )}
            >
              <span className="font-outfit text-[9px] font-light tabular-nums tracking-[0.12em]">
                00
              </span>
              <span className="h-px w-4 bg-current opacity-40" />
              <span className="font-outfit text-[10px] font-light uppercase tracking-[0.14em]">
                Inicio
              </span>
            </button>
          </li>
          {zones.map((zone) => (
            <li key={zone.slug}>
              <button
                type="button"
                onClick={() => scrollTo(`zona-${zone.slug}`)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors",
                  activeSlug === zone.slug
                    ? "bg-tl-gold/15 text-tl-gold"
                    : "text-tl-beige/50 hover:bg-white/[0.04] hover:text-tl-beige/80",
                )}
              >
                <span className="font-outfit text-[9px] font-light tabular-nums tracking-[0.12em]">
                  {String(zone.id).padStart(2, "0")}
                </span>
                <span className="h-px w-4 bg-current opacity-40" />
                <span className="max-w-[7rem] truncate font-outfit text-[10px] font-light uppercase tracking-[0.12em]">
                  {shortZoneName(zone.name)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-tl-black/80 backdrop-blur-md lg:hidden">
        <div className="pointer-events-auto flex gap-1 overflow-x-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => scrollTo("zonas-intro")}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-2 font-outfit text-[10px] font-light uppercase tracking-[0.14em] transition-colors",
              activeSlug === "intro"
                ? "border-tl-gold bg-tl-gold/15 text-tl-gold"
                : "border-white/15 text-tl-beige/60",
            )}
          >
            Inicio
          </button>
          {zones.map((zone) => (
            <button
              key={zone.slug}
              type="button"
              onClick={() => scrollTo(`zona-${zone.slug}`)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-2 font-outfit text-[10px] font-light uppercase tracking-[0.14em] transition-colors",
                activeSlug === zone.slug
                  ? "border-tl-gold bg-tl-gold/15 text-tl-gold"
                  : "border-white/15 text-tl-beige/60",
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
