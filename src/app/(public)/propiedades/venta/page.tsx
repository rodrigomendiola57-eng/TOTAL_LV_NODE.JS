import { VENTA_CATALOG } from "@/components/properties/catalog-config";

import { PropertyListingView } from "@/components/properties/PropertyListingView";

import { catalogStateToApiParams, getFeaturedProperties, getPropertiesPage } from "@/lib/api";

import { parseCatalogSearchParams } from "@/lib/property-catalog-params";



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
    getFeaturedProperties(),
  ]);



  const { page: _page, ...mapApiParams } = apiParams;



  return (

    <PropertyListingView

      pageData={pageData}

      mapApiParams={mapApiParams}

      catalogState={catalogState}

      config={VENTA_CATALOG}

      basePath="/propiedades/venta"

      featuredProperties={featuredProperties}

    />

  );

}

