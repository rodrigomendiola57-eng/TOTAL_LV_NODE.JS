"use client";

import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import {
  getGoogleMapsMapId,
  isGoogleMapsConfigured,
} from "@/lib/maps/google-maps-config";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { useMemo } from "react";

interface DevelopmentMapProps {
  latitude: number;
  longitude: number;
  title: string;
}

function GoldDotPin() {
  return (
    <span
      className="block h-5 w-5 -translate-y-1/2 rounded-full border-[3px] border-white bg-tl-gold shadow-[0_0_0_6px_rgba(214,181,133,0.28),0_8px_24px_rgba(0,0,0,0.35)]"
      aria-hidden
    />
  );
}

export function DevelopmentMap({
  latitude,
  longitude,
  title,
}: DevelopmentMapProps) {
  const position = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude],
  );

  if (!isGoogleMapsConfigured()) {
    return (
      <div className="flex h-[24rem] items-center justify-center bg-tl-beige/40 sm:h-[30rem] lg:h-[34rem]">
        <p className="font-outfit text-sm text-tl-black/50">
          Configura la API key de Google Maps en .env
        </p>
      </div>
    );
  }

  return (
    <div className="h-[24rem] w-full sm:h-[30rem] lg:h-[34rem]">
      <GoogleMapsProvider>
        <Map
          className="h-full w-full"
          defaultCenter={position}
          defaultZoom={15}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          mapId={getGoogleMapsMapId()}
          reuseMaps
        >
          <AdvancedMarker position={position} title={title}>
            <GoldDotPin />
          </AdvancedMarker>
        </Map>
      </GoogleMapsProvider>
    </div>
  );
}
