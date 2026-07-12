"use client";

import {
  buildMatterportEmbedUrl,
  buildMatterportShareUrl,
} from "@/lib/maps/matterport";
import { cn } from "@/lib/utils";
import { Box, ExternalLink, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface MatterportTourEmbedProps {
  modelId: string;
  title?: string;
  className?: string;
  /** Si true, carga el iframe de inmediato (solo desktop). */
  autoLoad?: boolean;
}

function useIsMobileTour() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; xr-spatial-tracking; fullscreen";

/** iOS Safari: sin un touch listener en la ventana padre, el iframe no recibe toques. */
const noopTouch = () => {};

/**
 * Desktop: iframe inline tras click.
 * Móvil: intenta embed fullscreen (parche A). Si los toques fallan,
 * el usuario puede abrir Matterport en pestaña/app.
 */
export function MatterportTourEmbed({
  modelId,
  title = "Recorrido 3D",
  className,
  autoLoad = false,
}: MatterportTourEmbedProps) {
  const isMobile = useIsMobileTour();
  const [loaded, setLoaded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const desktopEmbedUrl = buildMatterportEmbedUrl(modelId);
  const mobileEmbedUrl = buildMatterportEmbedUrl(modelId, {
    stayInFrame: true,
  });
  const shareUrl = buildMatterportShareUrl(modelId);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!isMobile && autoLoad) setLoaded(true);
  }, [autoLoad, isMobile]);

  // Parche A: habilitar toques en iframe (iOS) + no bloquear touch-action del body.
  useEffect(() => {
    if (!mobileOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    window.addEventListener("touchstart", noopTouch, { passive: true });
    window.addEventListener("touchmove", noopTouch, { passive: true });
    document.addEventListener("touchstart", noopTouch, { passive: true });

    const iframe = iframeRef.current;
    iframe?.addEventListener("touchstart", noopTouch, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overflow = "";
      window.removeEventListener("touchstart", noopTouch);
      window.removeEventListener("touchmove", noopTouch);
      document.removeEventListener("touchstart", noopTouch);
      iframe?.removeEventListener("touchstart", noopTouch);
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const openInMatterport = () => {
    setMobileOpen(false);
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const mobileOverlay =
    portalReady && isMobile && mobileOpen
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] flex flex-col bg-black"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            style={{ touchAction: "auto" }}
          >
            <div
              className="relative z-10 flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#0a0a0a] px-3"
              style={{
                paddingTop: "max(0.5rem, env(safe-area-inset-top))",
                paddingBottom: "0.5rem",
                minHeight: "2.75rem",
              }}
            >
              <p className="min-w-0 flex-1 truncate font-outfit text-[10px] font-light uppercase tracking-[0.12em] text-tl-beige/70">
                {title}
              </p>
              <button
                type="button"
                onClick={openInMatterport}
                className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-tl-gold/45 bg-tl-gold/10 px-2.5 font-outfit text-[9px] uppercase tracking-[0.1em] text-tl-gold"
              >
                App
                <ExternalLink className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar recorrido"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-tl-beige"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <div
              className="relative min-h-0 flex-1"
              style={{
                minHeight: "70dvh",
                paddingBottom: "env(safe-area-inset-bottom)",
                touchAction: "auto",
              }}
            >
              <iframe
                ref={iframeRef}
                title={title}
                src={mobileEmbedUrl}
                className="absolute inset-0 h-full w-full border-0"
                allow={IFRAME_ALLOW}
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                style={{ touchAction: "manipulation" }}
              />
            </div>

            {/* Respaldo visible si el iframe no responde a toques */}
            <div
              className="shrink-0 border-t border-white/10 bg-[#0a0a0a] px-3 py-2"
              style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
            >
              <button
                type="button"
                onClick={openInMatterport}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-tl-gold/50 font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-gold"
              >
                Si no responde, abrir en Matterport
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>,
          document.body,
        )
      : null;

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
        {!isMobile && loaded ? (
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
            <button
              type="button"
              onClick={() => {
                if (isMobile) setMobileOpen(true);
                else setLoaded(true);
              }}
              className="flex flex-col items-center gap-3 transition-colors active:text-tl-gold sm:hover:text-tl-gold"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-tl-gold/40 bg-tl-gold/10">
                <Play className="h-6 w-6 fill-current" />
              </span>
              <span className="inline-flex items-center gap-2 font-outfit text-xs uppercase tracking-[0.16em]">
                <Box className="h-4 w-4" />
                Ver recorrido 3D
              </span>
            </button>
            {isMobile ? (
              <>
                <p className="max-w-[16rem] px-4 text-center font-outfit text-[11px] font-light leading-relaxed text-tl-beige/45">
                  Primero se intenta dentro de Total Living. Si los botones no
                  responden, usa Abrir en Matterport.
                </p>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-gold/85"
                >
                  Abrir en Matterport
                  <ExternalLink className="h-3 w-3" />
                </a>
              </>
            ) : (
              <p className="max-w-xs px-4 text-center font-outfit text-[11px] font-light text-tl-beige/45">
                Se carga el tour de Matterport al hacer clic.
              </p>
            )}
          </div>
        )}
      </div>

      {mobileOverlay}
    </div>
  );
}
