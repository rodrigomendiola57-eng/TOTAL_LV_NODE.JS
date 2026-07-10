"use client";

import { getGoogleMapsApiKey } from "@/lib/maps/google-maps-config";
import { APIProvider } from "@vis.gl/react-google-maps";
import type { ReactNode } from "react";

interface GoogleMapsProviderProps {
  children: ReactNode;
}

/**
 * Carga Maps JavaScript API (+ librería marker para Advanced Markers).
 */
export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    return (
      <div className="flex h-full min-h-[12rem] items-center justify-center bg-tl-olive/20 px-4 text-center">
        <p className="font-outfit text-sm font-extralight text-tl-beige/70">
          Falta <span className="text-tl-gold">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span>{" "}
          en <code className="text-tl-beige/90">.env</code>. Reinicia{" "}
          <code className="text-tl-beige/90">npm run dev</code> tras agregarla.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} language="es" region="MX" libraries={["marker"]}>
      {children}
    </APIProvider>
  );
}
