import {
  developmentStatusClasses,
} from "@/components/developments/development-status";
import { formatPrice } from "@/lib/format-price";
import type { Development } from "@/types/development";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface DevelopmentCardProps {
  development: Development;
}

/**
 * Card de desarrollo: imagen grande dominante, 2 por fila.
 * Minimalista y distinta a las cards de venta/renta (sin pills de specs).
 */
export function DevelopmentCard({ development }: DevelopmentCardProps) {
  const href = `/propiedades/desarrollos/${development.slug}`;

  return (
    <article className="group relative">
      <Link
        href={href}
        className="relative block overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tl-gold"
      >
        {/* Imagen ancha; en desktop más baja para no abarcar tanto vertical */}
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[16/11]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2200ms] ease-out will-change-transform group-hover:scale-[1.05]"
            style={{ backgroundImage: `url('${development.coverImage}')` }}
          />

          {/* Velos: aire arriba, ancla abajo para tipografía */}
          <div className="absolute inset-0 bg-gradient-to-b from-tl-black/35 via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-tl-black via-tl-black/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-tl-olive/25 via-transparent to-transparent mix-blend-soft-light" />

          <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-5 sm:top-5">
            <span
              className={`border px-2.5 py-1 font-outfit text-[9px] font-light uppercase tracking-[0.2em] backdrop-blur-[2px] ${developmentStatusClasses(
                development.status,
              )}`}
            >
              {development.status}
            </span>
          </div>

          <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-white/20 text-tl-beige/70 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:border-tl-gold/50 group-hover:text-tl-gold sm:right-5 sm:top-5">
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.25} />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 sm:p-5 lg:p-6">
            <p className="font-outfit text-[10px] font-light uppercase tracking-[0.28em] text-tl-gold">
              {development.zone}
            </p>

            <h3 className="mt-1.5 max-w-[18ch] font-cormorant text-[1.75rem] font-light leading-[0.95] tracking-[-0.02em] text-tl-beige sm:text-[2rem] lg:text-[2.25rem]">
              {development.name}
            </h3>

            {development.tagline ? (
              <p className="mt-2 max-w-md line-clamp-1 font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/65 sm:line-clamp-2">
                {development.tagline}
              </p>
            ) : null}

            <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/10 pt-3.5 sm:mt-5 sm:pt-4">
              <div>
                <p className="font-outfit text-[9px] font-light uppercase tracking-[0.18em] text-tl-beige/40">
                  Desde
                </p>
                <p className="mt-0.5 font-outfit text-xl font-extralight tracking-[0.01em] text-tl-gold sm:text-2xl">
                  {formatPrice(
                    String(development.priceFrom),
                    development.currency,
                  )}
                </p>
              </div>

              <span className="mb-0.5 font-outfit text-[10px] font-light uppercase tracking-[0.2em] text-tl-beige/55 transition-colors group-hover:text-tl-gold">
                Conocer
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
