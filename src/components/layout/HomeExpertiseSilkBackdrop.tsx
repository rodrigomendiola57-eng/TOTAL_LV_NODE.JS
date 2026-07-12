"use client";

import dynamic from "next/dynamic";

const PrismaticBurst = dynamic(
  () =>
    import("@/components/ui/PrismaticBurst").then((mod) => mod.PrismaticBurst),
  { ssr: false },
);

/**
 * Colorimetría del prompt React Bits:
 * color0 / color1 / color2 → #636B2F (el array `colors` del playground
 * se sustituye por estos valores personalizados).
 */
const PRISMATIC_COLORS = ["#636B2F", "#636B2F", "#636B2F"] as const;

interface HomeExpertiseSilkBackdropProps {
  reducedMotion: boolean;
}

/**
 * Fondo PrismaticBurst de la sección expertise
 * (“Inteligencia Inmobiliaria para Decisiones Reales”).
 */
export function HomeExpertiseSilkBackdrop({
  reducedMotion,
}: HomeExpertiseSilkBackdropProps) {
  if (reducedMotion) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#1a1a18]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_110%_70%_at_50%_0%,rgba(99,107,47,0.45),transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1c1e18_0%,#1a1a18_42%,#141412_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-tl-black/30 via-tl-black/10 to-tl-black/35" />
      </div>
    );
  }

  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden bg-[#0a0a08]">
      <div className="absolute inset-0 h-full w-full">
        <PrismaticBurst
          animationType="rotate3d"
          intensity={2}
          speed={0.65}
          distort={1.0}
          paused={false}
          offset={{ x: 0, y: 0 }}
          hoverDampness={0.25}
          rayCount={24}
          mixBlendMode="lighten"
          colors={[...PRISMATIC_COLORS]}
        />
      </div>
    </div>
  );
}
