"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/** Verde olivo oficial Total Living — `tl-olive` */
const TL_OLIVE = "#4A4E38";

const Silk = dynamic(
  () => import("@/components/ui/Silk").then((mod) => mod.Silk),
  { ssr: false },
);

interface HomeExpertiseSilkBackdropProps {
  reducedMotion: boolean;
}

/**
 * Fondo Silk acotado a la sección de expertise (no viewport completo).
 */
export function HomeExpertiseSilkBackdrop({
  reducedMotion,
}: HomeExpertiseSilkBackdropProps) {
  const [paused, setPaused] = useState(reducedMotion);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncPaused = () => {
      setPaused(motionQuery.matches || document.hidden || reducedMotion);
    };

    syncPaused();
    motionQuery.addEventListener("change", syncPaused);
    document.addEventListener("visibilitychange", syncPaused);

    return () => {
      motionQuery.removeEventListener("change", syncPaused);
      document.removeEventListener("visibilitychange", syncPaused);
    };
  }, [reducedMotion]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <Silk
        speed={5}
        scale={1.12}
        color={TL_OLIVE}
        noiseIntensity={1.5}
        rotation={0}
        paused={paused}
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-tl-olive/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-tl-black/30 via-tl-black/10 to-tl-black/35" />
    </div>
  );
}
