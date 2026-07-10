"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface DevelopmentGalleryProps {
  images: string[];
  name: string;
}

export function DevelopmentGallery({ images, name }: DevelopmentGalleryProps) {
  const gridImages = images.slice(0, 6);
  const total = gridImages.length;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % total)),
    [total],
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i - 1 + total) % total)),
    [total],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, next, prev]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2">
        {gridImages.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-square overflow-hidden border border-white/5"
          >
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-[1600ms] ease-out group-hover:scale-105"
              style={{ backgroundImage: `url('${image}')` }}
            />
            <div className="absolute inset-0 bg-tl-black/10 transition-colors group-hover:bg-tl-black/0" />
          </button>
        ))}
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-tl-black/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={close}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-tl-beige/80 transition-colors hover:border-tl-gold/60 hover:text-tl-gold"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Anterior"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-tl-beige/80 transition-colors hover:border-tl-gold/60 hover:text-tl-gold sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <figure
            className="max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mx-auto aspect-[3/2] w-full rounded-2xl bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${gridImages[activeIndex]}')` }}
            />
            <figcaption className="mt-4 text-center font-outfit text-xs font-light uppercase tracking-[0.18em] text-tl-beige/55">
              {name} · {activeIndex + 1} / {total}
            </figcaption>
          </figure>

          <button
            type="button"
            aria-label="Siguiente"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-tl-beige/80 transition-colors hover:border-tl-gold/60 hover:text-tl-gold sm:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      ) : null}
    </>
  );
}
