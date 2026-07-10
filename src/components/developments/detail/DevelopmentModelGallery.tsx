"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface DevelopmentModelGalleryProps {
  images: string[];
  name: string;
}

export function DevelopmentModelGallery({
  images,
  name,
}: DevelopmentModelGalleryProps) {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const total = images.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, next, prev]);

  if (total === 0) return null;

  return (
    <div className="space-y-3">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
        <div
          className="h-full w-full bg-cover bg-center transition-[background-image] duration-500"
          style={{ backgroundImage: `url('${images[index]}')` }}
        />

        {total > 1 ? (
          <>
            <button
              type="button"
              aria-label="Anterior"
              onClick={prev}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-tl-black/45 text-tl-beige/85 backdrop-blur-sm transition-colors hover:border-tl-gold/60 hover:text-tl-gold"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={next}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-tl-black/45 text-tl-beige/85 backdrop-blur-sm transition-colors hover:border-tl-gold/60 hover:text-tl-gold"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}

        <button
          type="button"
          aria-label="Ampliar"
          onClick={() => setIsOpen(true)}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-tl-black/45 text-tl-beige/85 backdrop-blur-sm transition-colors hover:border-tl-gold/60 hover:text-tl-gold"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {total > 1 ? (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((image, i) => (
            <button
              key={image}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border transition-colors",
                i === index
                  ? "border-tl-gold"
                  : "border-white/10 hover:border-white/25",
              )}
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url('${image}')` }}
              />
              {i !== index ? (
                <div className="absolute inset-0 bg-tl-black/40" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {isOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-tl-black/95 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setIsOpen(false)}
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
              style={{ backgroundImage: `url('${images[index]}')` }}
            />
            <figcaption className="mt-4 text-center font-outfit text-xs font-light uppercase tracking-[0.18em] text-tl-beige/55">
              {name} · {index + 1} / {total}
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
    </div>
  );
}
