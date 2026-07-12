import { DevelopmentFloorPlans } from "@/components/developments/detail/DevelopmentFloorPlans";
import { DevelopmentModelGallery } from "@/components/developments/detail/DevelopmentModelGallery";
import { MatterportTourEmbed } from "@/components/developments/detail/MatterportTourEmbed";
import { SectionHeading } from "@/components/developments/detail/SectionHeading";
import { developmentWhatsAppUrl } from "@/components/developments/development-status";
import { formatPrice } from "@/lib/format-price";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import {
  formatBathrooms,
  type Development,
  type DevelopmentModel,
} from "@/types/development";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Box,
  Car,
  Check,
  Maximize2,
  MessageCircle,
  Ruler,
} from "lucide-react";
import Link from "next/link";

interface DevelopmentModelViewProps {
  development: Development;
  model: DevelopmentModel;
}

export function DevelopmentModelView({
  development,
  model,
}: DevelopmentModelViewProps) {
  // Galería del modelo; si está vacía, portada + galería del desarrollo.
  const images = (() => {
    const own = (model.gallery ?? []).filter(Boolean);
    if (own.length > 0) return own;
    const fallback: string[] = [];
    if (model.image) fallback.push(model.image);
    for (const url of development.gallery ?? []) {
      if (url && !fallback.includes(url)) fallback.push(url);
    }
    return fallback;
  })();
  const waUrl = developmentWhatsAppUrl(
    `${development.name} — modelo ${model.name}`,
    development.zone,
  );

  const hasDiscount = model.listPrice != null && model.listPrice > model.priceFrom;
  const discount = hasDiscount ? model.listPrice! - model.priceFrom : 0;

  const specs = [
    { icon: BedDouble, label: "Habitaciones", value: String(model.bedrooms) },
    {
      icon: Bath,
      label: "Baños",
      value: formatBathrooms(model.bathrooms, model.halfBathrooms),
    },
    { icon: Maximize2, label: "Construcción", value: `${model.areaM2} m²` },
    ...(model.lotM2
      ? [{ icon: Ruler, label: "Terreno", value: `${model.lotM2} m²` }]
      : []),
    { icon: Car, label: "Estacionamiento", value: `${model.parking} autos` },
  ];

  return (
    <main className="flex flex-1 flex-col bg-tl-black">
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6",
          HERO_CONTENT_OFFSET,
        )}
      >
        <nav className="flex flex-wrap items-center gap-2 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-beige/55">
          <Link
            href="/propiedades/desarrollos"
            className="transition-colors hover:text-tl-gold"
          >
            Desarrollos
          </Link>
          <span className="text-tl-gold/40">/</span>
          <Link
            href={`/propiedades/desarrollos/${development.slug}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-tl-gold"
          >
            {development.name}
          </Link>
          <span className="text-tl-gold/40">/</span>
          <span className="text-tl-beige/80">{model.name}</span>
        </nav>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div>
            <DevelopmentModelGallery images={images} name={model.name} />
          </div>

          <div className="flex flex-col">
            <Link
              href={`/propiedades/desarrollos/${development.slug}`}
              className="inline-flex w-fit items-center gap-2 font-outfit text-[11px] font-light uppercase tracking-[0.2em] text-tl-gold/90 transition-colors hover:text-tl-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {development.name}
            </Link>

            <h1 className="mt-3 font-cormorant text-4xl font-light leading-none text-tl-beige sm:text-5xl">
              {model.name}
            </h1>
            <p className="mt-3 font-outfit text-sm font-extralight leading-relaxed tracking-[0.01em] text-tl-beige/70">
              {model.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {specs.map((spec) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={spec.label}
                    className="rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-3"
                  >
                    <Icon className="h-4 w-4 text-tl-gold/70" strokeWidth={1.5} />
                    <p className="mt-2 font-outfit text-[1.05rem] font-extralight leading-none tracking-[0.01em] text-tl-beige">
                      {spec.value}
                    </p>
                    <p className="mt-1.5 font-outfit text-[9px] font-light uppercase tracking-[0.14em] text-tl-beige/45">
                      {spec.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {model.features && model.features.length > 0 ? (
              <div className="mt-6">
                <p className="font-outfit text-[11px] font-light uppercase tracking-[0.2em] text-tl-gold">
                  Otras características
                </p>
                <ul className="mt-3 space-y-2">
                  {model.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 font-outfit text-sm font-extralight leading-relaxed tracking-[0.01em] text-tl-beige/75"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-tl-gold/70"
                        strokeWidth={1.5}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              {hasDiscount ? (
                <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
                  <div>
                    <p className="font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/45">
                      Precio
                    </p>
                    <p className="font-outfit text-base font-extralight text-tl-beige/50 line-through">
                      {formatPrice(String(model.listPrice), development.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/45">
                      Descuento
                    </p>
                    <p className="font-outfit text-base font-extralight text-tl-gold/80">
                      -{formatPrice(String(discount), development.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/45">
                      Total
                    </p>
                    <p className="font-outfit text-2xl font-extralight tracking-[0.01em] text-tl-gold">
                      {formatPrice(String(model.priceFrom), development.currency)}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/45">
                    Precio
                  </p>
                  <p className="font-outfit text-3xl font-extralight tracking-[0.01em] text-tl-gold">
                    {formatPrice(String(model.priceFrom), development.currency)}
                  </p>
                </div>
              )}
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-tl-gold bg-tl-gold px-6 py-3 font-outfit text-xs font-light uppercase tracking-[0.16em] text-tl-black shadow-[0_12px_40px_rgba(214,181,133,0.2)] transition-colors hover:bg-[#e2c59a]"
            >
              <MessageCircle className="h-4 w-4" />
              Solicitar información
            </a>

            {model.tour?.enabled && model.tour.id ? (
              <a
                href="#recorrido-3d"
                className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-tl-gold/40 px-6 py-3 font-outfit text-xs font-light uppercase tracking-[0.16em] text-tl-gold transition-colors hover:border-tl-gold hover:bg-tl-gold/10"
              >
                <Box className="h-4 w-4" />
                Ver recorrido 3D
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {model.floorPlans && model.floorPlans.length > 0 ? (
        <section className="border-t border-white/[0.06] bg-white/[0.01] py-14 sm:py-20">
          <SectionHeading
            title="Plantas"
            subtitle={
              model.floorPlans.length === 1
                ? "Distribución"
                : `${model.floorPlans.length} niveles`
            }
          />
          <div className="mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6">
            <DevelopmentFloorPlans plans={model.floorPlans} />
          </div>
        </section>
      ) : null}

      {model.tour?.enabled && model.tour.id ? (
        <section
          id="recorrido-3d"
          className="scroll-mt-24 border-t border-white/[0.06] py-14 sm:py-20"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <MatterportTourEmbed
              modelId={model.tour.id}
              title={model.tour.title || `Recorrido 3D — ${model.name}`}
            />
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="overflow-hidden rounded-3xl border border-tl-gold/25 bg-gradient-to-b from-tl-black to-tl-olive/20 px-6 py-12 text-center sm:px-10 sm:py-16">
          <h2 className="font-cormorant text-3xl font-light text-tl-beige sm:text-4xl">
            ¿Te gusta el modelo {model.name}?
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-outfit text-sm font-extralight leading-relaxed text-tl-beige/70">
            Agenda una visita o recibe la ficha completa con disponibilidad y
            plan de pagos. Un asesor Total Living te acompaña.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-tl-gold px-8 py-3 font-outfit text-xs font-light uppercase tracking-[0.16em] text-tl-gold transition-colors active:bg-tl-gold active:text-tl-black sm:hover:bg-tl-gold sm:hover:text-tl-black"
          >
            <MessageCircle className="h-4 w-4" />
            Agendar visita
          </a>
        </div>
      </section>
    </main>
  );
}
