/**
 * Reescribe URLs de media servidas desde Django en localhost para que funcionen
 * en el celular vía ngrok (Safari no puede cargar http://127.0.0.1 desde HTTPS).
 */
function getPublicMediaOrigin(): string | null {
  const explicit = process.env.NEXT_PUBLIC_MEDIA_ORIGIN?.replace(/\/$/, "");
  if (explicit) return explicit;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!apiUrl) return null;
  if (/127\.0\.0\.1|localhost/i.test(apiUrl)) return null;

  return apiUrl.replace(/\/api$/i, "");
}

const LOCAL_MEDIA_PATTERN =
  /^https?:\/\/(127\.0\.0\.1|localhost):8000\/media\/(.+)$/i;

export function resolveMediaUrl(
  url: string | null | undefined,
): string | null | undefined {
  if (!url) return url;

  const origin = getPublicMediaOrigin();
  if (origin) {
    return url
      .replace(/^https?:\/\/127\.0\.0\.1:8000/i, origin)
      .replace(/^https?:\/\/localhost:8000/i, origin);
  }

  // Un solo túnel ngrok: las fotos pasan por Next (/api/media) en el mismo HTTPS.
  const proxyMatch = url.match(LOCAL_MEDIA_PATTERN);
  if (proxyMatch?.[2]) {
    return `/api/media/${proxyMatch[2]}`;
  }

  return url;
}
