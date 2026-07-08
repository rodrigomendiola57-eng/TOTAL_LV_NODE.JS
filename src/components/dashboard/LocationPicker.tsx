"use client";

import { DEFAULT_MAP_CENTER } from "@/lib/data/property-options";
import { cn } from "@/lib/utils";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (coords: { latitude: number; longitude: number }) => void;
}

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: LocationPickerProps["onLocationChange"];
}) {
  useMapEvents({
    click(event) {
      onLocationChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

function RecenterMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom());
  }, [latitude, longitude, map]);

  return null;
}

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const position: [number, number] = [latitude, longitude];

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
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom
        className="h-80 w-full [&_.leaflet-control-attribution]:text-[9px]"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapClickHandler onLocationChange={onLocationChange} />
        <RecenterMap latitude={latitude} longitude={longitude} />
        <Marker position={position} icon={markerIcon} />
      </MapContainer>
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
