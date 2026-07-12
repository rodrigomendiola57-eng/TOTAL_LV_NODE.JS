"use client";

import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import {
  getGoogleMapsMapId,
  isGoogleMapsConfigured,
} from "@/lib/maps/google-maps-config";
import { AdvancedMarker, Map, useMap } from "@vis.gl/react-google-maps";
import { LocateFixed, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

function useIsMobileMap() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

/**
 * Controles solo cuando el mapa ya está “activado” en móvil.
 * Evita pelear con el scroll de la página.
 */
function MobileMapControls({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();
  if (!map) return null;

  return (
    <div className="absolute bottom-3 right-3 z-[5] flex flex-col gap-2">
      <button
        type="button"
        aria-label="Acercar"
        onClick={() => map.setZoom((map.getZoom() ?? 15) + 1)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-tl-black/85 text-tl-beige backdrop-blur-md active:bg-tl-gold active:text-tl-black"
      >
        <Plus className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Alejar"
        onClick={() => map.setZoom((map.getZoom() ?? 15) - 1)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-tl-black/85 text-tl-beige backdrop-blur-md active:bg-tl-gold active:text-tl-black"
      >
        <Minus className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        aria-label="Centrar ubicación"
        onClick={() => {
          map.panTo({ lat: latitude, lng: longitude });
          map.setZoom(15);
        }}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-tl-black/85 text-tl-beige backdrop-blur-md active:bg-tl-gold active:text-tl-black"
      >
        <LocateFixed className="h-5 w-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function DevelopmentMap({
  latitude,
  longitude,
  title,
}: DevelopmentMapProps) {
  const isMobile = useIsMobileMap();
  const [mapActive, setMapActive] = useState(false);
  const position = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude],
  );

  useEffect(() => {
    if (!isMobile) setMapActive(false);
  }, [isMobile]);

  if (!isGoogleMapsConfigured()) {
    return (
      <div className="flex h-[28rem] items-center justify-center bg-tl-beige/40 sm:h-[30rem] lg:h-[34rem]">
        <p className="font-outfit text-sm text-tl-black/50">
          Configura la API key de Google Maps en .env
        </p>
      </div>
    );
  }

  if (isMobile === null) {
    return (
      <div className="h-[28rem] w-full animate-pulse bg-tl-beige/10 sm:h-[30rem] lg:h-[34rem]" />
    );
  }

  /**
   * Móvil:
   * - Bloqueado (`none`): el scroll de la página funciona; no hay pelea de touchend.
   * - Activo (`greedy`): el usuario eligió explorar; un dedo mueve el mapa.
   * Desktop: cooperative (scroll de página + mapa sin conflicto).
   */
  const gestureHandling = !isMobile
    ? "cooperative"
    : mapActive
      ? "greedy"
      : "none";

  return (
    <div className="relative h-[28rem] w-full sm:h-[30rem] lg:h-[34rem]">
      <GoogleMapsProvider>
        <Map
          className="h-full w-full"
          defaultCenter={position}
          defaultZoom={isMobile ? 14 : 15}
          gestureHandling={gestureHandling}
          disableDefaultUI
          zoomControl={false}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          clickableIcons={false}
          keyboardShortcuts={false}
          mapId={getGoogleMapsMapId()}
          reuseMaps
        >
          <AdvancedMarker position={position} title={title}>
            <GoldDotPin />
          </AdvancedMarker>
          {isMobile && mapActive ? (
            <MobileMapControls latitude={latitude} longitude={longitude} />
          ) : null}
        </Map>
      </GoogleMapsProvider>

      {isMobile && !mapActive ? (
        <button
          type="button"
          onClick={() => setMapActive(true)}
          className="absolute inset-0 z-10 flex items-end justify-center bg-gradient-to-t from-black/55 via-black/10 to-transparent pb-5"
          aria-label="Explorar mapa"
        >
          <span className="rounded-full border border-white/25 bg-tl-black/80 px-5 py-2.5 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-beige backdrop-blur-md">
            Explorar mapa
          </span>
        </button>
      ) : null}

      {isMobile && mapActive ? (
        <button
          type="button"
          onClick={() => setMapActive(false)}
          className="absolute left-3 top-3 z-10 rounded-full border border-white/25 bg-tl-black/85 px-4 py-2 font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-beige backdrop-blur-md"
        >
          Listo
        </button>
      ) : null}
    </div>
  );
}
