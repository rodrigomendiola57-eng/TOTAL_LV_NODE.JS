import { AboutSection } from "@/components/layout/AboutSection";
import { AboutSilkBackdrop } from "@/components/about/AboutSilkBackdrop";
import { BrandLogoMarquee } from "@/components/layout/BrandLogoMarquee";
import { HeroSection } from "@/components/layout/HeroSection";
import { CityHighlightSection } from "@/components/layout/CityHighlightSection";
import { HomeExpertiseSection } from "@/components/layout/HomeExpertiseSection";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Reveal } from "@/components/ui/Reveal";
import { getFeaturedProperties } from "@/lib/api";
import { getPublicHomeContent } from "@/lib/api/home-content";
import {
  mapSlidesToAlbumImages,
  resolveCityImages,
  resolveHeroBackgroundUrl,
} from "@/lib/home-content-mappers";

export const revalidate = 30;

export default async function Home() {
  const [featuredProperties, homeContent] = await Promise.all([
    getFeaturedProperties({ revalidate: 30 }),
    getPublicHomeContent(),
  ]);

  const cityImages = resolveCityImages(homeContent);
  const albumImages = mapSlidesToAlbumImages(homeContent.about_slides);

  return (
    <main id="inicio" className="flex flex-1 flex-col overflow-x-clip bg-[#1a1a18]">
      <HeroSection
        eyebrow={homeContent.hero_eyebrow}
        title={homeContent.hero_title}
        subtitle={homeContent.hero_subtitle}
        backgroundUrl={resolveHeroBackgroundUrl(homeContent)}
      />

      {/* Mismo Silk que Nosotros: solo Quiénes somos → Propiedades destacadas */}
      <div className="relative isolate overflow-x-clip">
        <AboutSilkBackdrop />

        <div className="relative z-10 pt-16 sm:pt-24">
          <section id="nosotros" className="px-4 sm:px-6">
            <AboutSection
              eyebrow={homeContent.about_eyebrow}
              title={homeContent.about_title}
              body={homeContent.about_body}
              ctaLabel={homeContent.about_cta_label}
              ctaUrl={homeContent.about_cta_url}
              socialLabel={homeContent.about_social_label}
              albumImages={albumImages}
            />
          </section>

          <section
            id="propiedades"
            className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24"
          >
            <div id="propiedades-venta" />
            <div id="propiedades-renta" />
            <div id="propiedades-desarrollos" />
            <BrandLogoMarquee />
            <Reveal className="mb-8 sm:mb-10">
              <p className="font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-gold sm:text-xs sm:tracking-[0.25em]">
                {homeContent.featured_eyebrow}
              </p>
              <h2 className="text-fluid-h2 mt-3 font-cormorant font-light text-tl-beige">
                {homeContent.featured_title}
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {homeContent.featured_links.map((link) => (
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
                {homeContent.featured_empty_message}
              </p>
            )}
          </section>
        </div>
      </div>

      <CityHighlightSection
        ariaLabel={cityImages.ariaLabel}
        cityName={homeContent.city_highlight.city_name}
        title={homeContent.city_highlight.title}
        description={homeContent.city_highlight.description}
        imageDesktop={cityImages.desktop}
        imageMobile={cityImages.mobile}
      />

      <section id="asesoria" className="relative w-full overflow-hidden">
        <HomeExpertiseSection
          title={homeContent.expertise_title}
          subtitle={homeContent.expertise_subtitle}
          services={homeContent.expertise_services
            .filter((service) => service.is_active)
            .map((service) => ({
              id: service.slug,
              title: service.title,
              description: service.description,
              bullets: service.bullets,
              icon: service.icon,
            }))}
          pillars={homeContent.expertise_pillars
            .filter((pillar) => pillar.is_active)
            .map((pillar) => ({
              id: pillar.slug,
              title: pillar.title,
              description: pillar.description,
              bentoClass: pillar.bento_class,
            }))}
        />
      </section>
    </main>
  );
}
