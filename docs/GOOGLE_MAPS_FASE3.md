# Google Maps — Fase 3 (catálogo + resto)

Migración completa de mapas Leaflet → Google Maps.

## Superficies

| Superficie | Estado |
|------------|--------|
| Detalle propiedad | Google Maps |
| Catálogo vista mapa (pines + clusters + sidebar) | Google Maps |
| Detalle desarrollo | Google Maps |
| LocationPicker (dashboard) | Google Maps |

## Comportamiento del catálogo

- Los **filtros / búsqueda** del listado siguen alimentando `useCatalogMapProperties` → solo se pintan propiedades que cumplen filtros **y** tienen coordenadas.
- La **sidebar** lista las que caen dentro del viewport actual del mapa.
- Pines con **precio**; clusters dorados al alejar.
- Controles: zoom, ver México, expandir/ocultar lista.

## Variables

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
# Opcional (si no, usa DEMO_MAP_ID para Advanced Markers)
# NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=...
```

## Producción

Crea un **Map ID** en Google Cloud → Map Management y ponlo en `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`.
`DEMO_MAP_ID` vale para desarrollo.
