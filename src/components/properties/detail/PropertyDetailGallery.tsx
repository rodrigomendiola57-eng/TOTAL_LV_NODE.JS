"use client";

import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";
import type { PropertyPhoto } from "@/types/property-photo";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid3x3, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface PropertyDetailGalleryProps {
  photos: PropertyPhoto[];
  title: string;
  fallbackUrl?: string | null;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop";

const PREVIEW_COUNT = 5;

function getPhotoUrl(
  photo: PropertyPhoto | null,
  fallbackUrl?: string | null,
): string {
  return resolveMediaUrl(photo?.url) ?? photo?.url ?? fallbackUrl ?? FALLBACK_IMAGE;
}

export function PropertyDetailGallery({
  photos,
  title,
  fallbackUrl,
}: PropertyDetailGalleryProps) {
  const ordered = useMemo(
    () => [...photos].sort((a, b) => a.order - b.order),
    [photos],
  );

  const slides = useMemo(() => {
    if (ordered.length > 0) return ordered;
    return [{ id: -1, url: fallbackUrl ?? FALLBACK_IMAGE, order: 0, is_cover: true, alt_text: title, created_at: "" }];
  }, [ordered, fallbackUrl, title]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeSlide = slides[activeIndex] ?? slides[0];
  const activeUrl = getPhotoUrl(
    activeSlide && "id" in activeSlide && activeSlide.id !== -1
      ? (activeSlide as PropertyPhoto)
      : null,
    activeSlide?.url ?? fallbackUrl,
  );

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const goTo = useCallback(
    (direction: -1 | 1) => {
      setActiveIndex((current) => {
        const next = current + direction;
        if (next < 0) return slides.length - 1;
        if (next >= slides.length) return 0;
        return next;
      });
    },
    [slides.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowLeft") goTo(-1);
      if (event.key === "ArrowRight") goTo(1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, goTo]);

  const previewSlides = slides.slice(0, PREVIEW_COUNT);
  const remainingCount = Math.max(0, slides.length - PREVIEW_COUNT);

  return (
    <>
      <section aria-label="Galería de fotos" className="space-y-3">
        {/* Mobile: imagen principal + contador */}
        <div className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-tl-black/40 lg:hidden">
          <button
            type="button"
            onClick={() => openLightbox(activeIndex)}
            className="relative block aspect-[4/3] w-full"
            aria-label="Abrir galería en pantalla completa"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeUrl}
              alt={activeSlide?.alt_text || title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-tl-black/55 via-transparent to-transparent" />
          </button>

          {slides.length > 1 ? (
            <>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {slides.slice(0, 8).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Ver foto ${index + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      index === activeIndex
                        ? "w-5 bg-tl-gold"
                        : "w-1.5 bg-tl-beige/35",
                    )}
                  />
                ))}
              </div>
              <p className="absolute bottom-3 right-3 rounded-full bg-tl-black/70 px-2.5 py-1 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/80 backdrop-blur-sm">
                {activeIndex + 1} / {slides.length}
              </p>
              <button
                type="button"
                onClick={() => goTo(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-tl-black/55 p-2 text-tl-beige backdrop-blur-sm"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goTo(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-tl-black/55 p-2 text-tl-beige backdrop-blur-sm"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : null}
        </div>

        {/* Desktop: bento grid */}
        <div
          className={cn(
            "hidden gap-2 lg:grid",
            previewSlides.length === 1 && "grid-cols-1",
            previewSlides.length === 2 && "grid-cols-2",
            previewSlides.length >= 3 && "grid-cols-4 grid-rows-2",
          )}
          style={
            previewSlides.length >= 3
              ? { minHeight: "min(58vh, 520px)" }
              : { minHeight: "min(48vh, 420px)" }
          }
        >
          {previewSlides.map((photo, index) => {
            const isHero = index === 0 && previewSlides.length >= 3;
            const isMoreCell = index === PREVIEW_COUNT - 1 && remainingCount > 0;
            const url = getPhotoUrl(
              photo.id !== -1 ? photo : null,
              photo.url ?? fallbackUrl,
            );

            return (
              <button
                key={photo.id === -1 ? "fallback" : photo.id}
                type="button"
                onClick={() => openLightbox(index)}
                className={cn(
                  "group relative overflow-hidden rounded-[1.1rem] border border-white/10 bg-tl-black/40",
                  isHero && "col-span-2 row-span-2",
                  !isHero && previewSlides.length >= 3 && "col-span-1 row-span-1",
                  previewSlides.length === 2 && "min-h-[320px]",
                )}
                aria-label={
                  isMoreCell
                    ? `Ver ${remainingCount} fotos más`
                    : `Ver foto ${index + 1}`
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={photo.alt_text || `${title} foto ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-tl-black/0 transition-colors group-hover:bg-tl-black/15" />
                {isMoreCell ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-tl-black/55 backdrop-blur-[2px]">
                    <Grid3x3 className="mb-2 h-5 w-5 text-tl-gold" />
                    <span className="font-outfit text-sm font-light text-tl-beige">
                      +{remainingCount} fotos
                    </span>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>

        {slides.length > 1 ? (
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="hidden w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.02] py-3 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-beige/70 transition-all hover:border-tl-gold/35 hover:text-tl-gold lg:flex"
          >
            <Grid3x3 className="h-3.5 w-3.5" />
            Ver las {slides.length} fotos
          </button>
        ) : null}
      </section>

      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-tl-black/96 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label="Galería en pantalla completa"
          >
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <p className="font-outfit text-xs font-light uppercase tracking-[0.18em] text-tl-beige/60">
                {activeIndex + 1} / {slides.length}
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-full border border-white/15 p-2.5 text-tl-beige transition-colors hover:border-tl-gold/50 hover:text-tl-gold"
                aria-label="Cerrar galería"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-12">
              <button
                type="button"
                onClick={() => goTo(-1)}
                className="absolute left-3 z-10 rounded-full border border-white/15 bg-tl-black/50 p-3 text-tl-beige backdrop-blur-sm transition-colors hover:border-tl-gold/50 sm:left-6"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="max-h-[72vh] w-full max-w-6xl overflow-hidden rounded-2xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPhotoUrl(
                    slides[activeIndex]?.id !== -1
                      ? (slides[activeIndex] as PropertyPhoto)
                      : null,
                    slides[activeIndex]?.url ?? fallbackUrl,
                  )}
                  alt={slides[activeIndex]?.alt_text || title}
                  className="mx-auto max-h-[72vh] w-full object-contain"
                />
              </motion.div>

              <button
                type="button"
                onClick={() => goTo(1)}
                className="absolute right-3 z-10 rounded-full border border-white/15 bg-tl-black/50 p-3 text-tl-beige backdrop-blur-sm transition-colors hover:border-tl-gold/50 sm:right-6"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {slides.length > 1 ? (
              <div className="border-t border-white/8 px-4 py-4 sm:px-6">
                <div className="mx-auto flex max-w-4xl gap-2 overflow-x-auto pb-1">
                  {slides.map((photo, index) => (
                    <button
                      key={photo.id === -1 ? `fallback-${index}` : photo.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-all sm:h-16 sm:w-24",
                        index === activeIndex
                          ? "border-tl-gold ring-1 ring-tl-gold/50"
                          : "border-white/10 opacity-70 hover:opacity-100",
                      )}
                      aria-label={`Ir a foto ${index + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getPhotoUrl(
                          photo.id !== -1 ? photo : null,
                          photo.url ?? fallbackUrl,
                        )}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
