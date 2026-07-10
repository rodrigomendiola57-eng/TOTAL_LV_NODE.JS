/**
 * Estilos opcionales para Maps.
 *
 * El mapa de detalle usa el roadmap estándar de Google (sin styles)
 * para mostrar comercios/POIs y evitar la “cuadrícula” de predios
 * que aparece con estilos oscuros agresivos.
 *
 * Si más adelante quieren dark de marca sin perder POIs, crear un
 * Map ID en Cloud Console (Map Styles) y usar colorScheme / mapId.
 */

/** Oculta solo trazos de predios (por si se reutiliza un estilo custom). */
export const GOOGLE_MAPS_HIDE_PARCEL_GRID: google.maps.MapTypeStyle[] = [
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [{ visibility: "off" }],
  },
];

/**
 * Dark suave que mantiene comercios visibles.
 * No usar como default hasta validar en producción; preferir Map ID.
 */
export const GOOGLE_MAPS_DARK_STYLES: google.maps.MapTypeStyle[] = [
  ...GOOGLE_MAPS_HIDE_PARCEL_GRID,
  { elementType: "geometry", stylers: [{ color: "#1e1e1a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1e1e1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#b0a99a" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#D6B585" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#2a2a24" }],
  },
  {
    featureType: "poi.business",
    elementType: "labels.icon",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "poi.business",
    elementType: "labels.text.fill",
    stylers: [{ color: "#D6B585" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#243028" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38382e" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#c4bdb0" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#4A4E38" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#12141a" }],
  },
];
