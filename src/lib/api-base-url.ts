const LOCAL_API_PATTERN = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?(\/api)?\/?$/i;

function normalizeBase(url: string): string {
  return url.replace(/\/$/, "");
}

export function isLocalApiUrl(url: string): boolean {
  return LOCAL_API_PATTERN.test(normalizeBase(url));
}

/**
 * URL base de la API Django (`…/api`, sin slash final).
 * - En el navegador con API local: proxy same-origin `/api/django` (ngrok móvil).
 * - En el servidor Next: Django en localhost o `DJANGO_INTERNAL_URL`.
 * - Con `NEXT_PUBLIC_API_URL` pública: se usa directo.
 */
export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL
    ? normalizeBase(process.env.NEXT_PUBLIC_API_URL)
    : null;

  if (typeof window !== "undefined") {
    if (configured && !isLocalApiUrl(configured)) {
      return configured;
    }
    return `${window.location.origin}/api/django`;
  }

  if (configured && !isLocalApiUrl(configured)) {
    return configured;
  }

  const djangoOrigin = normalizeBase(
    process.env.DJANGO_INTERNAL_URL ?? "http://127.0.0.1:8000",
  );
  return `${djangoOrigin}/api`;
}
