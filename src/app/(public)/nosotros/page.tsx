import { cookies } from "next/headers";
import { AboutView } from "@/components/about/AboutView";
import { getAboutPageContent, listTeamMembersApi } from "@/lib/api/about";
import {
  getAboutPublicFallback,
  mapAboutPageToPublic,
} from "@/lib/about-public";
import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n/locales";
import type { Metadata } from "next";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Nosotros | Total Living",
  description:
    "Conoce a Total Living: filosofía, valores, misión, visión, equipo y organigrama. Estrategia real detrás de cada propiedad en Querétaro.",
};

export default async function NosotrosPage() {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  let content = getAboutPublicFallback();

  try {
    const [page, team] = await Promise.all([
      getAboutPageContent({ revalidate: 30, lang: locale === "en" ? "en" : "es" }),
      listTeamMembersApi({ revalidate: 30, lang: locale === "en" ? "en" : "es" }),
    ]);
    content = mapAboutPageToPublic(page, team, locale);
  } catch {
    /* fallback estático */
  }

  return <AboutView content={content} />;
}
