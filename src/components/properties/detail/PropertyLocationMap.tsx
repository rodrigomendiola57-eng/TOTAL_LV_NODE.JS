"use client";

import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import {
  getGoogleMapsMapId,
  GOOGLE_MAPS_DEFAULT_CENTER,
  GOOGLE_MAPS_DEFAULT_ZOOM,
  isGoogleMapsConfigured,
} from "@/lib/maps/google-maps-config";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { useMemo } from "react";

interface PropertyLocationMapProps {
  latitude?: number;
  longitude?: number;
  title: string;
}

const MAP_SHELL =
  "h-[min(52vw,17rem)] w-full overflow-hidden rounded-t-[1.35rem] sm:h-80 lg:h-[27rem]";

function GoldDotPin() {
  return (
    <span
      className="block h-[18px] w-[18px] -translate-y-1/2 rounded-full border-2 border-tl-beige bg-tl-gold shadow-[0_0_0_6px_rgba(214,181,133,0.22),0_8px_24px_rgba(0,0,0,0.45)]"
      aria-hidden
    />
  );
}

export function PropertyLocationMap({
  latitude,
  longitude,
  title,
}: PropertyLocationMapProps) {
  const position = useMemo(() => {
    if (
      latitude != null &&
      longitude != null &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    ) {
      return { lat: latitude, lng: longitude };
    }

    return {
      lat: GOOGLE_MAPS_DEFAULT_CENTER.lat,
      lng: GOOGLE_MAPS_DEFAULT_CENTER.lng,
    };
  }, [latitude, longitude]);

  const hasExactCoords =
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  if (!isGoogleMapsConfigured()) {
    return (
      <div
        className={`flex items-center justify-center bg-tl-olive/20 ${MAP_SHELL}`}
      >
        <p className="px-4 text-center font-outfit text-sm font-extralight text-tl-beige/70">
          Configura la API key de Google Maps en{" "}
          <code className="text-tl-gold">.env</code> y reinicia el servidor.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${MAP_SHELL}`}>
      <GoogleMapsProvider>
        <Map
          className="h-full w-full"
          defaultCenter={position}
          defaultZoom={hasExactCoords ? 16 : GOOGLE_MAPS_DEFAULT_ZOOM}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          clickableIcons
          mapId={getGoogleMapsMapId()}
          reuseMaps
        >
          <AdvancedMarker position={position} title={title}>
            <GoldDotPin />
          </AdvancedMarker>
        </Map>
      </GoogleMapsProvider>
      <div className="pointer-events-none absolute inset-0 rounded-t-[1.35rem] ring-1 ring-inset ring-white/5" />
    </div>
  );
}
