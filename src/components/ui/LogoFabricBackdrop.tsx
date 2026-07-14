"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

const LOGO_FABRIC_STYLE: CSSProperties = {
  backgroundImage: "url('/logo-symbol-pattern.svg')",
  backgroundSize: "88px 71px",
  backgroundRepeat: "repeat",
};

/** Mosaico del isotipo Total Living (mismo lenguaje que Nosotros / valores). */
export function LogoFabricBackdrop({
  isActive = true,
  className,
}: {
  isActive?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-[#161614]" />
      <div
        className={cn(
          "absolute inset-[-36%] rotate-[14deg] mix-blend-screen transition-opacity duration-700 ease-out",
          isActive ? "opacity-[0.28]" : "opacity-[0.22]",
        )}
        style={LOGO_FABRIC_STYLE}
      />
      <div
        className={cn(
          "absolute inset-[-36%] rotate-[14deg] mix-blend-screen transition-opacity duration-700 ease-out",
          "translate-x-[44px] translate-y-[36px]",
          isActive ? "opacity-[0.18]" : "opacity-[0.14]",
        )}
        style={LOGO_FABRIC_STYLE}
      />
    </div>
  );
}
