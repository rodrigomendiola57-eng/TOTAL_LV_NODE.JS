# Publicar Total Living en GitHub Pages

GitHub Pages solo sirve archivos **estáticos**. El frontend se exporta como HTML/CSS/JS. El backend Django **no** corre en GitHub Pages; si quieres propiedades reales en producción, debes hospedar la API aparte y configurar `NEXT_PUBLIC_API_URL`.

## 1. Crear el repositorio en GitHub

1. Entra a [github.com/new](https://github.com/new)
2. Nombre del repo: **`TOTAL_LV_NODE.JS`**
3. No marques “Add README” si ya tienes el proyecto local

## 2. Subir el código (PowerShell)

```powershell
cd C:\TOTAL_LV_NODE.JS
git init
git add .
git commit -m "Initial commit: Total Living"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TOTAL_LV_NODE.JS.git
git push -u origin main
```

Reemplaza `TU_USUARIO` por tu usuario de GitHub.

## 3. Activar GitHub Pages

1. Repo → **Settings** → **Pages**
2. En **Build and deployment** → **Source**, elige **GitHub Actions**
3. Guarda

## 4. Primer deploy

Al hacer push a `main`, corre el workflow **Deploy GitHub Pages** (`.github/workflows/deploy-github-pages.yml`).

Cuando termine, tu sitio estará en:

| Tipo de repo | URL |
|---|---|
| Repo `TOTAL_LV_NODE.JS` | `https://TU_USUARIO.github.io/TOTAL_LV_NODE.JS/` |
| Repo especial `TU_USUARIO.github.io` | `https://TU_USUARIO.github.io/` |

## 5. API de Django (opcional pero recomendado)

Para que carguen propiedades en producción:

1. Sube Django a un servidor (Railway, Render, VPS, etc.)
2. En GitHub: **Settings** → **Secrets and variables** → **Actions**
3. Crea el secret `NEXT_PUBLIC_API_URL` con tu API pública, por ejemplo:
   `https://tu-api.com/api`
4. Vuelve a ejecutar el workflow (push a `main` o **Actions** → **Run workflow**)

Sin ese secret, el sitio se publica igual (diseño, menú, animaciones), pero las listas de propiedades pueden salir vacías en el build.

## 6. Probar el build local (opcional)

```powershell
cd C:\TOTAL_LV_NODE.JS
$env:GITHUB_PAGES = "true"
$env:NEXT_PUBLIC_BASE_PATH = "/TOTAL_LV_NODE.JS"
npm run build
```

La carpeta `out/` contiene el sitio estático.

## Limitaciones

- **Dashboard / CRM**: la interfaz puede verse, pero crear/editar propiedades requiere API en vivo y CORS configurado.
- **Propiedades nuevas**: solo aparecen en Pages después de un nuevo deploy (build estático), salvo que migres a fetch en el cliente.
- **Imágenes del backend**: la API debe ser HTTPS pública y estar en `remotePatterns` de `next.config.ts` si usas dominios nuevos.

## Alternativa más simple para preview

Si solo quieres enseñar el diseño sin configurar GitHub:

- [Vercel](https://vercel.com) (gratis, ideal para Next.js)
- [Netlify](https://netlify.com)

GitHub Pages es gratis y estable, pero este proyecto usa Next.js + Django, así que la API siempre va aparte.
