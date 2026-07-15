"use client";

import { cn } from "@/lib/utils";
import { useMemo, type CSSProperties } from "react";

/** Mosaico del isotipo Total Living (mismo lenguaje que Nosotros / valores). */
export function LogoFabricBackdrop({
  isActive = true,
  className,
  small = false,
}: {
  isActive?: boolean;
  className?: string;
  small?: boolean;
}) {
  const logoStyle = useMemo<CSSProperties>(() => ({
    backgroundImage: "url('/logo-symbol-pattern.svg')",
    backgroundSize: small ? "50px 40.5px" : "88px 71px",
    backgroundRepeat: "repeat",
  }), [small]);

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
        style={logoStyle}
      />
      <div
        className={cn(
          "absolute inset-[-36%] rotate-[14deg] mix-blend-screen transition-opacity duration-700 ease-out",
          small ? "translate-x-[25px] translate-y-[20px]" : "translate-x-[44px] translate-y-[36px]",
          isActive ? "opacity-[0.18]" : "opacity-[0.14]",
        )}
        style={logoStyle}
      />
    </div>
  );
}
