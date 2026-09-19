/**
 * Origen público del sitio (Open Graph, WhatsApp, sitemap, JSON-LD).
 *
 * Nunca usar VERCEL_URL: es el host del deploy (a menudo preview + SSO)
 * y WhatsApp/Facebook no pueden descargar og:image desde ahí.
 */
export const SITE_PRODUCTION_ORIGIN = "https://www.totalliving.mx";

export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return SITE_PRODUCTION_ORIGIN;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "http://localhost:3000";
}

export function absoluteSiteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return getSiteOrigin();
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const origin = getSiteOrigin();
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${path}`;
}
