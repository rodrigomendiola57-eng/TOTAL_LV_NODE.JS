"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { matchesLiteMotionViewport } from "@/hooks/use-lite-motion";

const Silk = dynamic(
  () => import("@/components/ui/Silk").then((mod) => mod.Silk),
  { ssr: false },
);

/**
 * Fondo para el módulo Nosotros. En móvil usa gradiente estático para evitar
 * jank de scroll con WebGL. En desktop Silk cubre toda la página y se pausa
 * cuando la pestaña está oculta o el usuario prefiere menos movimiento.
 */
export function AboutSilkBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(true);
  const [useStaticBackground, setUseStaticBackground] = useState(true);

  useEffect(() => {
    const isLite = matchesLiteMotionViewport();
    setUseStaticBackground(isLite);

    if (isLite) {
      setPaused(true);
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncPaused = () => {
      setPaused(motionQuery.matches || document.hidden);
    };

    syncPaused();
    motionQuery.addEventListener("change", syncPaused);
    document.addEventListener("visibilitychange", syncPaused);

    return () => {
      motionQuery.removeEventListener("change", syncPaused);
      document.removeEventListener("visibilitychange", syncPaused);
    };
  }, []);

  if (useStaticBackground) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 min-h-full overflow-hidden bg-[#1a1a18]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(90,94,72,0.42),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#1c1e18_0%,#1a1a18_38%,#141412_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121210]/35 via-transparent to-[#121210]/50" />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 min-h-full overflow-hidden"
    >
      <Silk
        speed={5}
        scale={1.15}
        color="#5A5E48"
        noiseIntensity={1.5}
        rotation={0}
        paused={paused}
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-[#121210]/28" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#121210]/40 via-transparent to-[#121210]/45" />
    </div>
  );
}
