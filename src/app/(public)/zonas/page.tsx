import { cookies } from "next/headers";
import { ZonesView } from "@/components/zones/ZonesView";
import { getZonesPageContent, listZoneCatalog } from "@/lib/api/zones";
import { getZoneCatalogFallback } from "@/lib/data/zones";
import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n/locales";
import type { ZonesPageContent } from "@/types/zones-page";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getSiteOrigin } from "@/lib/site-url";

export const revalidate = 30;

const FALLBACK_PAGE: ZonesPageContent = {
  id: 1,
  hero_eyebrow: "Total Living · Zonas",
  hero_title: "Ubicaciones estratégicas en Querétaro",
  hero_subtitle:
    "Explora las zonas principales donde concentramos nuestro portafolio. Cada región con su propio perfil de plusvalía, estilo de vida y oportunidades inmobiliarias.",
  hero_image_url:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  hero_image_external_url:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  scroll_hint: "Desplázate",
  is_published: true,
  updated_at: "",
};

export const metadata: Metadata = {
  title: "Zonas Inmobiliarias en Querétaro",
  description:
    "Explora las principales zonas de Querétaro: Campanario, Juriquilla, Zibatá, Centro y más. Encuentra propiedades en las ubicaciones más estratégicas.",
  alternates: {
    canonical: "/zonas",
  },
};

export default async function ZonasPage() {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  let zones = getZoneCatalogFallback();
  let page = FALLBACK_PAGE;

  try {
    const [fromApi, pageContent] = await Promise.all([
      listZoneCatalog({ revalidate: 30, lang: locale === "en" ? "en" : "es" }),
      getZonesPageContent({ revalidate: 30, lang: locale === "en" ? "en" : "es" }),
    ]);
    if (fromApi.length > 0) zones = fromApi;
    page = pageContent;
  } catch {
    /* fallback estático */
  }

  const origin = getSiteOrigin();
  const breadcrumbs = [
    { name: "Inicio", url: origin },
    { name: "Zonas", url: `${origin}/zonas` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ZonesView zones={zones} page={page} />
    </>
  );
}
