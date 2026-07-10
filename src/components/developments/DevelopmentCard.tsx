import {
  developmentStatusClasses,
  developmentWhatsAppUrl,
} from "@/components/developments/development-status";
import { formatPrice } from "@/lib/format-price";
import {
  formatAreaRange,
  formatBedroomsRange,
  type Development,
} from "@/types/development";
import { BedDouble, Building2, CalendarClock, Maximize2, MessageCircle } from "lucide-react";
import Link from "next/link";

interface DevelopmentCardProps {
  development: Development;
}

export function DevelopmentCard({ development }: DevelopmentCardProps) {
  const waUrl = developmentWhatsAppUrl(development.name, development.zone);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-tl-gold/45 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      <div className="relative aspect-[4/5] overflow-hidden">
        <div
          className="h-full w-full scale-100 bg-cover bg-center transition-transform duration-[2200ms] ease-out group-hover:scale-105"
          style={{ backgroundImage: `url('${development.coverImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/10" />

        <span
          className={`absolute left-3.5 top-3.5 rounded-full border px-3 py-1 font-outfit text-[9px] font-light uppercase tracking-[0.18em] backdrop-blur-sm ${developmentStatusClasses(
            development.status,
          )}`}
        >
          {development.status}
        </span>

        <span className="absolute right-3.5 top-3.5 rounded-full border border-white/15 bg-tl-black/40 px-3 py-1 font-outfit text-[9px] font-light uppercase tracking-[0.16em] text-tl-beige/75 backdrop-blur-sm">
          {development.city}
        </span>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-12">
          <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/90">
            {development.zone}
          </p>
          <h3 className="mt-1 font-cormorant text-2xl font-light leading-tight text-tl-beige sm:text-3xl">
            {development.name}
          </h3>
          <p className="mt-1 line-clamp-1 font-outfit text-xs font-extralight tracking-[0.02em] text-tl-beige/65">
            {development.tagline}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 py-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/45">
              Desde
            </p>
            <p className="font-outfit text-xl font-extralight tracking-[0.01em] text-tl-gold sm:text-2xl">
              {formatPrice(String(development.priceFrom), development.currency)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/55">
            <CalendarClock className="h-3.5 w-3.5 text-tl-gold/70" strokeWidth={1.5} />
            {development.delivery}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {development.unitTypes.map((type) => (
            <span
              key={type}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-outfit text-[10px] font-light tracking-[0.04em] text-tl-beige/70"
            >
              {type}
            </span>
          ))}
        </div>

        <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/[0.06] pt-3.5 font-outfit text-[11px] font-light tracking-[0.02em] text-tl-beige/65">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5 text-tl-gold/70" strokeWidth={1.5} />
            {formatBedroomsRange(development.bedroomsRange)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-tl-gold/70" strokeWidth={1.5} />
            {formatAreaRange(development.areaRange)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-tl-gold/70" strokeWidth={1.5} />
            {development.totalUnits} unidades
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <Link
            href={`/propiedades/desarrollos/${development.slug}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-tl-gold/45 px-4 py-2.5 font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-gold transition-colors active:bg-tl-gold active:text-tl-black sm:hover:bg-tl-gold sm:hover:text-tl-black"
          >
            Ver desarrollo
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Solicitar información por WhatsApp"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-tl-gold/35 text-tl-gold transition-colors active:border-tl-gold active:bg-tl-gold/10 sm:hover:border-tl-gold sm:hover:bg-tl-gold/10"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
