"use client";

import type { Property } from "@/types/property";
import { formatPropertyBathrooms, formatPropertyLocation } from "@/types/property";
import { formatPrice } from "@/lib/format-price";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";
import { ArrowRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyMapPreviewCardProps {
  property: Property;
  onClose: () => void;
  className?: string;
}

const FALLBACK_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop";

export function PropertyMapPreviewCard({
  property,
  onClose,
  className,
}: PropertyMapPreviewCardProps) {
  const imageUrl =
    resolveMediaUrl(property.cover_image_url) || FALLBACK_PROPERTY_IMAGE;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-tl-gold/30 bg-tl-black/97 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl",
        "max-lg:rounded-t-[1.35rem] max-lg:border-b-0 max-lg:shadow-[0_-8px_40px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {/* Layout móvil: horizontal compacto */}
      <div className="flex gap-3 p-3 sm:hidden">
        <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-xl">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            unoptimized
            className="object-cover"
            sizes="88px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tl-black/50 to-transparent" />
        </div>

        <div className="min-w-0 flex-1 pr-6">
          <p className="font-outfit text-base font-extralight text-tl-gold">
            {formatPrice(property.price, property.currency)}
          </p>
          <p className="mt-0.5 line-clamp-2 font-outfit text-sm font-light leading-snug text-tl-beige">
            {property.title}
          </p>
          <p className="mt-1 line-clamp-1 font-outfit text-[11px] text-tl-beige/50">
            {formatPropertyLocation(property)}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-tl-black/80 text-tl-beige/80 active:scale-95"
          aria-label="Cerrar ficha"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pb-3 sm:hidden">
        <div className="mb-3 flex flex-wrap gap-x-2 gap-y-1 font-outfit text-[10px] font-light uppercase tracking-[0.12em] text-tl-beige/60">
          <span>{property.property_type}</span>
          <span className="text-tl-gold/25">·</span>
          <span>{property.bedrooms} rec</span>
          <span className="text-tl-gold/25">·</span>
          <span>{formatPropertyBathrooms(property)}</span>
        </div>
        <Link
          href={`/propiedades/${property.id}`}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-tl-gold px-4 py-3 font-outfit text-xs font-light uppercase tracking-[0.14em] text-tl-black active:opacity-90"
        >
          Ver a detalle
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Layout desktop / tablet */}
      <div className="hidden sm:block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 360px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tl-black via-tl-black/10 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-tl-black/70 text-tl-beige/80 transition-colors hover:border-tl-gold/40 hover:text-tl-gold"
            aria-label="Cerrar ficha"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="absolute bottom-3 left-3 font-outfit text-xl font-extralight text-tl-gold">
            {formatPrice(property.price, property.currency)}
          </p>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <p className="line-clamp-2 font-outfit text-base font-extralight leading-snug text-tl-beige">
              {property.title}
            </p>
            <p className="mt-1 font-outfit text-xs font-light text-tl-beige/55">
              {formatPropertyLocation(property)}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/65">
            <span>{property.property_type}</span>
            <span className="text-tl-gold/30">·</span>
            <span>{property.bedrooms} rec</span>
            <span className="text-tl-gold/30">·</span>
            <span>{formatPropertyBathrooms(property)}</span>
            <span className="text-tl-gold/30">·</span>
            <span>{property.build_area_m2} m²</span>
          </div>

          <Link
            href={`/propiedades/${property.id}`}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-tl-gold px-4 py-2.5 font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-black transition-opacity hover:opacity-90"
          >
            Ver a detalle
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
