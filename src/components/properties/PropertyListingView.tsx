"use client";



import type { PropertyCatalogConfig } from "@/components/properties/catalog-config";
import { FeaturedCatalogCarousel } from "@/components/properties/FeaturedCatalogCarousel";
import { PropertyCatalogFilters } from "@/components/properties/PropertyCatalogFilters";
import { AboutSilkBackdrop } from "@/components/about/AboutSilkBackdrop";

import { PropertyPagination } from "@/components/properties/PropertyPagination";

import { PropertyCard } from "@/components/ui/PropertyCard";

import { Reveal } from "@/components/ui/Reveal";

import { useCatalogMapProperties } from "@/hooks/useCatalogMapProperties";

import type { GetPropertiesPageParams, PropertiesPageResult } from "@/lib/api";

import {

  buildCatalogHref,

  type CatalogQueryState,

} from "@/lib/property-catalog-params";

import type { Property } from "@/types/property";

import type { CatalogViewMode } from "@/lib/property-catalog";
import { HERO_CONTENT_OFFSET } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

import dynamic from "next/dynamic";

import Link from "next/link";

import { useCallback, useEffect, useState } from "react";



const PropertyCatalogMap = dynamic(

  () =>

    import("@/components/properties/PropertyCatalogMap").then(

      (module) => module.PropertyCatalogMap,

    ),

  {

    ssr: false,

    loading: () => (

      <div className="flex min-h-[50dvh] items-center justify-center rounded-none border border-tl-gold/20 bg-[#1a1a18]/80 sm:min-h-[40rem] sm:rounded-2xl">

        <p className="font-outfit font-light text-sm text-tl-beige/55">

          Preparando mapa...

        </p>

      </div>

    ),

  },

);



interface PropertyListingViewProps {

  pageData: PropertiesPageResult;

  mapApiParams: Omit<GetPropertiesPageParams, "page">;

  catalogState: CatalogQueryState;

  config: PropertyCatalogConfig;

  basePath: string;

  featuredProperties?: Property[];

}



