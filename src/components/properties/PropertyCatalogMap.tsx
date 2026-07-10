"use client";

import "./PropertyCatalogMap.css";

import { ClusteredPropertyMarkers } from "@/components/maps/ClusteredPropertyMarkers";
import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import { PropertyMapControls } from "@/components/properties/PropertyMapControls";
import { PropertyMapPreviewCard } from "@/components/properties/PropertyMapPreviewCard";
import { PropertyMapSidebar } from "@/components/properties/PropertyMapSidebar";
import {
  getGoogleMapsMapId,
  GOOGLE_MAPS_MEXICO_BOUNDS,
  GOOGLE_MAPS_MEXICO_CENTER,
  GOOGLE_MAPS_MEXICO_ZOOM,
  isGoogleMapsConfigured,
} from "@/lib/maps/google-maps-config";
import { animateMapCamera } from "@/lib/maps/animate-map-camera";
import { hasCatalogMapCoordinates } from "@/lib/property-catalog";
import { cn } from "@/lib/utils";
import type { Property } from "@/types/property";
import {
  Map as GoogleMap,
  useMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";

interface PropertyCatalogMapProps {
  properties: Property[];
}

type LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;

function filterPropertiesInBounds(
  properties: Property[],
  bounds: google.maps.LatLngBounds | null,
): Property[] {
  if (!bounds) return properties;

  return properties.filter((property) => {
    if (property.latitude == null || property.longitude == null) return false;
    return bounds.contains({
      lat: property.latitude,
      lng: property.longitude,
    });
  });
}

function MapController({
  mapRef,
  positions,
  selectedProperty,
  onBoundsChange,
  clusterFocusActive,
  cameraLockRef,
}: {
  mapRef: MutableRefObject<google.maps.Map | null>;
  positions: google.maps.LatLngLiteral[];
  selectedProperty: Property | null;
  onBoundsChange: (bounds: google.maps.LatLngBounds) => void;
  clusterFocusActive: boolean;
  cameraLockRef: MutableRefObject<boolean>;
}) {
  const map = useMap();
  const hasFitted = useRef(false);
  const lastFlyId = useRef<number | null>(null);

  useEffect(() => {
    mapRef.current = map;
    return () => {
      mapRef.current = null;
    };
  }, [map, mapRef]);

  useEffect(() => {
    if (!map || hasFitted.current || positions.length === 0) return;
    hasFitted.current = true;

    if (positions.length === 1) {
      map.setCenter(positions[0]);
      map.setZoom(14);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    positions.forEach((pos) => bounds.extend(pos));
    // Una sola pasada inicial — sin correcciones posteriores
    map.fitBounds(bounds, 48);
  }, [map, positions]);

  useEffect(() => {
    if (!map) return;

    let timeoutId: number | null = null;

    const report = () => {
      if (cameraLockRef.current) return;
      if (timeoutId != null) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (cameraLockRef.current) return;
        const bounds = map.getBounds();
        if (bounds) onBoundsChange(bounds);
      }, 180);
    };

    const listener = map.addListener("idle", report);
    report();

    return () => {
      if (timeoutId != null) window.clearTimeout(timeoutId);
      google.maps.event.removeListener(listener);
    };
  }, [map, onBoundsChange, cameraLockRef]);

  useEffect(() => {
    if (
      !map ||
      !selectedProperty ||
      selectedProperty.id === lastFlyId.current ||
      selectedProperty.latitude == null ||
      selectedProperty.longitude == null ||
      clusterFocusActive ||
      cameraLockRef.current
    ) {
      return;
    }

    lastFlyId.current = selectedProperty.id;
    const targetZoom = Math.max(map.getZoom() ?? 10, 15);
    cameraLockRef.current = true;
    const animation = animateMapCamera(map, {
      center: {
        lat: selectedProperty.latitude,
        lng: selectedProperty.longitude,
      },
      zoom: targetZoom,
    });
    void animation.done.then(() => {
      cameraLockRef.current = false;
    });
  }, [map, selectedProperty, clusterFocusActive, cameraLockRef]);

  return null;
}

