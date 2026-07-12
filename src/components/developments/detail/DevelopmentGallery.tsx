"use client";

import { DevelopmentLightbox } from "@/components/developments/detail/DevelopmentLightbox";
import { useCallback, useState } from "react";

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
        <DevelopmentLightbox
          src={gridImages[activeIndex]}
          alt={`${name} — foto ${activeIndex + 1}`}
          caption={`${name} · ${activeIndex + 1} / ${total}`}
          onClose={close}
          onPrev={total > 1 ? prev : undefined}
          onNext={total > 1 ? next : undefined}
        />
      ) : null}
    </>
  );
}
