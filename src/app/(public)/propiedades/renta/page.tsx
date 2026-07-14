import { RENTA_CATALOG } from "@/components/properties/catalog-config";
import { PropertyListingView } from "@/components/properties/PropertyListingView";
import {
  catalogStateToApiParams,
  getFeaturedProperties,
  getPropertiesPage,
} from "@/lib/api";
import { parseCatalogSearchParams } from "@/lib/property-catalog-params";

interface PropiedadesRentaPageProps {
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

export default async function PropiedadesRentaPage({
  searchParams,
}: PropiedadesRentaPageProps) {
  const catalogState = parseCatalogSearchParams(await searchParams);
  const apiParams = catalogStateToApiParams(catalogState, "Renta");
  const [pageData, featuredProperties] = await Promise.all([
    getPropertiesPage(apiParams),
    getFeaturedProperties({ operation_type: "Renta" }),
  ]);

  const { page: _page, ...mapApiParams } = apiParams;

  return (
    <PropertyListingView
      pageData={pageData}
      mapApiParams={mapApiParams}
      catalogState={catalogState}
      config={RENTA_CATALOG}
      basePath="/propiedades/renta"
      featuredProperties={featuredProperties}
    />
  );
}
