# TOTAL_LV_NODE.JS

Portal inmobiliario **Total Living** — Next.js + Django.

## Desarrollo local

**Terminal 1 — Backend Django (puerto 8000)**

```powershell
cd C:\TOTAL_LV_NODE.JS
.\venv\Scripts\python.exe manage.py runserver
```

**Terminal 2 — Frontend Next.js (puerto 3000)**

```powershell
cd C:\TOTAL_LV_NODE.JS
npm.cmd run dev
```

Abre: [http://localhost:3000](http://localhost:3000)

## Clonar / abrir en otra PC

1. Clona el repo y entra a la carpeta.
2. Copia `.env.example` → `.env` y completa claves (DB Postgres/PostGIS, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, etc.). **No** se sube `.env` a Git.
3. Frontend: `npm install` → `npm run dev`
4. Backend: crea `venv`, instala requirements, luego:

```powershell
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py seed_home_content
.\venv\Scripts\python.exe manage.py seed_developments_page
.\venv\Scripts\python.exe manage.py seed_developments
.\venv\Scripts\python.exe manage.py runserver
```

La base de datos **no** va en Git (Postgres local). Las migraciones + seeds recrean el esquema y los desarrollos de ejemplo.

**Videos del hero** (`public/videos/*.mp4`): pesan >100 MB y GitHub no los acepta. Cópialos manualmente desde esta PC (USB/Drive) a `public/videos/` en la otra máquina.

## URLs locales

Con Django y Next.js en marcha (`runserver` + `npm run dev`):

| Módulo | URL |
|--------|-----|
| **Sitio público** | [http://localhost:3000](http://localhost:3000) |
| **Login panel** | [http://localhost:3000/login](http://localhost:3000/login) |
| **Dashboard (panel Total Living)** | [http://localhost:3000/dashboard](http://localhost:3000/dashboard) |
| **Propiedades (dashboard)** | [http://localhost:3000/dashboard/propiedades](http://localhost:3000/dashboard/propiedades) |
| **Desarrollos (dashboard)** | [http://localhost:3000/dashboard/desarrollos](http://localhost:3000/dashboard/desarrollos) |
| **CRM (dashboard)** | [http://localhost:3000/dashboard/crm](http://localhost:3000/dashboard/crm) |
| **Configuración (dashboard)** | [http://localhost:3000/dashboard/configuracion](http://localhost:3000/dashboard/configuracion) |
| **Zonas (sitio público)** | [http://localhost:3000/zonas](http://localhost:3000/zonas) |
| **Nosotros (sitio público)** | [http://localhost:3000/nosotros](http://localhost:3000/nosotros) |
| **Admin Django** | [http://localhost:8000/admin/](http://localhost:8000/admin/) |
| **API REST** | [http://localhost:8000/api/](http://localhost:8000/api/) |

### Admin Django

El panel nativo de Django (propiedades, amenidades, fotos, sync EasyBroker) está en:

**http://localhost:8000/admin/**

Si es la primera vez, crea un usuario administrador:

```powershell
cd C:\TOTAL_LV_NODE.JS
.\venv\Scripts\python.exe manage.py createsuperuser
```

Luego inicia sesión en `/admin/` con ese usuario y contraseña.

### Dashboard Next.js

El panel operativo de Total Living (catálogo, formularios, CRM) vive en Next.js, no en Django:

**http://localhost:3000/dashboard**

Requiere login en `/login`. Los usuarios se crean en **Django Admin → Users**:

1. Crea el usuario (usuario + contraseña).
2. Marca **Staff status** (obligatorio para entrar al panel).
3. Opcional: **Superuser** si también debe usar `/admin/`.

Con ese usuario/contraseña entra en [http://localhost:3000/login](http://localhost:3000/login). El sitio público sigue sin login.

### CRM web

Tras actualizar el backend, aplica migraciones:

```powershell
.\venv\Scripts\python.exe manage.py migrate crm
```

El formulario de contacto en `/contacto` crea leads con canal **Web** y aparecen en `/dashboard/crm`. Desde el CRM puedes filtrar por estatus, buscar por nombre/correo/teléfono, cambiar estatus y agregar notas internas por lead.

## Compartir propiedades (WhatsApp / redes / correo)

Las fichas generan una **vista previa con foto y marca Total Living** (Open Graph). El dominio de producción es:

```env
NEXT_PUBLIC_SITE_URL=https://www.totalliving.mx
```

Hoy [totalliving.mx](https://www.totalliving.mx/) sigue en la V1; las previews con el diseño nuevo solo se verán cuando este portal esté publicado en ese dominio. En local, WhatsApp/Facebook no pueden scrapear `localhost`.

## Zonas (catálogo CMS)

Backend + dashboard para el módulo público `/zonas`:

```powershell
.\venv\Scripts\python.exe manage.py migrate zones
.\venv\Scripts\python.exe manage.py seed_zones
```

- API: `GET/POST /api/zones/`, `GET/PATCH/DELETE /api/zones/{slug}/`
- Panel: `/dashboard/zonas` → catálogo
- Si la API no responde, el front usa el fallback estático.

## Ver en el celular

Diagnóstico rápido:

```powershell
.\scripts\tunnel-mobile.ps1
```

### Opción A — WiFi (más fácil si ngrok muestra otra página)

Si tu URL de ngrok abre **Mendifly** u otro sitio, usa la red local:

```powershell
# Terminal 1 — Django (accesible en la red)
.\venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000

# Terminal 2 — Next.js (escucha en todas las interfaces)
npm.cmd run dev:tunnel
```

En `.env`, agrega la IP de tu PC (la ves con `ipconfig`, ej. `192.168.10.124`):

```env
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.10.124
```

En `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://192.168.10.124:8000/api
```

En el celular (misma WiFi): **http://192.168.10.124:3000**

### Opción B — ngrok

Next.js bloquea por defecto recursos `/_next/*` desde dominios externos. Ya está configurado `allowedDevOrigins` para ngrok en `next.config.ts`.

**Importante:** si tu dominio ngrok gratuito (`confabulatory-cecil-grummer.ngrok-free.dev`) estaba configurado para **Mendifly**, seguirá mostrando ese sitio hasta que cierres ese túnel:

1. Cierra `ngrok` en el proyecto Mendifly (otra terminal u otra PC).
2. O entra a [dashboard.ngrok.com/endpoints](https://dashboard.ngrok.com/endpoints) y detén el endpoint activo.
3. Luego inicia Total Living:

```powershell
# Terminal 1 — Django
.\venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000

# Terminal 2 — Frontend
npm.cmd run dev:tunnel

# Terminal 3 — ngrok
ngrok http 3000
```

Abre en el celular la URL que muestre ngrok y pulsa **Visit Site**. El título debe decir **Total Living**, no Mendifly.

**Sin errores de WebSocket:** usa `npm run preview:tunnel` en lugar de `dev`.

### Fotos de propiedades en el iPhone (con ngrok HTTPS)

Las imágenes vienen del backend Django (`/media/...`). Si la API sigue en `127.0.0.1`, el iPhone no puede cargarlas (Safari bloquea `http://127.0.0.1` desde una página HTTPS).

En plan ngrok gratuito solo hay **un** túnel a la vez. Alternativas:

- Usar **WiFi** (Opción A) con `NEXT_PUBLIC_API_URL=http://TU_IP:8000/api`
- O abrir un segundo túnel ngrok al backend (requiere plan de pago o alternar túneles)

Si tienes segundo túnel al backend, en `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://abcd-1234.ngrok-free.dev/api
```

Reinicia Django y Next. Las fotos deberían verse en Safari.

## Publicar en GitHub Pages

Guía completa: [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md)

Sitio en producción:

**https://rodrigomendiola57-eng.github.io/TOTAL_LV_NODE.JS/**

## Google Maps (migración)

Los mapas del sitio usan **Google Maps** (catálogo, detalle, desarrollos, picker del dashboard).

- **Fase 1 (Cloud + API key):** [docs/GOOGLE_MAPS_FASE1.md](docs/GOOGLE_MAPS_FASE1.md)
- **Fase 2 (piloto detalle):** [docs/GOOGLE_MAPS_FASE2.md](docs/GOOGLE_MAPS_FASE2.md)
- **Fase 3 (catálogo + resto):** [docs/GOOGLE_MAPS_FASE3.md](docs/GOOGLE_MAPS_FASE3.md)
- Variable: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` en `.env`
- **Media / uploads (seguridad):** [docs/MEDIA_SECURITY.md](docs/MEDIA_SECURITY.md)
- **Fase 3 (CSP, edge rate limit, alertas):** [docs/SECURITY_FASE3.md](docs/SECURITY_FASE3.md)
