"use client";

import type { PropertyPhoto } from "@/types/property-photo";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/media-url";
import { Star } from "lucide-react";
import { useState } from "react";

interface PropertyPhotoGalleryProps {
  photos: PropertyPhoto[];
  title: string;
  fallbackUrl?: string | null;
  variant?: "default" | "hero";
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop";

export function PropertyPhotoGallery({
  photos,
  title,
  fallbackUrl,
  variant = "default",
}: PropertyPhotoGalleryProps) {
  const ordered = [...photos].sort((a, b) => a.order - b.order);
  const cover =
    ordered.find((photo) => photo.is_cover) ?? ordered[0] ?? null;
  const [activeId, setActiveId] = useState<number | "fallback">(
    cover?.id ?? "fallback",
  );

  const activePhoto =
    activeId === "fallback"
      ? null
      : ordered.find((photo) => photo.id === activeId) ?? cover;

  const mainUrl =
    resolveMediaUrl(activePhoto?.url ?? cover?.url ?? fallbackUrl) ??
    FALLBACK_IMAGE;
  const isHero = variant === "hero";

  return (
    <section className={cn(isHero ? "space-y-0" : "space-y-4")}>
      <div
        className={cn(
          "overflow-hidden bg-tl-black/50",
          isHero
            ? "border-b border-tl-gold/15"
            : "rounded-2xl border border-tl-gold/25",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden",
            isHero ? "aspect-[16/9] min-h-[52vh] sm:aspect-auto sm:min-h-[58vh]" : "aspect-[16/10]",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainUrl}
            alt={activePhoto?.alt_text || title}
            className="h-full w-full object-cover"
          />
          {isHero ? (
            <div className="absolute inset-0 bg-gradient-to-b from-tl-black/45 via-transparent to-tl-black/70" />
          ) : null}
          {activePhoto?.is_cover || (!activePhoto && cover) ? (
            <span className="absolute left-4 top-20 inline-flex items-center gap-1.5 rounded-full border border-tl-gold/50 bg-black/60 px-3 py-1 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-gold backdrop-blur-sm sm:top-24">
              <Star className="h-3.5 w-3.5" fill="currentColor" />
              Portada
            </span>
          ) : null}
        </div>
      </div>

      {ordered.length > 1 ? (
        <div
          className={cn(
            "grid grid-cols-4 gap-3 sm:grid-cols-6",
            isHero && "mx-auto max-w-5xl px-4 py-4 sm:px-6",
          )}
        >
          {ordered.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveId(photo.id)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl border transition-all",
                activeId === photo.id
                  ? "border-tl-gold ring-2 ring-tl-gold/40"
                  : "border-tl-gold/20 hover:border-tl-gold/50",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveMediaUrl(photo.url) ?? photo.url}
                alt={photo.alt_text || `${title} foto ${photo.order + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

