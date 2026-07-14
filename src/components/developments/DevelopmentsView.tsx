import { DevelopmentCard } from "@/components/developments/DevelopmentCard";
import { FeaturedDevelopmentsCarousel } from "@/components/developments/FeaturedDevelopmentsCarousel";
import { Reveal } from "@/components/ui/Reveal";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import type { Development } from "@/types/development";
import type { DevelopmentsPageContent } from "@/types/developments-page";
import Link from "next/link";

interface DevelopmentsViewProps {
  developments: Development[];
  pageContent?: DevelopmentsPageContent | null;
}

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";

/** Máximo de slides en el hero (evita carruseles interminables). */
const HERO_MAX_SLIDES = 8;

/**
 * Hero según tamaño del portafolio:
 * - Pocos (≤3): todos, para que el carrusel tenga ritmo.
 * - Más: solo destacados; si no hay flag, los primeros del orden CMS.
 */
function pickHeroDevelopments(all: Development[]): Development[] {
  if (all.length === 0) return [];
  if (all.length <= 3) return all;

  const featured = all.filter((d) => d.featured);
  const pool = featured.length > 0 ? featured : all;
  return pool.slice(0, HERO_MAX_SLIDES);
}

/** Portafolio: destacados primero, luego el resto por orden de API. */
function sortPortfolio(all: Development[]): Development[] {
  return [...all].sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    if (af !== bf) return bf - af;
    return 0;
  });
}

export function DevelopmentsView({
  developments,
  pageContent,
}: DevelopmentsViewProps) {
  const heroDevelopments = pickHeroDevelopments(developments);
  const portfolio = sortPortfolio(developments);

  const heroImage = pageContent?.hero_image_url || FALLBACK_HERO;
  const eyebrow = pageContent?.hero_eyebrow || "Total Living · Desarrollos";
  const title =
    pageContent?.hero_title || "Nuevos desarrollos, futuras historias";
  const subtitle =
    pageContent?.hero_subtitle ||
    "Proyectos inmobiliarios de alto valor y arquitectura de autor en las zonas más exclusivas. Invierte desde la preventa y sé parte del siguiente ícono de la ciudad.";
  const emptyMessage =
    pageContent?.empty_message ||
    "Estamos preparando nuevos desarrollos para ti. Mientras tanto, un asesor puede orientarte sobre preventas.";
  const emptyCtaLabel = pageContent?.empty_cta_label || "Contactar asesor";
  const emptyCtaUrl = pageContent?.empty_cta_url || "/contacto";

  return (
    <main className="flex flex-1 flex-col bg-[#1a1a18]">
      {heroDevelopments.length > 0 ? (
        <FeaturedDevelopmentsCarousel developments={heroDevelopments} />
      ) : (
        <section
          data-tl-media-hero
          className="relative min-h-[min(60vh,32rem)] overflow-hidden sm:min-h-[min(82vh,760px)]"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/65" />

          <div
            className={cn(
              "relative z-10 mx-auto flex min-h-[inherit] max-w-6xl flex-col justify-end px-4 pb-10 sm:px-6 sm:pb-16",
              HERO_CONTENT_OFFSET,
            )}
          >
            <p className="font-outfit text-[10px] font-light uppercase tracking-[0.3em] text-tl-gold/90 sm:text-xs sm:tracking-[0.36em]">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-3xl font-cormorant text-4xl font-light leading-[0.95] text-tl-beige sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl font-outfit text-sm font-light leading-relaxed tracking-[0.02em] text-tl-beige/75 sm:text-base">
              {subtitle}
            </p>
          </div>
        </section>
      )}

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        {developments.length === 0 ? (
          <div className="rounded-2xl border border-tl-gold/25 bg-white/[0.03] px-6 py-16 text-center">
            <p className="mx-auto max-w-2xl font-outfit text-sm font-light leading-relaxed text-tl-beige/75 sm:text-base">
              {emptyMessage}
            </p>
            <Link
              href={emptyCtaUrl}
              className="mt-8 inline-flex min-h-12 items-center rounded-full border border-tl-gold px-6 py-3 font-outfit text-xs font-light uppercase tracking-[0.16em] text-tl-gold transition-colors active:bg-tl-gold active:text-tl-black sm:hover:bg-tl-gold sm:hover:text-tl-black"
            >
              {emptyCtaLabel}
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
              <div>
                <p className="font-outfit text-[10px] font-light uppercase tracking-[0.24em] text-tl-gold/90">
                  Portafolio
                </p>
                <h2 className="mt-1.5 font-cormorant text-3xl font-light text-tl-beige sm:text-4xl">
                  Explora todos los desarrollos
                </h2>
              </div>
              <p className="hidden font-outfit text-xs font-light text-tl-beige/45 sm:block">
                {portfolio.length}{" "}
                {portfolio.length === 1 ? "proyecto" : "proyectos"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:gap-8">
              {portfolio.map((development, index) => (
                <Reveal
                  key={development.id}
                  delay={Math.min(index, 5) * 0.04}
                >
                  <DevelopmentCard development={development} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
