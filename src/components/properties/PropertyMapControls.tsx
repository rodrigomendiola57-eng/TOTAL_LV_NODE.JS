"use client";

import { cn } from "@/lib/utils";
import {
  Globe2,
  Maximize2,
  Minus,
  PanelRightOpen,
  Plus,
} from "lucide-react";
import type { MutableRefObject } from "react";

const controlButtonClassName =
  "inline-flex h-11 w-11 items-center justify-center text-tl-beige transition-colors active:bg-tl-gold/15 active:text-tl-gold sm:h-12 sm:w-12 sm:hover:bg-tl-gold/12 sm:hover:text-tl-gold";

interface PropertyMapControlsProps {
  mapRef: MutableRefObject<google.maps.Map | null>;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onViewMexico: () => void;
}

export function PropertyMapControls({
  mapRef,
  sidebarOpen,
  onToggleSidebar,
  onViewMexico,
}: PropertyMapControlsProps) {
  function zoomIn() {
    const map = mapRef.current;
    if (!map) return;
    map.setZoom((map.getZoom() ?? 10) + 1);
  }

  function zoomOut() {
    const map = mapRef.current;
    if (!map) return;
    map.setZoom((map.getZoom() ?? 10) - 1);
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 isolate">
      <div
        className={cn(
          "pointer-events-auto absolute flex flex-col overflow-hidden rounded-2xl border border-tl-gold/25 bg-tl-black/92 shadow-[0_10px_32px_rgba(0,0,0,0.45)] backdrop-blur-md",
          "bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] right-[max(0.75rem,env(safe-area-inset-right,0px))]",
          "sm:bottom-4 sm:right-4",
        )}
      >
        <button
          type="button"
          onClick={zoomIn}
          className={cn(controlButtonClassName, "border-b border-white/10")}
          aria-label="Acercar mapa"
        >
          <Plus className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={zoomOut}
          className={cn(controlButtonClassName, "border-b border-white/10")}
          aria-label="Alejar mapa"
        >
          <Minus className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={onViewMexico}
          className={cn(controlButtonClassName, "border-b border-white/10")}
          aria-label="Ver todo México"
        >
          <Globe2 className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={onToggleSidebar}
          className={cn(
            controlButtonClassName,
            !sidebarOpen && "bg-tl-gold/18 text-tl-gold",
          )}
          aria-label={
            sidebarOpen
              ? "Expandir mapa"
              : "Mostrar lista de propiedades"
          }
        >
          {sidebarOpen ? (
            <Maximize2 className="h-5 w-5" strokeWidth={1.5} />
          ) : (
            <PanelRightOpen className="h-5 w-5" strokeWidth={1.5} />
          )}
        </button>
      </div>
    </div>
  );
}
