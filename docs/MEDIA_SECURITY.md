# Media y uploads — seguridad (Fase 2)

Guía corta para producción. **No afecta** logos ni animaciones en `public/` ni SVG en componentes React.

## Uploads del panel

- Formatos: JPG, PNG, WebP, GIF, HEIC/AVIF (raster).
- **SVG prohibido** en cualquier upload del CMS/catálogo (XSS stored).
- Validación unificada: `totalliving_backend/image_uploads.py`.

## Servir archivos

| Entorno | Recomendación |
|---------|----------------|
| Local / túnel Next | `MEDIA_SERVE_FROM_DJANGO=True` (default). Django sirve `/media/` con path seguro. Next proxy: `/api/media/...` bloquea `..` y SVG. |
| Producción | Preferir **nginx** o **S3/R2** delante de `MEDIA_ROOT`. Pon `MEDIA_SERVE_FROM_DJANGO=False`. |

### Nginx (ejemplo)

```nginx
location /media/ {
  alias /var/www/totalliving/media/;
  add_header X-Content-Type-Options nosniff;
  # No ejecutar nada como script
  location ~* \.svg$ { return 403; }
}
```

### S3 / Cloudflare R2

1. Bucket privado o público solo lectura.
2. Django: `django-storages` + `DEFAULT_FILE_STORAGE` (cuando lo configures).
3. URLs firmadas o CDN; el proxy Next `/api/media` deja de ser necesario si las URLs absolutas apuntan al bucket.

## Path traversal

- Django: `serve_media` resuelve bajo `MEDIA_ROOT` con `Path.relative_to`.
- Next: `/api/media/[...path]` rechaza `..`, absolutos y `.svg`.

## Google Maps API key

Ver [GOOGLE_MAPS_FASE1.md](./GOOGLE_MAPS_FASE1.md) sección de restricciones HTTP referrer + limitar a Maps JavaScript API.
