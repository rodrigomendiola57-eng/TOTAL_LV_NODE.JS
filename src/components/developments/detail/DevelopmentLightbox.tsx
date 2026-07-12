"use client";

import { lockBodyScroll } from "@/lib/lock-body-scroll";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DevelopmentLightboxProps {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
  /**
   * Por defecto true: monta en document.body para quedar sobre el navbar
   * y bloquear el scroll de la página de forma fiable.
   */
  portal?: boolean;
}

/**
 * Visor a pantalla completa: imagen centrada con márgenes
 * y scroll de fondo bloqueado hasta cerrar.
 */
export function DevelopmentLightbox({
  src,
  alt,
  caption,
  onClose,
  onPrev,
  onNext,
  className,
  portal = true,
}: DevelopmentLightboxProps) {
  const hasNav = Boolean(onPrev && onNext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext?.();
      if (e.key === "ArrowLeft") onPrev?.();
    };
    window.addEventListener("keydown", onKey);
    const unlock = lockBodyScroll();

    const preventTouchScroll = (e: TouchEvent) => {
      // Permite gestos dentro del lightbox; bloquea el scroll de la página.
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-development-lightbox]")) return;
      e.preventDefault();
    };
    document.addEventListener("touchmove", preventTouchScroll, {
      passive: false,
    });

    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("touchmove", preventTouchScroll);
      unlock();
    };
  }, [onClose, onNext, onPrev]);

  const content = (
    <div
      data-development-lightbox
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center overscroll-none",
        className,
      )}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        aria-label="Cerrar fondo"
        className="absolute inset-0 bg-tl-black/95 backdrop-blur-sm"
        onClick={onClose}
      />

      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-tl-beige/80 transition-colors hover:border-tl-gold/60 hover:text-tl-gold sm:right-5 sm:top-5"
      >
        <X className="h-5 w-5" />
      </button>

      {hasNav ? (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={onPrev}
            className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-tl-beige/80 transition-colors hover:border-tl-gold/60 hover:text-tl-gold sm:left-5 sm:h-12 sm:w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={onNext}
            className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-tl-beige/80 transition-colors hover:border-tl-gold/60 hover:text-tl-gold sm:right-5 sm:h-12 sm:w-12"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      ) : null}

      <figure
        className="relative z-10 flex max-h-[min(90dvh,900px)] w-full max-w-[min(90vw,1080px)] flex-col items-center justify-center px-12 sm:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-[min(75dvh,760px)] w-auto max-w-full object-contain select-none"
          draggable={false}
        />
        {caption ? (
          <figcaption className="mt-3 shrink-0 text-center font-outfit text-[11px] font-light uppercase tracking-[0.18em] text-tl-beige/55 sm:mt-4 sm:text-xs">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );

  if (portal) {
    if (!mounted) return null;
    return createPortal(content, document.body);
  }

  return content;
}
