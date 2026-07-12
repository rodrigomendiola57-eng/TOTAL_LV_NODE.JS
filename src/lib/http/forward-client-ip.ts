/**
 * Extrae la IP del visitante en el edge Next (CF → Next → Django).
 * Preferimos CF-Connecting-IP (no spoofeable por el cliente detrás de Cloudflare).
 */
export function getClientIp(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;

  const real = request.headers.get("x-real-ip")?.trim();
  if (real) {
    const first = real.split(",")[0]?.trim();
    if (first) return first;
  }

  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }

  return "unknown";
}

/** Headers para que Django vea la IP real (throttles, alertas, admin). */
export function djangoForwardHeaders(
  request: Request,
  initHeaders?: HeadersInit,
): Headers {
  const headers = new Headers(initHeaders);
  const ip = getClientIp(request);
  headers.set("X-Forwarded-For", ip);
  headers.set("X-Real-IP", ip);
  return headers;
}
