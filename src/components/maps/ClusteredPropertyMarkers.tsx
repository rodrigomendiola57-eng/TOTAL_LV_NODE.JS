"use client";

import {
  createClusterContent,
  createPropertyPinContent,
  setPropertyPinActive,
} from "@/components/maps/property-map-pin-dom";
import {
  animateClusterDive,
  toLatLngLiteral,
  type MapCameraAnimation,
} from "@/lib/maps/animate-map-camera";
import type { Property } from "@/types/property";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
  type Cluster,
  type Renderer,
} from "@googlemaps/markerclusterer";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, type MutableRefObject } from "react";

/** Por encima de este zoom, SuperCluster suelta los pines individuales. */
const MAX_CLUSTER_ZOOM = 15;
const CLUSTER_RADIUS_PX = 58;
/** Cada clic en un círculo acerca como máximo estos niveles. */
const ZOOM_STEP = 2;
const SPIDERFY_MIN_ZOOM = 16;
const SPIDERFY_RADIUS_DEG = 0.00035;

type AdvMarker = google.maps.marker.AdvancedMarkerElement & {
  __tlId?: number;
  __tlBasePosition?: google.maps.LatLngLiteral;
};

const clusterRenderer: Renderer = {
  render(cluster: Cluster) {
    const { count, position } = cluster;
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: createClusterContent(count),
      zIndex: 1000 + count,
      gmpClickable: true,
    });
    marker.title = `${count} propiedades — toca para acercar`;
    return marker;
  },
};

function propertiesSignature(properties: Property[]): string {
  return properties
    .map(
      (p) =>
        `${p.id}:${p.latitude}:${p.longitude}:${p.price}:${p.currency}`,
    )
    .join("|");
}

function clusterCenter(cluster: Cluster): google.maps.LatLngLiteral | null {
  if (cluster.position) return toLatLngLiteral(cluster.position);
  if (cluster.bounds) {
    const c = cluster.bounds.getCenter();
    return { lat: c.lat(), lng: c.lng() };
  }
  return null;
}

/**
 * Calcula el zoom objetivo de UN clic:
 * - Siempre progresivo (como máximo +ZOOM_STEP).
 * - Si el grupo cabe con menos zoom, no sobrepasa ese nivel.
 * Una sola animación: sin fitBounds + corrección (eso causaba el rebote).
 */
function resolveClusterCamera(
  cluster: Cluster,
  map: google.maps.Map,
): { center: google.maps.LatLngLiteral; zoom: number } | null {
  const center = clusterCenter(cluster);
  if (!center) return null;

  const currentZoom = map.getZoom() ?? 5;
  const progressiveZoom = Math.min(currentZoom + ZOOM_STEP, 19);

  // Estimar zoom “ideal” para encuadrar el grupo sin animar fitBounds
  let idealZoom = progressiveZoom;
  if (cluster.bounds && map.getDiv()) {
    const mapDiv = map.getDiv();
    const width = Math.max(mapDiv.clientWidth - 96, 120);
    const height = Math.max(mapDiv.clientHeight - 96, 120);
    idealZoom = estimateZoomForBounds(cluster.bounds, width, height);
  }

  // Progresivo: no saltar más de +ZOOM_STEP, pero sí acercar al menos +1
  // si el ideal está más cerca (grupos chicos).
  let targetZoom = Math.min(progressiveZoom, Math.max(idealZoom, currentZoom + 1));

  // Si ideal ≈ zoom actual (círculo de 38 a escala país), forzar +ZOOM_STEP
  if (targetZoom <= currentZoom + 0.2) {
    targetZoom = progressiveZoom;
  }

  targetZoom = Math.min(Math.max(targetZoom, 3), 19);

  return { center, zoom: targetZoom };
}

/** Estimación de zoom para un LatLngBounds (Web Mercator). */
function estimateZoomForBounds(
  bounds: google.maps.LatLngBounds,
  mapWidthPx: number,
  mapHeightPx: number,
): number {
  const WORLD_DIM = 256;
  const ZOOM_MAX = 21;

  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  const latRad = (lat: number) => {
    const s = Math.sin((lat * Math.PI) / 180);
    return Math.log((1 + s) / (1 - s)) / 2;
  };

  const frac = (value: number, world: number) => value / world;

  let lngDiff = ne.lng() - sw.lng();
  if (lngDiff < 0) lngDiff += 360;

  const latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;
  const lngFraction = lngDiff / 360;

  const zoom = (mapPx: number, worldPx: number, fraction: number) => {
    if (fraction <= 0) return ZOOM_MAX;
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  };

  const latZoom = zoom(mapHeightPx, WORLD_DIM, Math.abs(latFraction));
  const lngZoom = zoom(mapWidthPx, WORLD_DIM, Math.abs(lngFraction));

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

function geoKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

function applySpiderfy(markers: Iterable<AdvMarker>, zoom: number) {
  const groups = new Map<string, AdvMarker[]>();

  for (const marker of markers) {
    const base = marker.__tlBasePosition;
    if (!base) continue;
    const key = geoKey(base.lat, base.lng);
    const list = groups.get(key) ?? [];
    list.push(marker);
    groups.set(key, list);
  }

  const shouldSpiderfy = zoom >= SPIDERFY_MIN_ZOOM;

  for (const group of groups.values()) {
    if (group.length === 1 || !shouldSpiderfy) {
      for (const marker of group) {
        if (marker.__tlBasePosition) {
          marker.position = marker.__tlBasePosition;
        }
      }
      continue;
    }

    const base = group[0].__tlBasePosition!;
    const n = group.length;
    for (let i = 0; i < n; i += 1) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const lat = base.lat + SPIDERFY_RADIUS_DEG * Math.cos(angle);
      const lng =
        base.lng +
        (SPIDERFY_RADIUS_DEG * Math.sin(angle)) /
          Math.max(Math.cos((base.lat * Math.PI) / 180), 0.2);
      group[i].position = { lat, lng };
    }
  }
}

