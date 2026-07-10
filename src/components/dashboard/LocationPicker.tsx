"use client";

import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import {
  getGoogleMapsMapId,
  isGoogleMapsConfigured,
} from "@/lib/maps/google-maps-config";
import { DEFAULT_MAP_CENTER } from "@/lib/data/property-options";
import { cn } from "@/lib/utils";
import {
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
} from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";
import { useEffect } from "react";

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (coords: { latitude: number; longitude: number }) => void;
}

function GoldPinMarker() {
  return (
    <span
      className="block h-9 w-7 -translate-x-1/2"
      style={{ marginLeft: "50%" }}
      aria-hidden
    >
      <svg viewBox="0 0 28 36" className="h-9 w-7 drop-shadow-lg">
        <path
          fill="#D6B585"
          stroke="#F2ECE0"
          strokeWidth="1.5"
          d="M14 1C7.4 1 2 6.4 2 13c0 8.4 12 21 12 21s12-12.6 12-21C26 6.4 20.6 1 14 1z"
        />
        <circle cx="14" cy="13" r="4.5" fill="#38382E" />
      </svg>
    </span>
  );
}

function RecenterMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo({ lat: latitude, lng: longitude });
  }, [map, latitude, longitude]);

  return null;
}

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const position = { lat: latitude, lng: longitude };

  if (!isGoogleMapsConfigured()) {
    return (
      <div className="rounded-2xl border border-tl-gold/20 bg-[#0a0a0a] px-4 py-8 text-center">
        <p className="font-outfit text-sm text-tl-beige/60">
          Configura{" "}
          <code className="text-tl-gold">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
          en .env para el picker de ubicación.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-tl-gold/20 bg-[#0a0a0a]">
      <div className="flex items-center justify-between gap-3 border-b border-tl-gold/15 px-4 py-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-tl-gold" strokeWidth={1.5} />
          <p className="font-outfit font-light text-xs uppercase tracking-[0.14em] text-tl-beige/70">
            Ubicación en mapa
          </p>
        </div>
        <div className="flex gap-2">
          <CoordPill label="Lat" value={latitude.toFixed(5)} />
          <CoordPill label="Lng" value={longitude.toFixed(5)} />
        </div>
      </div>

      <div className="h-80 w-full">
        <GoogleMapsProvider>
          <GoogleMap
            className="h-full w-full"
            defaultCenter={position}
            defaultZoom={13}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={false}
            mapId={getGoogleMapsMapId()}
            reuseMaps
            onClick={(event) => {
              const latLng = event.detail.latLng;
              if (!latLng) return;
              onLocationChange({
                latitude: latLng.lat,
                longitude: latLng.lng,
              });
            }}
          >
            <RecenterMap latitude={latitude} longitude={longitude} />
            <AdvancedMarker position={position}>
              <GoldPinMarker />
            </AdvancedMarker>
          </GoogleMap>
        </GoogleMapsProvider>
      </div>

      <p className="border-t border-tl-gold/15 px-4 py-3 font-outfit font-light text-xs text-tl-beige/50">
        Haz clic en el mapa para marcar la propiedad. También puedes ajustar las
        coordenadas manualmente abajo.
      </p>
    </div>
  );
}

function CoordPill({ label, value }: { label: string; value: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-tl-gold/20 bg-tl-black/60 px-2.5 py-1",
        "font-outfit font-light text-[10px] text-tl-beige/60",
      )}
    >
      <span className="text-tl-gold/80">{label}</span> {value}
    </span>
  );
}

export function useDefaultMapCenter() {
  return DEFAULT_MAP_CENTER;
}
