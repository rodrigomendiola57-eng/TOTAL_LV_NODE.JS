import { DevelopmentAmenitiesGrid } from "@/components/developments/detail/DevelopmentAmenitiesGrid";
import { DevelopmentGallery } from "@/components/developments/detail/DevelopmentGallery";
import { DevelopmentLocationBlock } from "@/components/developments/detail/DevelopmentLocationBlock";
import { DevelopmentModels } from "@/components/developments/detail/DevelopmentModels";
import {
  developmentStatusClasses,
  developmentWhatsAppUrl,
} from "@/components/developments/development-status";
import { SectionHeading } from "@/components/developments/detail/SectionHeading";
import { PropertyDetailSection } from "@/components/properties/detail/PropertyDetailSection";
import { formatPrice } from "@/lib/format-price";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import {
  formatAreaRange,
  formatBedroomsRange,
  type Development,
} from "@/types/development";
import { ArrowLeft, Building2, CalendarClock, MessageCircle } from "lucide-react";
import Link from "next/link";

interface DevelopmentDetailViewProps {
  development: Development;
}

export function DevelopmentDetailView({
  development,
}: DevelopmentDetailViewProps) {
  const waUrl = developmentWhatsAppUrl(development.name, development.zone);

  const facts = [
    {
      label: "Desde",
      value: formatPrice(String(development.priceFrom), development.currency),
    },
    { label: "Recámaras", value: formatBedroomsRange(development.bedroomsRange) },
    { label: "Superficie", value: formatAreaRange(development.areaRange) },
    { label: "Entrega", value: development.delivery },
  ];

  return (
    <main className="flex flex-1 flex-col bg-tl-black">
      <section className="relative min-h-[min(72vh,40rem)] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${development.coverImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-tl-black/50 via-tl-black/45 to-tl-black" />

        <div
          className={cn(
            "relative z-10 mx-auto flex min-h-[inherit] max-w-6xl flex-col justify-end px-4 pb-8 sm:px-6 sm:pb-12",
            HERO_CONTENT_OFFSET,
          )}
        >
          <Link
            href="/propiedades/desarrollos"
            className="mb-auto inline-flex w-fit items-center gap-2 font-outfit text-[11px] font-light uppercase tracking-[0.18em] text-tl-beige/70 transition-colors hover:text-tl-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Desarrollos
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-3 py-1 font-outfit text-[9px] font-light uppercase tracking-[0.18em] backdrop-blur-sm",
                developmentStatusClasses(development.status),
              )}
            >
              {development.status}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-tl-black/40 px-3 py-1 font-outfit text-[9px] font-light uppercase tracking-[0.16em] text-tl-beige/75 backdrop-blur-sm">
              <Building2 className="h-3 w-3" />
              {development.developer}
            </span>
          </div>

          <p className="mt-4 font-outfit text-[11px] font-light uppercase tracking-[0.24em] text-tl-gold/90">
            {development.zone} · {development.city}
          </p>
          <h1 className="mt-2 max-w-3xl font-cormorant text-4xl font-light leading-[0.95] text-tl-beige sm:text-6xl lg:text-7xl">
            {development.name}
          </h1>
          <p className="mt-3 max-w-2xl font-outfit text-sm font-light leading-relaxed tracking-[0.02em] text-tl-beige/75 sm:text-base">
            {development.tagline}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-6 sm:flex sm:flex-wrap sm:gap-x-10">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col">
                <span className="font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/50">
                  {fact.label}
                </span>
                <span className="mt-1 font-cormorant text-2xl font-light leading-none text-tl-gold sm:text-3xl">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-tl-gold bg-tl-gold px-6 py-3 font-outfit text-xs font-light uppercase tracking-[0.16em] text-tl-black shadow-[0_12px_40px_rgba(214,181,133,0.2)] transition-colors hover:bg-[#e2c59a] sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Solicitar información
            </a>
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 font-outfit text-xs font-light uppercase tracking-[0.16em] text-tl-beige/75">
              <CalendarClock className="h-4 w-4 text-tl-gold/70" />
              {development.totalUnits} unidades · {development.status}
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 sm:py-16">
        {development.amenities.length > 0 ? (
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <PropertyDetailSection
              title="Amenidades"
              subtitle="Lo que ofrece este desarrollo"
              wide
            >
              <DevelopmentAmenitiesGrid amenities={development.amenities} />
            </PropertyDetailSection>
          </div>
        ) : null}

        {development.gallery.length > 0 ? (
          <section className="mt-14 sm:mt-20">
            <SectionHeading title="Galería" subtitle="Conoce el desarrollo" />
            <div className="mt-8 sm:mt-10">
              <DevelopmentGallery
                images={development.gallery}
                name={development.name}
              />
            </div>
          </section>
        ) : null}

        <section className="mx-auto mt-14 w-full max-w-6xl px-4 sm:mt-20 sm:px-6">
          <PropertyDetailSection
            title="Modelos disponibles"
            subtitle="Elige el que se adapta a ti"
            wide
          >
            <DevelopmentModels
              models={development.models}
              developmentName={development.name}
              developmentSlug={development.slug}
              zone={development.zone}
              currency={development.currency}
            />
          </PropertyDetailSection>
        </section>

        <section className="mt-14 sm:mt-20">
          <SectionHeading title="Ubicación" subtitle="Dónde se encuentra" />
          <div className="mt-8 sm:mt-10">
            <DevelopmentLocationBlock development={development} />
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-6xl px-4 sm:mt-20 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-tl-gold/25 bg-gradient-to-b from-tl-black to-tl-olive/20 px-6 py-12 text-center sm:px-10 sm:py-16">
            <h2 className="font-cormorant text-3xl font-light text-tl-beige sm:text-4xl">
              ¿Te interesa {development.name}?
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-outfit text-sm font-extralight leading-relaxed text-tl-beige/70">
              Agenda una visita o recibe la lista de precios y disponibilidad
              actualizada. Un asesor Total Living te acompaña en todo el proceso.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-tl-gold px-8 py-3 font-outfit text-xs font-light uppercase tracking-[0.16em] text-tl-gold transition-colors active:bg-tl-gold active:text-tl-black sm:hover:bg-tl-gold sm:hover:text-tl-black"
            >
              <MessageCircle className="h-4 w-4" />
              Contactar asesor
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
