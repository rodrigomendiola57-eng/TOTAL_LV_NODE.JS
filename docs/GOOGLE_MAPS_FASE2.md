# Google Maps — Fase 2 (mapa piloto)

Migración del **detalle de propiedad** a Google Maps.
Catálogo, desarrollos y LocationPicker siguen en Leaflet hasta Fase 3.

## Qué se hizo

| Pieza | Archivo |
|-------|---------|
| Paquete | `@vis.gl/react-google-maps` |
| Provider | `src/components/maps/GoogleMapsProvider.tsx` |
| Estilo oscuro | `src/lib/maps/dark-map-styles.ts` |
| Mapa piloto | `src/components/properties/detail/PropertyLocationMap.tsx` |

## Cómo probar

1. `.env` con `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...`
2. Reinicia `npm run dev`
3. Abre una propiedad con coordenadas: `/propiedades/...`
4. El bloque de ubicación debe mostrar **Google Maps** (oscuro + pin dorado)

Si ves “This page can't load Google Maps correctly”:

- Maps JavaScript API no habilitada
- Key sin billing
- Referrers: agrega `http://localhost:3000/*`

## Siguiente (Fase 3)

1. Detalle de desarrollo  
2. LocationPicker del dashboard  
3. Catálogo con clusters (el más complejo)
