import { AboutSection } from "@/components/layout/AboutSection";
import { AboutSilkBackdrop } from "@/components/about/AboutSilkBackdrop";
import { BrandLogoMarquee } from "@/components/layout/BrandLogoMarquee";
import { HeroSection } from "@/components/layout/HeroSection";
import { CityHighlightSection } from "@/components/layout/CityHighlightSection";
import { HomeFeaturedPropertiesMobile } from "@/components/layout/HomeFeaturedPropertiesMobile";
import { HomeJournalSection } from "@/components/layout/HomeJournalSection";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Reveal } from "@/components/ui/Reveal";
import { cookies } from "next/headers";
import { getFeaturedProperties } from "@/lib/api";
import { getPublicHomeContent } from "@/lib/api/home-content";
import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n/locales";
import {
  mapSlidesToAlbumImages,
  resolveCityImages,
  resolveHeroBackgroundUrl,
} from "@/lib/home-content-mappers";
import { HOME_JOURNAL_ITEMS } from "@/lib/data/home-journal";
import type { HomeJournalItem } from "@/lib/data/home-journal";
import { HOME_HERO_VIDEO } from "@/lib/hero-media";
import { HOME_JOURNAL_MAX } from "@/types/home-content";

export const revalidate = 30;

function mapJournalPosts(
  posts: {
    id: number;
    kind: string;
    category: string;
    title: string;
    body: string;
    date_label: string;
    is_active: boolean;
    image_url: string | null;
    video_url: string | null;
    order?: number;
  }[],
): HomeJournalItem[] {
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80";

  const fromCms: HomeJournalItem[] = posts
    .filter((post) => post.is_active)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.id - b.id)
    .map((post) => {
      const kind = post.kind as HomeJournalItem["kind"];
      return {
        id: String(post.id),
        kind,
        category: post.category,
        title: post.title,
        body: post.body,
        dateLabel: post.date_label || undefined,
        imageUrl:
          post.image_url ??
          (kind === "image" ? FALLBACK_IMAGE : undefined),
        videoUrl:
          post.video_url ??
          (kind === "video" ? HOME_HERO_VIDEO : undefined),
      };
    });

  // CMS primero; si no hay posts, usa fallback ilustrativo.
  const merged = [...fromCms];
  if (merged.length === 0) {
    merged.push(...HOME_JOURNAL_ITEMS);
  }

  return merged.slice(0, HOME_JOURNAL_MAX);
}

export default async function Home() {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const [featuredProperties, homeContent] = await Promise.all([
    getFeaturedProperties({ revalidate: 30, operation_type: "Venta" }),
    getPublicHomeContent(locale),
  ]);

  const cityImages = resolveCityImages(homeContent);
  const albumImages = mapSlidesToAlbumImages(homeContent.about_slides);

  return (
    <main id="inicio" className="relative flex flex-1 flex-col overflow-x-clip bg-[#1a1a18]">
      <HeroSection
        eyebrow={homeContent.hero_eyebrow}
        title={homeContent.hero_title}
        subtitle={homeContent.hero_subtitle}
        backgroundUrl={resolveHeroBackgroundUrl(homeContent)}
        videoUrl={homeContent.hero_video_url}
      />

      {/* Mismo Silk que Nosotros — también en móvil */}
      <div className="relative">
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
            <Reveal className="mb-8 text-center sm:mb-10">
              <p className="font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-gold sm:text-xs sm:tracking-[0.25em]">
                {homeContent.featured_eyebrow}
              </p>
              <h2 className="text-fluid-h2 mt-3 font-cormorant font-light text-tl-beige">
                {homeContent.featured_title}
              </h2>
              <div className="mx-auto mt-6 flex max-w-md flex-col items-stretch gap-2.5 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center lg:gap-3">
                {homeContent.featured_links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-tl-gold/35 px-4 py-2.5 text-center font-outfit font-light text-[10px] uppercase tracking-[0.14em] text-tl-beige/80 transition-colors hover:border-tl-gold hover:text-tl-gold sm:min-h-0 sm:py-2"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </Reveal>

            {featuredProperties.length > 0 ? (
              <>
                <HomeFeaturedPropertiesMobile
                  properties={featuredProperties}
                />
                <div className="hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-3">
                  {featuredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </>
            ) : (
              <p className="mx-auto max-w-xl border border-tl-gold/30 bg-tl-black/50 p-6 text-center font-outfit font-light text-sm text-tl-beige/80">
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

      <HomeJournalSection
        title={locale === "en" ? "Total Living Updates" : "Novedades Total Living"}
        subtitle={locale === "en" ? "Stories, training and promotions" : "Historias, capacitaciones y promociones"}
        items={mapJournalPosts(homeContent.journal_posts ?? [])}
      />
    </main>
  );
}
