import { AsesoriaView } from "@/components/asesoria/AsesoriaView";
import { getPublicAsesoriaPageContent } from "@/lib/api/asesoria";
import { getPublicHomeContent } from "@/lib/api/home-content";
import { resolveHeroBackgroundUrl } from "@/lib/home-content-mappers";
import type { Metadata } from "next";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n/locales";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getSiteOrigin } from "@/lib/site-url";

/** Revalida con el CMS de asesoría (y fallback visual de Inicio). */
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Asesoría inmobiliaria | Total Living",
  description:
    "Asesoría inmobiliaria estratégica en Querétaro: compra, venta e inversión con acompañamiento premium Total Living.",
  alternates: {
    canonical: "/asesoria",
  },
};

export default async function AsesoriaPage() {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const [{ content, servicesTitle, heroImageUrl }, homeContent] =
    await Promise.all([
      getPublicAsesoriaPageContent(locale),
      getPublicHomeContent(locale),
    ]);

  const homeHero = resolveHeroBackgroundUrl(homeContent);
  const heroBackgroundUrl = heroImageUrl || homeHero;

  const origin = getSiteOrigin();
  const breadcrumbs = [
    { name: "Inicio", url: origin },
    { name: "Asesoría", url: `${origin}/asesoria` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <AsesoriaView
        content={content}
        servicesTitle={servicesTitle}
        heroBackgroundUrl={heroBackgroundUrl}
      />
    </>
  );
}
