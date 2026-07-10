# Google Maps — Fase 1 (preparación)

Checklist para dejar listo Google Cloud **antes** de tocar la UI de mapas.
Los mapas actuales (Leaflet + CARTO) siguen funcionando hasta la Fase 2.

## Qué hay hoy en Total Living

| Superficie | Archivo principal | Necesidad Google Maps |
|------------|-------------------|------------------------|
| Catálogo (clusters + sidebar) | `PropertyCatalogMap.tsx` | Maps JavaScript API + Marker / AdvancedMarker + clustering |
| Detalle propiedad | `PropertyLocationMap.tsx` | Maps JavaScript API (1 marker) |
| Detalle desarrollo | `DevelopmentMap.tsx` | Maps JavaScript API (1 marker) |
| Picker dashboard | `LocationPicker.tsx` | Maps JavaScript API (click → lat/lng) |
| “Abrir en Google Maps” | links externos | Ya existe; no requiere API key |

Datos: PostGIS (`PointField`) + GeoJSON en `/api/properties/`. **No cambia en Fase 1.**

## Objetivo de esta fase

1. Proyecto en Google Cloud listo (billing + APIs).
2. API key creada y restringida.
3. Variable de entorno en el frontend.
4. Módulo de config en código que lea la key (sin cargar el SDK aún).

---

## Paso A — Proyecto en Google Cloud

1. Entra a [Google Cloud Console](https://console.cloud.google.com/).
2. **Recomendado:** crea un proyecto nuevo solo para Total Living  
   (ej. `total-living-maps`).  
   Puedes reutilizar el de tu otra app, pero es más limpio separar billing y restricciones de key.
3. Selecciona ese proyecto.
4. Activa **Facturación (Billing)** en el proyecto.  
   Maps no funciona sin billing vinculado (hay crédito mensual gratuito de Google Maps Platform).

## Paso B — APIs a habilitar

En **APIs y servicios → Biblioteca**, habilita:

| API | ¿Para qué? | ¿Fase? |
|-----|------------|--------|
| **Maps JavaScript API** | Mapas embebidos en el sitio | Fase 2 (obligatoria) |
| **Maps SDK for Android / iOS** | No | No hace falta (web) |
| Places API | Autocompletar direcciones | Fase 3+ (opcional) |
| Geocoding API | Dirección → coordenadas | Fase 3+ (opcional) |

**Solo necesitas Maps JavaScript API para la migración de los 4 mapas actuales.**

## Paso C — Crear la API key

1. **APIs y servicios → Credenciales → + Crear credenciales → Clave de API**.
2. Copia la key (la verás una sola vez completa en ese momento; luego puedes regenerarla).
3. **No la subas a Git.** Va en `.env.local` (ya está en `.gitignore`).

### Restricciones (hazlas ya, aunque sea en local)

**Restricción de aplicación → Sitios web (HTTP referrers):**

```
http://localhost:3000/*
http://127.0.0.1:3000/*
```

Cuando tengas dominio de producción, agrega:

```
https://tudominio.com/*
https://www.tudominio.com/*
```

**Restricción de API → Limitar clave:**

- Solo **Maps JavaScript API**

Así, si la key se filtra, no sirve para Places/Geocoding ni otros productos.

> Si usas la misma key que tu otra app, crea **otra key** para Total Living con referrers distintos. No compartas keys entre productos.

## Paso D — Variable de entorno en este repo

En este proyecto puedes ponerla en **`.env`** (el mismo archivo de Django) o en **`.env.local`**.
Next.js lee `NEXT_PUBLIC_*` de ambos; `.env.local` gana si existe en los dos.

1. Abre `.env` en la raíz y agrega (o completa):

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...tu_key...
```

2. Reinicia `npm run dev` (Next solo lee esas variables al arrancar).

### Verificar que el proyecto la ve

Con el servidor corriendo, la key debe existir vía `getGoogleMapsApiKey()` / `isGoogleMapsConfigured()` en `src/lib/maps/google-maps-config.ts`.

## Paso E — Criterio “Fase 1 lista”

Marca cuando cumplas todo:

- [ ] Proyecto Cloud creado/seleccionado (idealmente dedicado a Total Living)
- [ ] Billing activo
- [ ] Maps JavaScript API habilitada
- [ ] API key creada
- [ ] Restricción HTTP referrers (localhost + futuro dominio)
- [ ] Restricción de API → solo Maps JavaScript API
- [ ] `.env` (o `.env.local`) con `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] `npm run dev` reiniciado
- [ ] `isGoogleMapsConfigured()` devolvería `true` (key no vacía)

Cuando eso esté listo, avísame y pasamos a **Fase 2**: instalar el loader oficial (`@vis.gl/react-google-maps` o equivalente), un mapa piloto (detalle de propiedad) y luego catálogo con clusters.

## Qué NO hacemos en Fase 1

- No instalamos el SDK de Google Maps.
- No reemplazamos Leaflet todavía.
- No tocamos PostGIS ni el API de propiedades.
- No habilitamos Places/Geocoding hasta que el cliente lo pida.

## Costos (orientativo)

Google Maps Platform factura por uso (loads de mapa, etc.) con crédito mensual gratuito.  
Con un catálogo inmobiliario de tráfico moderado suele caber en el free tier al inicio; igual conviene revisar [Pricing](https://mapsplatform.google.com/pricing/) y poner **cuotas / presupuestos** en Cloud → Billing → Budgets.
