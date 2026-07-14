import { AsesoriaDotBackdrop } from "@/components/asesoria/AsesoriaDotBackdrop";
import { AsesoriaEnfoqueTimeline } from "@/components/asesoria/AsesoriaEnfoqueTimeline";
import { AsesoriaHero } from "@/components/asesoria/AsesoriaHero";
import { AsesoriaTabs } from "@/components/asesoria/AsesoriaTabs";
import type { AsesoriaPageContent } from "@/lib/data/asesoria";

interface AsesoriaViewProps {
  content: AsesoriaPageContent;
  /** Foto de portada (CMS o respaldo de Inicio). */
  heroBackgroundUrl?: string | null;
  /** Título de la sección de servicios (editable en CMS). */
  servicesTitle?: string;
}

/**
 * Shell del módulo Asesoría (Server Component).
 * Tabs, timeline de enfoque y formulario son client islands.
 */
export function AsesoriaView({
  content,
  heroBackgroundUrl,
  servicesTitle = "Servicios de Asesoría Inmobiliaria",
}: AsesoriaViewProps) {
  return (
    <main className="flex flex-1 flex-col bg-[#1a1a18]">
      <AsesoriaHero hero={content.hero} backgroundUrl={heroBackgroundUrl} />

      {/* DotField solo en Servicios (compra / venta / inversión) */}
      <AsesoriaDotBackdrop>
        <section
          id="servicios"
          aria-labelledby="asesoria-servicios-title"
          className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
        >
          <h2
            id="asesoria-servicios-title"
            className="text-center font-outfit text-[clamp(1.75rem,4.5vw,3.25rem)] font-extralight leading-[1.1] tracking-[0.02em] text-tl-beige"
          >
            {servicesTitle}
          </h2>
          <div className="mt-10 sm:mt-12">
            <AsesoriaTabs tabs={content.tabs} />
          </div>
        </section>
      </AsesoriaDotBackdrop>

      <AsesoriaEnfoqueTimeline pillars={content.pillars} />
    </main>
  );
}