interface ClusteredPropertyMarkersProps {
  properties: Property[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onClusterFocus: (propertyIds: number[]) => void;
  /** Evita que otros efectos muevan la cámara durante la animación. */
  cameraLockRef?: MutableRefObject<boolean>;
}

export function ClusteredPropertyMarkers({
  properties,
  selectedId,
  onSelect,
  onClusterFocus,
  cameraLockRef,
}: ClusteredPropertyMarkersProps) {
  const map = useMap();
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<Map<number, AdvMarker>>(new Map());
  const contentRef = useRef<Map<number, HTMLElement>>(new Map());
  const listenersRef = useRef<Map<number, google.maps.MapsEventListener>>(
    new Map(),
  );
  const signatureRef = useRef("");
  const animationRef = useRef<MapCameraAnimation | null>(null);
  const selectedIdRef = useRef(selectedId);
  const onSelectRef = useRef(onSelect);
  const onClusterFocusRef = useRef(onClusterFocus);

  selectedIdRef.current = selectedId;
  onSelectRef.current = onSelect;
  onClusterFocusRef.current = onClusterFocus;

  useEffect(() => {
    if (!map) return;

    const setLocked = (locked: boolean) => {
      if (cameraLockRef) cameraLockRef.current = locked;
    };

    const clusterer = new MarkerClusterer({
      map,
      markers: [],
      renderer: clusterRenderer,
      algorithm: new SuperClusterAlgorithm({
        radius: CLUSTER_RADIUS_PX,
        maxZoom: MAX_CLUSTER_ZOOM,
      }),
      onClusterClick: (_event, cluster, mapInstance) => {
        const markers = (cluster.markers as AdvMarker[]) ?? [];
        const ids = markers
          .map((marker) => marker.__tlId)
          .filter((id): id is number => typeof id === "number");

        if (ids.length > 0) {
          onClusterFocusRef.current(ids);
        }

        const camera = resolveClusterCamera(cluster, mapInstance);
        if (!camera) return;

        // Cancela animación anterior → una sola transición coherente
        animationRef.current?.cancel();
        setLocked(true);

        animationRef.current = animateClusterDive(mapInstance, camera);
        void animationRef.current.done.then(() => {
          setLocked(false);
          applySpiderfy(
            markersRef.current.values(),
            mapInstance.getZoom() ?? camera.zoom,
          );
        });
      },
    });

    clustererRef.current = clusterer;

    // Spiderfy solo al terminar el movimiento (no en cada frame del zoom)
    const idleListener = map.addListener("idle", () => {
      if (cameraLockRef?.current) return;
      applySpiderfy(markersRef.current.values(), map.getZoom() ?? 10);
    });

    return () => {
      animationRef.current?.cancel();
      setLocked(false);
      google.maps.event.removeListener(idleListener);
      for (const listener of listenersRef.current.values()) {
        google.maps.event.removeListener(listener);
      }
      listenersRef.current.clear();
      markersRef.current.clear();
      contentRef.current.clear();
      clusterer.clearMarkers();
      clusterer.setMap(null);
      clustererRef.current = null;
      signatureRef.current = "";
    };
  }, [map, cameraLockRef]);

  useEffect(() => {
    const clusterer = clustererRef.current;
    if (!map || !clusterer) return;

    const nextSignature = propertiesSignature(properties);
    if (nextSignature === signatureRef.current) return;
    signatureRef.current = nextSignature;

    for (const listener of listenersRef.current.values()) {
      google.maps.event.removeListener(listener);
    }
    listenersRef.current.clear();
    markersRef.current.clear();
    contentRef.current.clear();
    clusterer.clearMarkers();

    const nextMarkers: AdvMarker[] = [];

    for (const property of properties) {
      if (property.latitude == null || property.longitude == null) continue;

      const basePosition = {
        lat: property.latitude,
        lng: property.longitude,
      };
      const content = createPropertyPinContent(
        property,
        property.id === selectedIdRef.current,
      );
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: basePosition,
        content,
        title: property.title,
        gmpClickable: true,
        zIndex: property.id === selectedIdRef.current ? 20 : 1,
      }) as AdvMarker;

      marker.__tlId = property.id;
      marker.__tlBasePosition = basePosition;

      const listener = marker.addListener("gmp-click", () => {
        onSelectRef.current(property.id);
      });

      listenersRef.current.set(property.id, listener);
      markersRef.current.set(property.id, marker);
      contentRef.current.set(property.id, content);
      nextMarkers.push(marker);
    }

    if (nextMarkers.length > 0) {
      clusterer.addMarkers(nextMarkers);
    }

    applySpiderfy(markersRef.current.values(), map.getZoom() ?? 10);
  }, [map, properties]);

  useEffect(() => {
    for (const [id, content] of contentRef.current) {
      const active = id === selectedId;
      setPropertyPinActive(content, active);
      const marker = markersRef.current.get(id);
      if (marker) marker.zIndex = active ? 20 : 1;
    }
  }, [selectedId]);

  return null;
}
