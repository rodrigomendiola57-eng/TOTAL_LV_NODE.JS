# Media en S3 / Cloudflare R2 — Total Living

Django sube **todas** las `ImageField` / `FileField` (fotos de propiedades,
desarrollos, zonas, equipo, inicio, **PDF de ficha técnica**) al bucket cuando
`AWS_STORAGE_BUCKET_NAME` está definido. En local, sin esa variable, sigue
usando `media/` en disco.

Código: `totalliving_backend/settings.py` (`USE_S3` + `STORAGES`).

---

## Qué cubre

| Contenido | Campo típico | Prefijo en bucket |
|-----------|--------------|-------------------|
| Fotos propiedad | `PropertyPhoto.image` | `media/properties/...` |
| Ficha técnica PDF | `Property.technical_sheet` | `media/properties/technical-sheets/...` |
| Desarrollos / modelos | covers, gallery, plans | `media/developments/...` |
| Zonas | `Zone.image`, page hero | `media/zones/...` |
| Nosotros / agentes | fotos equipo | `media/agents/...` o about |
| Home CMS | slides / city images | `media/...` (site_content) |

Validaciones actuales (SVG bloqueado, magic `%PDF-`, tamaños) **siguen
aplicando** antes de subir.

---

## Opción A — Amazon S3 (pasos)

### 1. Crear bucket

1. AWS Console → **S3** → Create bucket (ej. `totalliving-media`).
2. Región (ej. `us-east-1`).
3. **Block Public Access:** puedes dejarlo ON y luego abrir solo lectura con
   política (recomendado), o usar CloudFront delante.

### 2. Política de lectura pública (objetos)

Sustituye `BUCKET` por el nombre real:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadMedia",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::BUCKET/media/*"]
    }
  ]
}
```

Object Ownership: **Bucket owner enforced** (sin ACL). Django usa
`AWS_DEFAULT_ACL = None`.

### 3. Usuario IAM

Crea un usuario/programa con política mínima:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::BUCKET",
        "arn:aws:s3:::BUCKET/*"
      ]
    }
  ]
}
```

Guarda `Access key` + `Secret`.

### 4. (Recomendado) CloudFront o dominio custom

- Distribución CloudFront con origen el bucket, o
- Dominio `media.tudominio.com` → CloudFront.

Luego en `.env`:

```env
AWS_S3_CUSTOM_DOMAIN=media.tudominio.com
MEDIA_URL=https://media.tudominio.com/media/
NEXT_PUBLIC_MEDIA_CDN_HOST=media.tudominio.com
```

### 5. Variables Django (`.env`)

```env
AWS_STORAGE_BUCKET_NAME=totalliving-media
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_REGION_NAME=us-east-1
AWS_LOCATION=media
AWS_QUERYSTRING_AUTH=False
# AWS_S3_CUSTOM_DOMAIN=media.tudominio.com
# MEDIA_URL=https://media.tudominio.com/media/
```

Reinicia Django. `MEDIA_SERVE_FROM_DJANGO` pasa a `False` solo.

### 6. Instalar dependencia

```powershell
.\venv\Scripts\python.exe -m pip install "django-storages[s3]>=1.14,<2"
```

(`requirements.txt` ya la incluye.)

### 7. Probar upload

1. Panel → subir foto de propiedad o PDF de ficha.
2. En la respuesta JSON, `cover_image_url` / `technical_sheet_url` deben ser
   `https://...amazonaws.com/media/...` o tu CDN.
3. Abrir la URL en el navegador → 200.

### 8. Migrar archivos ya existentes en disco

```powershell
# Con AWS CLI configurado
aws s3 sync .\media\ s3://totalliving-media/media/ --exclude "*.svg" --exclude "*.svgz"
```

Las filas en BD guardan rutas relativas (`properties/2026/07/foo.jpg`); el
storage S3 las resuelve bajo `AWS_LOCATION`.

---

## Opción B — Cloudflare R2 (pasos)

Misma API S3; suele ser más barata en egreso.

1. Cloudflare → **R2** → Create bucket.
2. **Manage R2 API Tokens** → Create API token (Object Read & Write).
3. Enable **Public access** (r2.dev) o custom domain.
4. En `.env`:

```env
AWS_STORAGE_BUCKET_NAME=totalliving-media
AWS_ACCESS_KEY_ID=<R2_ACCESS_KEY_ID>
AWS_SECRET_ACCESS_KEY=<R2_SECRET_ACCESS_KEY>
AWS_S3_REGION_NAME=auto
AWS_S3_ENDPOINT_URL=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
AWS_LOCATION=media
AWS_S3_CUSTOM_DOMAIN=pub-xxxxx.r2.dev
# o: media.tudominio.com
MEDIA_URL=https://pub-xxxxx.r2.dev/media/
NEXT_PUBLIC_MEDIA_CDN_HOST=pub-xxxxx.r2.dev
```

---

## Frontend (Next)

- `resolveMediaUrl` deja pasar URLs `https://` del bucket/CDN (no las reescribe).
- CSP ya permite `img-src https:`.
- `next.config.ts` acepta hosts S3/R2 + `NEXT_PUBLIC_MEDIA_CDN_HOST`.
- Con S3 activo, el proxy `/api/media` **deja de ser necesario** para archivos
  nuevos (siguen siendo útiles solo para legacy localhost).

---

## Checklist go-live media

- [ ] Bucket + política GetObject en `media/*`
- [ ] IAM / token R2 solo con permisos de ese bucket
- [ ] Variables en `.env` de staging/prod (nunca en git)
- [ ] `pip install -r requirements.txt`
- [ ] Upload de imagen + PDF OK
- [ ] `aws s3 sync` (o equivalente) de `media/` histórico
- [ ] `MEDIA_SERVE_FROM_DJANGO` efectivo = False
- [ ] CORS del bucket si el navegador sube directo (hoy sube vía Django; no hace falta CORS de upload)

---

## Apagar S3 (volver a disco)

Quita o vacía `AWS_STORAGE_BUCKET_NAME` y reinicia Django. Los objetos en el
bucket no se borran solos.
