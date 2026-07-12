import { formatPrice } from "@/lib/format-price";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";
import { formatPropertyLocation } from "@/types/property";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface PropertySimilarPanelProps {
  properties: Property[];
  zone: string;
  className?: string;
  /** `list` = desktop (sidebar). `carousel` = solo móvil. */
  variant?: "list" | "carousel";
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop";

export function PropertySimilarPanel({
  properties,
  zone,
  className = "",
  variant = "list",
}: PropertySimilarPanelProps) {
  if (properties.length === 0) {
    return null;
  }

  if (variant === "carousel") {
    // Card centrada + peek simétrico a izq/der.
    // Ancho card = min(72vw, 16.5rem) → mitad = min(36vw, 8.25rem)
    const sidePad =
      "pl-[calc(50%-min(36vw,8.25rem))] pr-[calc(50%-min(36vw,8.25rem))] scroll-pl-[calc(50%-min(36vw,8.25rem))] scroll-pr-[calc(50%-min(36vw,8.25rem))]";

    return (
      <section
        className={cn("lg:hidden", className)}
        aria-label="Propiedades similares"
      >
        <header className="px-1 text-center">
          <h3 className="font-outfit text-[clamp(1.2rem,2.4vw,1.45rem)] font-extralight tracking-[0.02em] text-tl-beige">
            Propiedades similares
          </h3>
          <p className="mt-1.5 font-outfit text-[10px] font-extralight uppercase tracking-[0.18em] text-tl-gold">
            Misma zona · {zone}
          </p>
        </header>

        <div
          className={cn(
            "-mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            sidePad,
          )}
          role="list"
        >
          {properties.map((property) => {
            const imageUrl =
              resolveMediaUrl(property.cover_image_url) || FALLBACK_IMAGE;

            return (
              <Link
                key={property.id}
                href={`/propiedades/${property.id}`}
                role="listitem"
                className="group w-[min(72vw,16.5rem)] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors active:border-tl-gold/35"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tl-black/70 via-transparent to-transparent" />
                </div>

                <div className="space-y-2 px-3.5 py-3.5">
                  <p className="line-clamp-2 min-h-[2.5rem] font-outfit text-sm font-extralight leading-snug text-tl-beige/90">
                    {property.title}
                  </p>
                  <p className="line-clamp-1 font-outfit text-[10px] font-extralight tracking-[0.04em] text-tl-beige/45">
                    {formatPropertyLocation(property)}
                  </p>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <p className="font-outfit text-base font-extralight text-tl-gold">
                      {formatPrice(property.price, property.currency)}
                    </p>
                    <span className="inline-flex items-center gap-0.5 font-outfit text-[9px] font-extralight uppercase tracking-[0.14em] text-tl-beige/45">
                      Ver
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-2 text-center font-outfit text-[10px] font-extralight tracking-[0.06em] text-tl-beige/35">
          Desliza para ver más
        </p>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-5",
        className,
      )}
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