export function PropertyListingView({

  pageData,

  mapApiParams,

  catalogState,

  config,

  basePath,

  featuredProperties,

}: PropertyListingViewProps) {

  const { properties, count, totalPages } = pageData;

  const hasFeaturedHero = Boolean(featuredProperties && featuredProperties.length > 0);

  const [viewMode, setViewMode] = useState<CatalogViewMode>(catalogState.vista);



  useEffect(() => {

    setViewMode(catalogState.vista);

  }, [catalogState.vista]);



  const isMapView = viewMode === "mapa";

  const shouldPrefetchMap = count > 0;



  const {

    properties: mapProperties,

    isLoading: mapLoading,

    error: mapError,

  } = useCatalogMapProperties(mapApiParams, { prefetch: shouldPrefetchMap });



  const handleViewChange = useCallback(

    (vista: CatalogViewMode) => {

      setViewMode(vista);

      const href = buildCatalogHref(basePath, {

        ...catalogState,

        vista,

        page: vista === "mapa" ? 1 : catalogState.page,

      });

      window.history.replaceState(null, "", href);

    },

    [basePath, catalogState],

  );



  return (

    <main className="flex flex-1 flex-col bg-[#1a1a18]">

      {hasFeaturedHero ? (
        <FeaturedCatalogCarousel properties={featuredProperties!} />
      ) : (
        <section
          data-tl-media-hero
          className="relative min-h-[min(52vh,28rem)] overflow-hidden sm:min-h-[min(78vh,720px)]"
        >

          <div

            className="absolute inset-0 bg-cover bg-center"

            style={{ backgroundImage: `url('${config.heroImage}')` }}

          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/65" />



          <div

            className={cn(

              "relative z-10 mx-auto flex min-h-[inherit] max-w-6xl items-end px-4 pb-10 sm:px-6 sm:pb-20",

              HERO_CONTENT_OFFSET,

            )}

          >

            <div className="max-w-3xl">

              <p className="font-outfit text-[10px] font-light uppercase tracking-[0.28em] text-tl-gold/90 sm:text-xs sm:tracking-[0.32em]">

                Total Living

              </p>

              <h1 className="mt-2 font-outfit text-3xl font-extralight tracking-[0.02em] text-tl-beige sm:mt-3 sm:text-5xl lg:text-6xl">

                {config.title}

              </h1>

              <p className="mt-3 max-w-2xl font-outfit text-sm font-light leading-relaxed tracking-[0.02em] text-tl-beige/75 sm:mt-4 sm:text-base">

                {config.subtitle}

              </p>

            </div>

          </div>

        </section>
      )}

      <div className="relative w-full">
        <AboutSilkBackdrop />
        <div className="relative z-10 w-full">
          {hasFeaturedHero ? (
            <section className="mx-auto w-full max-w-6xl px-4 py-8 text-center sm:px-6 sm:py-12 lg:py-14">
              <p className="font-outfit text-[10px] font-light uppercase tracking-[0.28em] text-tl-gold/90 sm:text-xs sm:tracking-[0.32em]">
                Total Living
              </p>
              <h1 className="mt-2 font-outfit text-3xl font-extralight tracking-[0.02em] text-tl-beige sm:mt-3 sm:text-5xl lg:text-6xl">
                {config.title}
              </h1>
              <p className="mx-auto mt-3 max-w-2xl font-outfit text-sm font-light leading-relaxed tracking-[0.02em] text-tl-beige/75 sm:mt-4 sm:text-base">
                {config.subtitle}
              </p>
            </section>
          ) : null}

          <PropertyCatalogFilters

          catalogState={catalogState}

          basePath={basePath}

          count={count}

          operationLabel={config.resultsLabel}

          viewMode={viewMode}

          onViewChange={handleViewChange}

        />



      <section

        id="catalog-content"

        className={cn(

          "scroll-mt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:scroll-mt-20",

          isMapView

            ? "w-full px-0 py-3 sm:px-4 sm:py-8 lg:px-6"

            : "mx-auto w-full max-w-6xl px-3 py-8 sm:px-6 sm:py-16",

        )}

      >

        {count > 0 ? (

          isMapView ? (

            mapLoading && mapProperties.length === 0 ? (

              <div className="flex min-h-[50dvh] items-center justify-center rounded-none border border-tl-gold/20 bg-[#1a1a18]/80 sm:min-h-[40rem] sm:rounded-2xl">

                <p className="font-outfit font-light text-sm text-tl-beige/55">

                  Cargando propiedades en el mapa...

                </p>

              </div>

            ) : mapError ? (

              <div className="rounded-2xl border border-tl-gold/20 bg-[#1a1a18]/80 px-6 py-16 text-center">

                <p className="font-outfit font-light text-sm text-tl-beige/70">

                  No se pudo cargar el mapa. Intenta de nuevo en un momento.

                </p>

              </div>

            ) : (

              <PropertyCatalogMap properties={mapProperties} />

            )

          ) : properties.length > 0 ? (

            <>

              <div

                id="catalog-grid"

                className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3"

              >

                {properties.map((property, index) => (

                  <Reveal key={property.id} delay={index * 0.05}>

                    <PropertyCard property={property} />

                  </Reveal>

                ))}

              </div>



              <PropertyPagination

                basePath={basePath}

                catalogState={catalogState}

                totalPages={totalPages}

                totalCount={count}

                pageSize={pageData.pageSize}

              />

            </>

          ) : (

            <div className="rounded-2xl border border-tl-gold/20 bg-tl-black/50 px-6 py-16 text-center">

              <p className="font-outfit font-light text-sm text-tl-beige/70">

                No hay propiedades en esta página. Intenta regresar a la primera página.

              </p>

            </div>

          )

        ) : (

          <div className="rounded-2xl border border-tl-gold/25 bg-white/[0.03] px-5 py-16 text-center sm:px-10 sm:py-20">

            <p className="mx-auto max-w-2xl font-outfit font-light text-sm leading-relaxed text-tl-beige/75 sm:text-base">

              {config.emptyMessage}

            </p>

            <Link

              href={config.contactHref}

              className="mt-8 inline-flex min-h-12 items-center rounded-full border border-tl-gold px-6 py-3 font-outfit font-light text-xs uppercase tracking-[0.16em] text-tl-gold transition-colors active:bg-tl-gold active:text-tl-black sm:hover:bg-tl-gold sm:hover:text-tl-black"

            >

              Contactar asesor

            </Link>

          </div>

        )}

      </section>
        </div>
      </div>
    </main>

  );

}


