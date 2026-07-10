"use client";

import { cn } from "@/lib/utils";
import type { AboutSectionLink } from "@/types/company";
import { useEffect, useState } from "react";

interface AboutSectionNavProps {
  sections: AboutSectionLink[];
}

export function AboutSectionNav({ sections }: AboutSectionNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

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

  return (
    <nav
      aria-label="Secciones de Nosotros"
      className="sticky top-[calc(4.25rem+env(safe-area-inset-top,0px))] z-30 border-b border-white/8 bg-[#1a1a18]/95 tl-mobile-solid-chrome sm:top-[calc(5rem+env(safe-area-inset-top,0px))] sm:bg-[#1a1a18]/92"
    >
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-proximity sm:gap-2.5 sm:px-6 sm:py-3.5 [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const isActive = activeId === section.id;

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "flex min-h-11 shrink-0 snap-start items-center rounded-full px-4 py-2.5 font-outfit text-[11px] font-light uppercase tracking-[0.12em] transition-colors sm:min-h-0 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.16em]",
                isActive
                  ? "bg-tl-gold/15 text-tl-gold ring-1 ring-tl-gold/35"
                  : "text-tl-beige/60 active:bg-white/[0.06] active:text-tl-beige sm:hover:bg-white/[0.04] sm:hover:text-tl-beige",
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
