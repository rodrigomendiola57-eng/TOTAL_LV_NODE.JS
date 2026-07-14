"use client";

import { LineSidebar } from "@/components/ui/LineSidebar";
import { useZoneScrollRoot } from "@/components/zones/zone-scroll-context";
import type { ZoneCatalogEntry } from "@/types/zone";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const NAV_ENTER_EASE = [0.22, 1, 0.36, 1] as const;

interface ZoneNavigatorProps {
  zones: ZoneCatalogEntry[];
}

function shortZoneName(name: string): string {
  const base = name.replace(/^Zona\s+/i, "").trim();
  const primary = (base.split(" / ")[0] ?? base).trim();
  return primary || name;
}

export function ZoneNavigator({ zones }: ZoneNavigatorProps) {
  const { locale } = useLocale();
  const pathname = usePathname();
  const scrollRootRef = useZoneScrollRoot();
  const reducedMotion = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState<string>("intro");
  const [ready, setReady] = useState(false);

  const navItems = useMemo(
    () => [
      { slug: "intro", label: locale === "en" ? "Home" : "Inicio", targetId: "zonas-intro" },
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

  // Cada visita a /zonas reinicia el índice (animación + estado).
  useEffect(() => {
    setActiveSlug("intro");
    setReady(false);
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    let retryTimer: number | null = null;
    let attempts = 0;

    const getScrollRoot = () =>
      scrollRootRef?.current ??
      document.querySelector<HTMLElement>("main.snap-y");

    const collectSections = () =>
      [
        document.getElementById("zonas-intro"),
        ...zones.map((zone) => document.getElementById(`zona-${zone.slug}`)),
      ].filter(Boolean) as HTMLElement[];

    const attach = () => {
      if (cancelled) return;
      const sections = collectSections();
      if (sections.length === 0) {
        attempts += 1;
        if (attempts < 20) {
          retryTimer = window.setTimeout(attach, 50);
        }
        return;
      }

      const scrollRoot = getScrollRoot();
      observer = new IntersectionObserver(
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
    };

    attach();

    return () => {
      cancelled = true;
      if (retryTimer != null) window.clearTimeout(retryTimer);
      observer?.disconnect();
    };
  }, [ready, zones, scrollRootRef]);

  const scrollTo = useCallback(
    (targetId: string) => {
      const element = document.getElementById(targetId);
      const scrollRoot =
        scrollRootRef?.current ??
        document.querySelector<HTMLElement>("main.snap-y");
      if (element && scrollRoot) {
        scrollRoot.scrollTo({
          top: element.offsetTop,
          behavior: "smooth",
        });
      } else {
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [scrollRootRef],
  );

  const handleDesktopClick = useCallback(
    (index: number) => {
      const item = navItems[index];
      if (!item) return;
      setActiveSlug(item.slug);
      scrollTo(item.targetId);
    },
    [navItems, scrollTo],
  );

  if (!ready) return null;

  return (
    <>
      {/* Fuera del main con overflow: fixed a pantalla completa y centrado por
          flex (sin transform), para que el índice quede siempre a la derecha
          y su animación de entrada no compita con el centrado vertical. */}
      <div className="pointer-events-none fixed inset-y-0 right-3 z-40 hidden items-center lg:flex xl:right-5">
        <motion.div
          key={`zones-nav-desktop-${pathname}`}
          initial={reducedMotion ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: NAV_ENTER_EASE }}
          className="pointer-events-auto max-h-[min(82dvh,40rem)] w-[min(17.5rem,22vw)] overflow-y-auto overscroll-contain rounded-2xl border border-white/12 bg-black/55 px-3.5 py-4 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-md [scrollbar-width:thin] xl:w-[min(19rem,24vw)] xl:px-4 xl:py-5"
        >
          <LineSidebar
            key={`line-sidebar-${pathname}-${labels.length}`}
            items={labels}
            activeIndex={activeIndex}
            accentColor="#d6b585"
            textColor="rgba(242, 236, 224, 0.62)"
            markerColor="rgba(214, 181, 133, 0.4)"
            showIndex
            showMarker
            proximityRadius={110}
            maxShift={22}
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
        </motion.div>
      </div>

      <div
        key={`zones-nav-mobile-${pathname}`}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-tl-gold/15 bg-tl-black/92 lg:hidden"
      >
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
