"use client";

import { formatPrice } from "@/lib/format-price";
import { resolveMediaUrl } from "@/lib/media-url";
import type { Property } from "@/types/property";
import { formatPropertyLocation } from "@/types/property";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface PropertyMapSidebarItemProps {
  property: Property;
  isSelected: boolean;
  onSelect: (property: Property) => void;
}

const FALLBACK_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop";

export function PropertyMapSidebarItem({
  property,
  isSelected,
  onSelect,
}: PropertyMapSidebarItemProps) {
  const itemRef = useRef<HTMLButtonElement>(null);
  const imageUrl =
    resolveMediaUrl(property.cover_image_url) || FALLBACK_PROPERTY_IMAGE;

  useEffect(() => {
    if (isSelected) {
      itemRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isSelected]);

  return (
    <button
      ref={itemRef}
      type="button"
      onClick={() => onSelect(property)}
      className={cn(
        "group flex w-full min-h-[4.75rem] gap-3 rounded-xl border p-3 text-left transition-all active:scale-[0.99]",
        isSelected
          ? "border-tl-gold/50 bg-tl-gold/10 shadow-[0_0_0_1px_rgba(214,181,133,0.15)]"
          : "border-white/8 bg-white/[0.02] active:border-tl-gold/25 active:bg-white/[0.04] sm:hover:border-tl-gold/25 sm:hover:bg-white/[0.04]",
      )}
    >
      <div className="relative h-[4.25rem] w-[4.75rem] shrink-0 overflow-hidden rounded-lg sm:h-16 sm:w-20">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-active:scale-105 sm:group-hover:scale-105"
          sizes="80px"
        />
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <p className="font-outfit text-[15px] font-extralight text-tl-gold sm:text-sm">
          {formatPrice(property.price, property.currency)}
        </p>
        <p className="mt-0.5 line-clamp-2 font-outfit text-[13px] font-light leading-snug text-tl-beige sm:text-xs">
          {property.title}
        </p>
        <p className="mt-1 line-clamp-1 font-outfit text-[11px] font-light text-tl-beige/45 sm:text-[10px]">
          {formatPropertyLocation(property)}
        </p>
      </div>

      <Link
        href={`/propiedades/${property.id}`}
        onClick={(event) => event.stopPropagation()}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-full border border-tl-gold/30 text-tl-gold/80 transition-colors active:border-tl-gold active:bg-tl-gold/10 active:text-tl-gold sm:h-8 sm:w-8 sm:hover:border-tl-gold sm:hover:bg-tl-gold/10 sm:hover:text-tl-gold"
        aria-label={`Ver detalle de ${property.title}`}
      >
        <ArrowRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
      </Link>
    </button>
  );
}
