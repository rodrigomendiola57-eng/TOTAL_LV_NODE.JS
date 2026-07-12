import { AboutView } from "@/components/about/AboutView";
import { getAboutPageContent, listTeamMembersApi } from "@/lib/api/about";
import {
  getAboutPublicFallback,
  mapAboutPageToPublic,
} from "@/lib/about-public";
import type { Metadata } from "next";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Nosotros | Total Living",
  description:
    "Conoce a Total Living: filosofía, valores, misión, visión, equipo y organigrama. Estrategia real detrás de cada propiedad en Querétaro.",
};

export default async function NosotrosPage() {
  let content = getAboutPublicFallback();

  try {
    const [page, team] = await Promise.all([
      getAboutPageContent({ revalidate: 30 }),
      listTeamMembersApi({ revalidate: 30 }),
    ]);
    content = mapAboutPageToPublic(page, team);
  } catch {
    /* fallback estático */
  }

  return <AboutView content={content} />;
}
