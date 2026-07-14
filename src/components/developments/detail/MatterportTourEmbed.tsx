"use client";

import {
  buildMatterportEmbedUrl,
  buildMatterportShareUrl,
} from "@/lib/maps/matterport";
import { cn } from "@/lib/utils";
import { Box, ExternalLink, Play } from "lucide-react";
import { useEffect, useState } from "react";

interface MatterportTourEmbedProps {
  modelId: string;
  title?: string;
  className?: string;
  /** Si true, carga el iframe de inmediato (solo desktop). */
  autoLoad?: boolean;
}

/**
 * Abrir Matterport en URL externa solo en iPhone / iPad / viewport móvil.
 * Desktop (mouse/trackpad) siempre usa embed — no confundir Mac con iPadOS.
 */
function useOpenTourExternally() {
  const [external, setExternal] = useState(false);

  useEffect(() => {
    const mqNarrow = window.matchMedia("(max-width: 639px)");
    const mqFineDesktop = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );

    const sync = () => {
      const ua = navigator.userAgent;
      const isIPhone = /iP(hone|od)/.test(ua);
      const isIPadUa = /iPad/.test(ua);
      // iPadOS 13+ se hace pasar por Mac; un Mac real suele tener hover+pointer fine.
      const isIPadOS =
        navigator.platform === "MacIntel" &&
        navigator.maxTouchPoints > 1 &&
        !mqFineDesktop.matches;

      // Desktop con mouse/trackpad: nunca externo.
      if (mqFineDesktop.matches && !isIPhone && !isIPadUa && !isIPadOS) {
        setExternal(false);
        return;
      }

      setExternal(mqNarrow.matches || isIPhone || isIPadUa || isIPadOS);
    };

    sync();
    mqNarrow.addEventListener("change", sync);
    mqFineDesktop.addEventListener("change", sync);
    return () => {
      mqNarrow.removeEventListener("change", sync);
      mqFineDesktop.removeEventListener("change", sync);
    };
  }, []);

  return external;
}

const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; xr-spatial-tracking; fullscreen";

/**
 * Desktop: recorrido embebido en iframe (tras clic o autoLoad).
 * iPhone / iPad / móvil estrecho: al tocar, abre la URL de Matterport.
 */
export function MatterportTourEmbed({
  modelId,
  title = "Recorrido 3D",
  className,
  autoLoad = false,
}: MatterportTourEmbedProps) {
  const openExternally = useOpenTourExternally();
  const [loaded, setLoaded] = useState(false);

  const desktopEmbedUrl = buildMatterportEmbedUrl(modelId);
  const shareUrl = buildMatterportShareUrl(modelId);

  useEffect(() => {
    if (!openExternally && autoLoad) setLoaded(true);
  }, [autoLoad, openExternally]);

  // Si pasamos de móvil→desktop (rotar, etc.), permitir embed de nuevo.
  useEffect(() => {
    if (openExternally) setLoaded(false);
  }, [openExternally]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/90">
            Matterport
          </p>
          <h3 className="mt-1 font-cormorant text-2xl font-light text-tl-beige sm:text-3xl">
            {title}
          </h3>
        </div>
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-beige/55 transition-colors hover:text-tl-gold"
        >
          Abrir en Matterport
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl border border-tl-gold/20 bg-[#0a0a0a]">
        {!openExternally && loaded ? (
          <iframe
            title={title}
            src={desktopEmbedUrl}
            className="absolute inset-0 h-full w-full border-0"
            allow={IFRAME_ALLOW}
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-tl-black via-[#121210] to-tl-black text-tl-beige">
            {openExternally ? (
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 transition-colors active:text-tl-gold"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-tl-gold/40 bg-tl-gold/10">
                  <Play className="h-6 w-6 fill-current" />
                </span>
                <span className="inline-flex items-center gap-2 font-outfit text-xs uppercase tracking-[0.16em]">
                  <Box className="h-4 w-4" />
                  Ver recorrido 3D
                </span>
                <span className="inline-flex items-center gap-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-gold/85">
                  Se abre en Matterport
                  <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setLoaded(true)}
                className="flex flex-col items-center gap-3 transition-colors hover:text-tl-gold"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-tl-gold/40 bg-tl-gold/10">
                  <Play className="h-6 w-6 fill-current" />
                </span>
                <span className="inline-flex items-center gap-2 font-outfit text-xs uppercase tracking-[0.16em]">
                  <Box className="h-4 w-4" />
                  Ver recorrido 3D
                </span>
              </button>
            )}

            <p className="max-w-xs px-4 text-center font-outfit text-[11px] font-light text-tl-beige/45">
              {openExternally
                ? "En este dispositivo el recorrido se abre en Matterport para navegarlo bien con el tacto."
                : "Se carga el tour de Matterport al hacer clic."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
