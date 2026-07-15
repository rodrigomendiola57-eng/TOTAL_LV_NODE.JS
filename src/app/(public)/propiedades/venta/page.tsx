import { VENTA_CATALOG } from "@/components/properties/catalog-config";
import { PropertyListingView } from "@/components/properties/PropertyListingView";
import {
  catalogStateToApiParams,
  getFeaturedProperties,
  getPropertiesPage,
} from "@/lib/api";
import { parseCatalogSearchParams } from "@/lib/property-catalog-params";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getSiteOrigin } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Propiedades en Venta en Querétaro",
  description:
    "Explora casas, departamentos y terrenos en venta en Querétaro. Propiedades premium en Juriquilla, Zibatá, Campanario, Corregidora y más zonas exclusivas.",
  alternates: {
    canonical: "/propiedades/venta",
  },
};

interface PropiedadesVentaPageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    bedrooms?: string;
    search?: string;
    zone?: string;
    tipo?: string;
    vista?: string;
    precio_min?: string;
    precio_max?: string;
  }>;
}

export default async function PropiedadesVentaPage({
  searchParams,
}: PropiedadesVentaPageProps) {
  const catalogState = parseCatalogSearchParams(await searchParams);
  const apiParams = catalogStateToApiParams(catalogState, "Venta");
  const [pageData, featuredProperties] = await Promise.all([
    getPropertiesPage(apiParams),
    getFeaturedProperties({ operation_type: "Venta" }),
  ]);

  const { page: _page, ...mapApiParams } = apiParams;

  const origin = getSiteOrigin();
  const breadcrumbs = [
    { name: "Inicio", url: origin },
    { name: "Propiedades en Venta", url: `${origin}/propiedades/venta` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <PropertyListingView
        pageData={pageData}
        mapApiParams={mapApiParams}
        catalogState={catalogState}
        config={VENTA_CATALOG}
        basePath="/propiedades/venta"
        featuredProperties={featuredProperties}
      />
    </>
  );
}
