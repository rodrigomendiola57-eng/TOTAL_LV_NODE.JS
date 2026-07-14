import { ASESORIA_HERO_IMAGE } from "@/lib/hero-media";
import type { HomeAboutSlide, HomePageContent } from "@/types/home-content";

export interface AboutAlbumImage {
  src: string;
  srcMobile: string;
  alt: string;
}

/** Fallback del campo CMS; la portada visual de Inicio es video (ver HeroSection). */
const DEFAULT_HERO_BACKGROUND = ASESORIA_HERO_IMAGE;

const DEFAULT_ALBUM_IMAGES: AboutAlbumImage[] = [
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    srcMobile:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=70",
    alt: "Fachada residencial contemporánea",
  },
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    srcMobile:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=70",
    alt: "Propiedad premium con vista panorámica",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
    srcMobile:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=70",
    alt: "Interior de diseño minimalista",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
    srcMobile:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=70",
    alt: "Residencia moderna con jardín",
  },
];

export function resolveHeroBackgroundUrl(
  content: HomePageContent,
): string {
  return content.hero_background_url ?? DEFAULT_HERO_BACKGROUND;
}

export function mapSlidesToAlbumImages(
  slides: HomeAboutSlide[],
): AboutAlbumImage[] {
  if (!slides.length) return DEFAULT_ALBUM_IMAGES;

  const mapped = slides
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((slide) => {
      const src = slide.image_url ?? slide.external_url;
      const srcMobile =
        slide.image_mobile_url ?? slide.image_url ?? slide.external_url;
      if (!src) return null;
      return {
        src,
        srcMobile: srcMobile ?? src,
        alt: slide.alt_text,
      };
    })
    .filter((item): item is AboutAlbumImage => Boolean(item));

  return mapped.length > 0 ? mapped : DEFAULT_ALBUM_IMAGES;
}

export { DEFAULT_ALBUM_IMAGES };

export function resolveCityImages(content: HomePageContent): {
  desktop: string;
  mobile: string;
  ariaLabel: string;
} {
  const city = content.city_highlight;
  return {
    desktop:
      city.image_desktop_url ??
      city.external_desktop_url ??
      "/images/home/campanario-queretaro.png",
    mobile:
      city.image_mobile_url ??
      city.external_mobile_url ??
      "/images/home/queretaro-mobile.png",
    ariaLabel: city.aria_label,
  };
}
