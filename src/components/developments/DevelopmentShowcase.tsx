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
import { BedDouble, Building2, CalendarClock, Maximize2 } from "lucide-react";
import Link from "next/link";

interface DevelopmentShowcaseProps {
  development: Development;
}

export function DevelopmentShowcase({ development }: DevelopmentShowcaseProps) {
  const waUrl = developmentWhatsAppUrl(development.name, development.zone);

  const stats: { icon: typeof BedDouble; label: string; value: string }[] = [
    {
      icon: BedDouble,
      label: "Recámaras",
      value: formatBedroomsRange(development.bedroomsRange),
    },
    {
      icon: Maximize2,
      label: "Superficie",
      value: formatAreaRange(development.areaRange),
    },
    {
      icon: Building2,
      label: "Unidades",
      value: String(development.totalUnits),
    },
    {
      icon: CalendarClock,
      label: "Entrega",
      value: development.delivery,
    },
  ];

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[18rem] overflow-hidden lg:min-h-[32rem]">
          <div
            className="h-full w-full scale-100 bg-cover bg-center transition-transform duration-[2400ms] ease-out group-hover:scale-105"
            style={{ backgroundImage: `url('${development.coverImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:to-tl-black/60" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-5 sm:top-5">
            <span className="rounded-full border border-tl-gold/50 bg-tl-black/50 px-3 py-1 font-outfit text-[9px] font-light uppercase tracking-[0.22em] text-tl-gold backdrop-blur-sm">
              Desarrollo destacado
            </span>
            <span
              className={`rounded-full border px-3 py-1 font-outfit text-[9px] font-light uppercase tracking-[0.18em] backdrop-blur-sm ${developmentStatusClasses(
                development.status,
              )}`}
            >
              {development.status}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
          <div>
            <p className="font-outfit text-[10px] font-light uppercase tracking-[0.24em] text-tl-gold/90">
              {development.zone} · {development.city}
            </p>
            <h2 className="mt-2 font-cormorant text-4xl font-light leading-none text-tl-beige sm:text-5xl">
              {development.name}
            </h2>
            <p className="mt-3 max-w-md font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/70">
              {development.description}
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
            <div>
              <p className="font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/45">
                Desde
              </p>
              <p className="font-outfit text-3xl font-extralight tracking-[0.01em] text-tl-gold">
                {formatPrice(String(development.priceFrom), development.currency)}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {development.unitTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-outfit text-[10px] font-light tracking-[0.04em] text-tl-beige/70"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-y border-white/[0.06] py-4 sm:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1.5 font-outfit text-[9px] font-light uppercase tracking-[0.16em] text-tl-beige/45">
                    <Icon className="h-3.5 w-3.5 text-tl-gold/70" strokeWidth={1.5} />
                    {stat.label}
                  </span>
                  <span className="font-outfit text-base font-extralight tracking-[0.01em] text-tl-beige">
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {development.amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1.5 font-outfit text-[11px] font-light tracking-[0.02em] text-tl-beige/60"
              >
                <span className="h-1 w-1 rounded-full bg-tl-gold/70" />
                {amenity}
              </span>
            ))}
          </div>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/propiedades/desarrollos/${development.slug}`}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-tl-gold bg-tl-gold px-7 py-3 font-outfit text-xs font-light uppercase tracking-[0.16em] text-tl-black shadow-[0_12px_40px_rgba(214,181,133,0.18)] transition-colors hover:bg-[#e2c59a]"
            >
              Ver desarrollo
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-tl-gold/40 px-7 py-3 font-outfit text-xs font-light uppercase tracking-[0.16em] text-tl-gold transition-colors hover:border-tl-gold/70 hover:bg-tl-gold/[0.08]"
            >
              Solicitar información
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