function CatalogGoogleMap({
  mappableProperties,
  positions,
  selectedId,
  selectedProperty,
  sidebarOpen,
  mapRef,
  cameraLockRef,
  onBoundsChange,
  onMarkerSelect,
  onDismissSelection,
  onToggleSidebar,
  onViewMexico,
  onSelectFromSidebar,
  visibleProperties,
  clusterFocusProperties,
  onClusterFocus,
  onClearClusterFocus,
}: {
  mappableProperties: Property[];
  positions: google.maps.LatLngLiteral[];
  selectedId: number | null;
  selectedProperty: Property | null;
  sidebarOpen: boolean;
  mapRef: MutableRefObject<google.maps.Map | null>;
  cameraLockRef: MutableRefObject<boolean>;
  onBoundsChange: (bounds: google.maps.LatLngBounds) => void;
  onMarkerSelect: (id: number) => void;
  onDismissSelection: () => void;
  onToggleSidebar: () => void;
  onViewMexico: () => void;
  onSelectFromSidebar: (property: Property) => void;
  visibleProperties: Property[];
  clusterFocusProperties: Property[] | null;
  onClusterFocus: (propertyIds: number[]) => void;
  onClearClusterFocus: () => void;
}) {
  const handleMapClick = useCallback(
    (_event: MapMouseEvent) => {
      onDismissSelection();
      onClearClusterFocus();
    },
    [onClearClusterFocus, onDismissSelection],
  );

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col",
        sidebarOpen
          ? "h-[min(92dvh,52rem)] grid grid-rows-[minmax(11rem,48dvh)_minmax(0,1fr)] lg:flex lg:h-[min(82vh,44rem)] lg:flex-row"
          : "h-[min(88dvh,50rem)] lg:h-[min(88vh,52rem)]",
      )}
    >
      <div
        className={cn(
          "relative min-h-0",
          sidebarOpen ? "min-h-0 lg:flex-1" : "min-h-0 flex-1",
        )}
      >
        <GoogleMap
          className="h-full min-h-[inherit] w-full"
          defaultCenter={GOOGLE_MAPS_MEXICO_CENTER}
          defaultZoom={GOOGLE_MAPS_MEXICO_ZOOM}
          mapId={getGoogleMapsMapId()}
          gestureHandling="greedy"
          disableDefaultUI
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          clickableIcons={false}
          reuseMaps
          onClick={handleMapClick}
        >
          <MapController
            mapRef={mapRef}
            positions={positions}
            selectedProperty={selectedProperty}
            onBoundsChange={onBoundsChange}
            clusterFocusActive={Boolean(clusterFocusProperties?.length)}
            cameraLockRef={cameraLockRef}
          />
          <ClusteredPropertyMarkers
            properties={mappableProperties}
            selectedId={selectedId}
            onSelect={onMarkerSelect}
            onClusterFocus={onClusterFocus}
            cameraLockRef={cameraLockRef}
          />
        </GoogleMap>

        <PropertyMapControls
          mapRef={mapRef}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={onToggleSidebar}
          onViewMexico={onViewMexico}
        />

        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />

        {sidebarOpen ? (
          <div className="pointer-events-none absolute left-3 top-3 z-[400] max-w-[70%] rounded-full border border-white/10 bg-tl-black/80 px-2.5 py-1 font-outfit text-[9px] font-light uppercase tracking-[0.12em] text-tl-beige/65 backdrop-blur-md sm:left-4 sm:top-4 sm:max-w-none sm:px-3 sm:py-1.5 sm:text-[10px]">
            Toca un círculo → zoom
          </div>
        ) : null}

        {selectedProperty ? (
          <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-[460] max-lg:pb-[max(0px,env(safe-area-inset-bottom,0px))] sm:bottom-5 sm:left-4 sm:right-auto sm:max-w-[18rem] sm:pb-0">
            <PropertyMapPreviewCard
              property={selectedProperty}
              onClose={onDismissSelection}
            />
          </div>
        ) : null}
      </div>

      {sidebarOpen ? (
        <div className="flex min-h-0 flex-col overflow-hidden border-t border-white/10 max-lg:rounded-t-[1.35rem] max-lg:bg-tl-black/98 max-lg:shadow-[0_-12px_40px_rgba(0,0,0,0.45)] lg:h-full lg:min-w-0 lg:max-w-[26rem] lg:shrink-0 lg:rounded-none lg:border-t-0 lg:shadow-none">
          <div className="min-h-0 flex-1">
            <PropertyMapSidebar
              properties={visibleProperties}
              totalCount={mappableProperties.length}
              selectedId={selectedId}
              onSelect={onSelectFromSidebar}
              clusterFocusProperties={clusterFocusProperties}
              onClearClusterFocus={onClearClusterFocus}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PropertyCatalogMap({ properties }: PropertyCatalogMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const cameraLockRef = useRef(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [clusterFocusIds, setClusterFocusIds] = useState<number[] | null>(null);

  const mappableProperties = useMemo(
    () => properties.filter(hasCatalogMapCoordinates),
    [properties],
  );

  const propertyById = useMemo(() => {
    const mapIds = new Map<number, Property>();
    for (const property of mappableProperties) {
      mapIds.set(property.id, property);
    }
    return mapIds;
  }, [mappableProperties]);

  const positions = useMemo(
    () =>
      mappableProperties.map((property) => ({
        lat: property.latitude!,
        lng: property.longitude!,
      })),
    [mappableProperties],
  );

  const visibleProperties = useMemo(
    () => filterPropertiesInBounds(mappableProperties, mapBounds),
    [mappableProperties, mapBounds],
  );

  const clusterFocusProperties = useMemo(() => {
    if (!clusterFocusIds?.length) return null;
    return clusterFocusIds
      .map((id) => propertyById.get(id))
      .filter((property): property is Property => Boolean(property));
  }, [clusterFocusIds, propertyById]);

  const selectedProperty = useMemo(
    () =>
      mappableProperties.find((property) => property.id === selectedId) ?? null,
    [mappableProperties, selectedId],
  );

  const handleBoundsChange = useCallback((bounds: google.maps.LatLngBounds) => {
    setMapBounds(bounds);
  }, []);

  const handleSelect = useCallback((property: Property) => {
    setSelectedId(property.id);
  }, []);

  const handleMarkerSelect = useCallback((id: number) => {
    setSelectedId(id);
    setClusterFocusIds(null);
  }, []);

  const handleClusterFocus = useCallback((propertyIds: number[]) => {
    setClusterFocusIds(propertyIds);
    setSelectedId(null);
    setSidebarOpen(true);
  }, []);

  const handleClearClusterFocus = useCallback(() => {
    setClusterFocusIds(null);
  }, []);

  const handleViewMexico = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    setClusterFocusIds(null);
    setSelectedId(null);
    cameraLockRef.current = true;
    map.fitBounds(GOOGLE_MAPS_MEXICO_BOUNDS as LatLngBoundsLiteral, 32);
    google.maps.event.addListenerOnce(map, "idle", () => {
      cameraLockRef.current = false;
    });
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((open) => !open);
    window.setTimeout(() => {
      if (mapRef.current) {
        google.maps.event.trigger(mapRef.current, "resize");
      }
    }, 320);
  }, []);

  const handleDismissSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  if (!isGoogleMapsConfigured()) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center rounded-2xl border border-tl-gold/20 bg-tl-black/50 px-6 py-16 text-center sm:min-h-[36rem]">
        <p className="max-w-md font-outfit font-light text-sm text-tl-beige/70">
          Configura{" "}
          <code className="text-tl-gold">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
          en <code className="text-tl-beige/90">.env</code> y reinicia el
          servidor.
        </p>
      </div>
    );
  }

  if (mappableProperties.length === 0) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center rounded-2xl border border-tl-gold/20 bg-tl-black/50 px-6 py-16 text-center sm:min-h-[36rem]">
        <p className="max-w-md font-outfit font-light text-sm text-tl-beige/70">
          No hay propiedades con ubicación en el mapa para los filtros
          seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-none border-white/10 bg-tl-black/40 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:rounded-2xl sm:border">
      <GoogleMapsProvider>
        <CatalogGoogleMap
          mappableProperties={mappableProperties}
          positions={positions}
          selectedId={selectedId}
          selectedProperty={selectedProperty}
          sidebarOpen={sidebarOpen}
          mapRef={mapRef}
          cameraLockRef={cameraLockRef}
          onBoundsChange={handleBoundsChange}
          onMarkerSelect={handleMarkerSelect}
          onDismissSelection={handleDismissSelection}
          onToggleSidebar={handleToggleSidebar}
          onViewMexico={handleViewMexico}
          onSelectFromSidebar={handleSelect}
          visibleProperties={visibleProperties}
          clusterFocusProperties={clusterFocusProperties}
          onClusterFocus={handleClusterFocus}
          onClearClusterFocus={handleClearClusterFocus}
        />
      </GoogleMapsProvider>
    </div>
  );
}
