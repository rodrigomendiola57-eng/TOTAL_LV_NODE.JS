"use client";

import LogoLoop from "@/components/ui/LogoLoop";
import { useMemo } from "react";
import "./BrandLogoMarquee.css";

const BRAND_LOGO_COUNT = 10;

function BrandLogoMark() {
  return (
    <svg
      viewBox="0 0 141 114"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="h-[var(--logoloop-logoHeight)] w-auto"
    >
      <path
        d="M42.06 9.84999V39.3281L0.796482 50.4865L3.30934 54.317L20.8993 49.5705V112.607H23.2799V48.9043L40.2084 44.4077V112.607H48.0114V42.2426L64.2788 38.0791V112.607H139.796V107.278H72.2141V36.0805L86.8944 32.1668L87.688 98.0344H134.11V96.1192H90.3331L88.6138 0.60688L42.06 9.84999Z"
        fill="#F2ECE0"
      />
    </svg>
  );
}

export function BrandLogoMarquee() {
  const logos = useMemo(
    () =>
      Array.from({ length: BRAND_LOGO_COUNT }, (_, index) => ({
        node: <BrandLogoMark key={`brand-logo-${index}`} />,
        ariaLabel: "Símbolo de marca",
      })),
    [],
  );

  return (
    <div
      aria-hidden
      className="brand-marquee__outer pointer-events-none relative z-10 -mt-1 mb-6 flex w-full justify-center sm:-mt-2 sm:mb-8"
    >
      <div className="brand-marquee brand-marquee__window pointer-events-auto">
        <LogoLoop
          logos={logos}
          speed={72}
          direction="left"
          logoHeight={48}
          gap={64}
          hoverSpeed={18}
          scaleOnHover
          fadeOut
          fadeOutColor="#1a1a18"
          ariaLabel="Identidad visual de la marca"
          className="logoloop--fade-narrow h-full"
        />
      </div>
    </div>
  );
}
