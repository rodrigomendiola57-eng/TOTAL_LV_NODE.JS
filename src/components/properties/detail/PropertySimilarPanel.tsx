import { formatPrice } from "@/lib/format-price";
import { resolveMediaUrl } from "@/lib/media-url";
import type { Property } from "@/types/property";
import { formatPropertyLocation } from "@/types/property";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface PropertySimilarPanelProps {
  properties: Property[];
  zone: string;
  className?: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop";

export function PropertySimilarPanel({
  properties,
  zone,
  className = "",
}: PropertySimilarPanelProps) {
  if (properties.length === 0) {
    return null;
  }

  return (
    <section
      className={`overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-5 ${className}`}
      aria-label="Propiedades similares"
    >
      <header className="text-center">
        <h3 className="font-outfit text-[clamp(1.2rem,2.4vw,1.45rem)] font-extralight tracking-[0.02em] text-tl-beige">
          Propiedades similares
        </h3>
        <p className="mt-1.5 font-outfit text-[10px] font-extralight uppercase tracking-[0.18em] text-tl-gold">
          Misma zona · {zone}
        </p>
      </header>

      <ul className="mt-5 space-y-3">
        {properties.map((property) => {
          const imageUrl =
            resolveMediaUrl(property.cover_image_url) || FALLBACK_IMAGE;

          return (
            <li key={property.id}>
              <Link
                href={`/propiedades/${property.id}`}
                className="group flex gap-3 rounded-2xl border border-white/8 bg-tl-black/25 p-2.5 transition-colors hover:border-tl-gold/30 hover:bg-white/[0.03]"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div>
                    <p className="line-clamp-2 font-outfit text-sm font-extralight leading-snug text-tl-beige/90">
                      {property.title}
                    </p>
                    <p className="mt-1 line-clamp-1 font-outfit text-[10px] font-extralight tracking-[0.04em] text-tl-beige/45">
                      {formatPropertyLocation(property)}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="font-outfit text-sm font-extralight text-tl-gold">
                      {formatPrice(property.price, property.currency)}
                    </p>
                    <span className="inline-flex items-center gap-0.5 font-outfit text-[9px] font-extralight uppercase tracking-[0.14em] text-tl-beige/40 transition-colors group-hover:text-tl-gold">
                      Ver
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
