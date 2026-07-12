import { ZonesView } from "@/components/zones/ZonesView";
import { getZonesPageContent, listZoneCatalog } from "@/lib/api/zones";
import { getZoneCatalogFallback } from "@/lib/data/zones";
import type { ZonesPageContent } from "@/types/zones-page";
import type { Metadata } from "next";

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
  title: "Zonas | Total Living",
  description:
    "Explora las principales zonas de Querétaro: Campanario, Juriquilla, Zibatá, Centro y más. Encuentra propiedades en las ubicaciones más estratégicas.",
};

export default async function ZonasPage() {
  let zones = getZoneCatalogFallback();
  let page = FALLBACK_PAGE;

  try {
    const [fromApi, pageContent] = await Promise.all([
      listZoneCatalog({ revalidate: 30 }),
      getZonesPageContent({ revalidate: 30 }),
    ]);
    if (fromApi.length > 0) zones = fromApi;
    page = pageContent;
  } catch {
    /* fallback estático */
  }

  return <ZonesView zones={zones} page={page} />;
}
