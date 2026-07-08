import { AboutSection } from "@/components/layout/AboutSection";
import { BrandLogoMarquee } from "@/components/layout/BrandLogoMarquee";
import { HeroSection } from "@/components/layout/HeroSection";
import { ServicesSection } from "@/components/layout/ServicesSection";
import { ValueProposition } from "@/components/layout/ValueProposition";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Reveal } from "@/components/ui/Reveal";
import { getFeaturedProperties } from "@/lib/api";

export default async function Home() {
  const featuredProperties = await getFeaturedProperties();
  const zones = Array.from(
    new Set(featuredProperties.map((property) => property.zone)),
  ).slice(0, 6);

  return (
    <main id="inicio" className="flex flex-1 flex-col overflow-x-hidden bg-[#1a1a18]">
      <HeroSection />
      <section id="nosotros" className="px-4 sm:px-6">
        <AboutSection />
      </section>
      <section id="propiedades" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div id="propiedades-venta" />
        <div id="propiedades-renta" />
        <div id="propiedades-desarrollos" />
        <BrandLogoMarquee />
        <Reveal className="mb-8 sm:mb-10">
          <p className="font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-gold sm:text-xs sm:tracking-[0.25em]">
            Selección Total Living
          </p>
          <h2 className="text-fluid-h2 mt-3 font-cormorant font-light text-tl-beige">
            Propiedades Destacadas
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: "Propiedades en Venta", href: "/propiedades/venta" },
              { label: "Propiedades en Renta", href: "/propiedades/renta" },
              { label: "Desarrollos", href: "/propiedades/desarrollos" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border border-tl-gold/35 px-4 py-2 font-outfit font-light text-[10px] uppercase tracking-[0.14em] text-tl-beige/80 transition-colors hover:border-tl-gold hover:text-tl-gold"
              >
                {link.label}
              </a>
            ))}
          </div>
        </Reveal>

        {featuredProperties.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <p className="max-w-xl border border-tl-gold/30 bg-tl-black/50 p-6 font-outfit font-light text-sm text-tl-beige/80">
            Aún no hay propiedades destacadas publicadas. En breve mostraremos
            nuevas oportunidades premium.
          </p>
        )}
      </section>
      <section id="asesoria">
        <ServicesSection />
      </section>
      <section id="zonas" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        <Reveal className="mb-8">
          <p className="font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-gold sm:text-xs sm:tracking-[0.24em]">
            Zonas
          </p>
          <h2 className="text-fluid-h2 mt-3 font-cormorant font-light text-tl-beige">
            Ubicaciones Estratégicas
          </h2>
        </Reveal>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {(zones.length > 0 ? zones : ["Querétaro", "El Marqués", "Juriquilla"]).map(
            (zone) => (
              <span
                key={zone}
                className="rounded-full border border-tl-gold/40 bg-tl-black/40 px-3.5 py-2 font-outfit font-light text-[11px] uppercase tracking-[0.12em] text-tl-beige/90 sm:px-4 sm:text-xs sm:tracking-[0.14em]"
              >
                {zone}
              </span>
            ),
          )}
        </div>
      </section>
      <ValueProposition />
      <section id="contacto" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
        <Reveal className="rounded-2xl border border-tl-gold/25 bg-black/25 p-6 sm:rounded-3xl sm:p-10">
          <p className="font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-gold sm:text-xs sm:tracking-[0.24em]">
            Contacto
          </p>
          <h2 className="text-fluid-h2 mt-3 font-cormorant font-light text-tl-beige">
            Hablemos de tu próxima inversión
          </h2>
          <p className="mt-4 max-w-2xl font-outfit font-light text-sm text-tl-beige/80">
            Cuéntanos tu objetivo y te ayudamos a diseñar una estrategia
            inmobiliaria precisa, segura y rentable.
          </p>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex rounded-full border border-tl-gold px-5 py-3 font-outfit font-light text-[11px] uppercase tracking-[0.14em] text-tl-gold transition-all hover:bg-tl-gold hover:text-tl-black sm:px-6 sm:text-xs sm:tracking-[0.16em]"
          >
            Contactar ahora
          </a>
        </Reveal>
      </section>
    </main>
  );
}
