"use client";

import { cn } from "@/lib/utils";
import type { AboutSectionLink } from "@/types/company";
import { useEffect, useRef, useState } from "react";

interface AboutSectionNavProps {
  sections: AboutSectionLink[];
}

const SCROLL_TOP_THRESHOLD = 12;
const SCROLL_DIRECTION_DELTA = 4;

export function AboutSectionNav({ sections }: AboutSectionNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [scrolledDown, setScrolledDown] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const sectionElements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-28% 0px -52% 0px",
        threshold: [0, 0.12, 0.3, 0.5],
      },
    );

    sectionElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= SCROLL_TOP_THRESHOLD) {
        setScrolledDown(false);
      } else if (currentY < lastScrollY.current - SCROLL_DIRECTION_DELTA) {
        // Scroll hacia arriba → transparente
        setScrolledDown(false);
      } else if (currentY > lastScrollY.current + SCROLL_DIRECTION_DELTA) {
        // Scroll hacia abajo → gris transparente
        setScrolledDown(true);
      }

      lastScrollY.current = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Secciones de Nosotros"
      className={cn(
        "sticky top-[calc(4.25rem+env(safe-area-inset-top,0px))] z-30 border-b transition-[background-color,border-color,backdrop-filter] duration-300 sm:top-[calc(5rem+env(safe-area-inset-top,0px))]",
        scrolledDown
          ? "border-white/10 bg-[#1a1a18]/55 backdrop-blur-[10px] sm:bg-[#1a1a18]/45"
          : "border-transparent bg-transparent backdrop-blur-none",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5",
          "[-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-proximity",
          "sm:gap-3 sm:px-6 sm:py-3.5 sm:justify-center sm:overflow-visible",
          "[&::-webkit-scrollbar]:hidden",
        )}
      >
        {sections.map((section) => {
          const isActive = activeId === section.id;

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "flex min-h-11 shrink-0 snap-start items-center rounded-full px-4 py-2.5",
                "font-outfit text-[11px] font-light uppercase tracking-[0.12em] transition-colors",
                "sm:min-h-0 sm:px-5 sm:py-2 sm:text-[11px] sm:tracking-[0.16em]",
                "[text-shadow:0_1px_10px_rgba(0,0,0,0.9),0_0_18px_rgba(0,0,0,0.55)]",
                isActive
                  ? "bg-tl-gold/15 text-tl-gold ring-1 ring-tl-gold/35"
                  : "bg-transparent text-tl-beige/75 active:text-tl-beige sm:hover:text-tl-beige",
              )}
              aria-current={isActive ? "true" : undefined}
            >
              {section.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
