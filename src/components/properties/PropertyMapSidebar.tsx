"use client";

import { PropertyMapSidebarItem } from "@/components/properties/PropertyMapSidebarItem";
import type { Property } from "@/types/property";
import { MapPin, X } from "lucide-react";

import "./PropertyCatalogMap.css";

interface PropertyMapSidebarProps {
  properties: Property[];
  totalCount: number;
  selectedId: number | null;
  onSelect: (property: Property) => void;
  /** Props del cluster tocado (prioridad sobre el filtro por viewport). */
  clusterFocusProperties?: Property[] | null;
  onClearClusterFocus?: () => void;
}

export function PropertyMapSidebar({
  properties,
  totalCount,
  selectedId,
  onSelect,
  clusterFocusProperties = null,
  onClearClusterFocus,
}: PropertyMapSidebarProps) {
  const focusingCluster =
    clusterFocusProperties != null && clusterFocusProperties.length > 0;
  const listProperties = focusingCluster
    ? clusterFocusProperties
    : properties;
  const isFiltered = !focusingCluster && properties.length < totalCount;

  return (
    <aside className="flex h-full min-h-0 flex-col bg-tl-black/97 lg:w-[min(100%,22rem)] lg:shrink-0 lg:border-l lg:border-white/10 xl:w-[26rem]">
      <div className="shrink-0 lg:border-b lg:border-white/10">
        <div
          className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-tl-gold/30 lg:hidden"
          aria-hidden="true"
        />

        <div className="px-4 py-3.5 sm:py-4">
          <div className="flex items-start gap-2.5">
            <MapPin
              className="mt-0.5 h-4 w-4 shrink-0 text-tl-gold/80"
              strokeWidth={1.5}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-gold/85">
                  {focusingCluster
                    ? "Grupo seleccionado"
                    : "Propiedades en el mapa"}
                </p>
                {focusingCluster && onClearClusterFocus ? (
                  <button
                    type="button"
                    onClick={onClearClusterFocus}
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-tl-beige/50 transition-colors hover:bg-white/5 hover:text-tl-gold"
                    aria-label="Quitar filtro del grupo"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                ) : null}
              </div>
              <p className="mt-1 font-outfit text-sm font-light text-tl-beige">
                {focusingCluster ? (
                  <>
                    <span className="text-tl-gold">
                      {listProperties.length}
                    </span>
                    <span className="text-tl-beige/50">
                      {" "}
                      {listProperties.length === 1
                        ? "propiedad en este punto"
                        : "propiedades en este grupo"}
                    </span>
                  </>
                ) : isFiltered ? (
                  <>
                    <span className="text-tl-gold">{properties.length}</span>
                    <span className="text-tl-beige/50">
                      {" "}
                      de {totalCount} visibles
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-tl-gold">{properties.length}</span>
                    <span className="text-tl-beige/50">
                      {" "}
                      {properties.length === 1
                        ? "propiedad"
                        : "propiedades"}
                    </span>
                  </>
                )}
              </p>
              <p className="mt-1 font-outfit text-[11px] font-light leading-relaxed text-tl-beige/45">
                {focusingCluster
                  ? "Sigue tocando el círculo o acerca el zoom para ver cada propiedad. La X quita el filtro."
                  : isFiltered
                    ? "Toca un círculo con número: cada clic acerca un poco más esa zona."
                    : "Toca un círculo numerado para ir acercando poco a poco."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="tl-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pr-2 [-webkit-overflow-scrolling:touch] sm:py-3">
        {listProperties.length > 0 ? (
          <ul className="space-y-2">
            {listProperties.map((property) => (
              <li key={property.id}>
                <PropertyMapSidebarItem
                  property={property}
                  isSelected={property.id === selectedId}
                  onSelect={onSelect}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <p className="font-outfit text-sm font-light text-tl-beige/55">
              No hay propiedades en esta zona del mapa.
            </p>
            <p className="mt-2 font-outfit text-[11px] font-light text-tl-beige/35">
              Aleja el zoom o mueve el mapa.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
