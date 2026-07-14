/** Número/URL de WhatsApp del sitio (público). */

const FALLBACK_PHONE = "524423271417";

/**
 * URL wa.me a partir de env o fallback de contacto.
 * - NEXT_PUBLIC_WHATSAPP_URL: URL completa (prioridad)
 * - NEXT_PUBLIC_WHATSAPP_PHONE: dígitos con código país (ej. 524421234567)
 */
export function getSiteWhatsAppUrl(prefilledText?: string): string {
  const fromUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim();
  if (fromUrl) {
    if (!prefilledText) return fromUrl;
    const sep = fromUrl.includes("?") ? "&" : "?";
    return `${fromUrl}${sep}text=${encodeURIComponent(prefilledText)}`;
  }

  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/\D/g, "") || FALLBACK_PHONE;
  const base = `https://wa.me/${raw}`;
  if (!prefilledText) return base;
  return `${base}?text=${encodeURIComponent(prefilledText)}`;
}
