import { formatPrice } from "@/lib/format-price";
import { resolveMediaUrl } from "@/lib/media-url";
import { absoluteSiteUrl } from "@/lib/site-url";
import { getSiteWhatsAppUrl } from "@/lib/whatsapp";
import type { Property } from "@/types/property";
import { formatPropertyLocation } from "@/types/property";

export function getPropertyShareUrl(property: Property): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/propiedades/${property.id}`;
  }
  return absoluteSiteUrl(`/propiedades/${property.id}`);
}

export function getPropertyShareImageUrl(property: Property): string | null {
  const raw = resolveMediaUrl(property.cover_image_url) ?? property.cover_image_url;
  if (!raw) return null;
  if (typeof window !== "undefined" && raw.startsWith("/")) {
    return `${window.location.origin}${raw}`;
  }
  return absoluteSiteUrl(raw);
}

/** Texto de marca para WhatsApp, Web Share, correo, etc. */
export function buildPropertyShareText(
  property: Property,
  options?: { includeUrl?: boolean; url?: string },
): string {
  const url = options?.url ?? getPropertyShareUrl(property);
  const location = formatPropertyLocation(property);
  const price = formatPrice(property.price, property.currency);
  const operation = property.operation_type || "Propiedad";
  const specs = [
    property.bedrooms > 0 ? `${property.bedrooms} rec` : null,
    property.full_bathrooms > 0
      ? `${property.full_bathrooms} baños`
      : null,
    property.build_area_m2 && Number(property.build_area_m2) > 0
      ? `${Number(property.build_area_m2).toLocaleString("es-MX")} m²`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const lines = [
    "Mira esta propiedad en Total Living",
    "",
    property.title,
    `${operation} · ${location}`,
    price,
  ];

  if (specs) lines.push(specs);
  if (options?.includeUrl !== false) {
    lines.push("", url);
  }

  return lines.join("\n");
}

export function buildPropertyShareEmail(property: Property): {
  subject: string;
  body: string;
} {
  const url = getPropertyShareUrl(property);
  return {
    subject: `Mira esta propiedad en Total Living — ${property.title}`,
    body: buildPropertyShareText(property, { url, includeUrl: true }),
  };
}

export function getPropertyWhatsAppShareUrl(property: Property): string {
  const url = getPropertyShareUrl(property);
  return getSiteWhatsAppUrl(
    buildPropertyShareText(property, { url, includeUrl: true }),
  );
}

export function getPropertyFacebookShareUrl(property: Property): string {
  const url = encodeURIComponent(getPropertyShareUrl(property));
  return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
}

export function getPropertyEmailShareUrl(property: Property): string {
  const { subject, body } = buildPropertyShareEmail(property);
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Instagram no acepta deep links con preview; copiamos el mensaje listo para pegar. */
export async function copyPropertyShareForInstagram(
  property: Property,
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(
      buildPropertyShareText(property, { includeUrl: true }),
    );
    return true;
  } catch {
    return false;
  }
}

async function tryShareCoverImage(
  property: Property,
): Promise<File | null> {
  const imageUrl = getPropertyShareImageUrl(property);
  if (!imageUrl) return null;

  try {
    const response = await fetch(imageUrl, { mode: "cors" });
    if (!response.ok) return null;
    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) return null;
    const ext = blob.type.includes("png")
      ? "png"
      : blob.type.includes("webp")
        ? "webp"
        : "jpg";
    return new File([blob], `total-living-${property.id}.${ext}`, {
      type: blob.type,
    });
  } catch {
    return null;
  }
}

/**
 * Comparte con Web Share API (texto + URL + imagen si el dispositivo lo permite).
 * Fallback: copia el enlace al portapapeles.
 */
export async function shareProperty(property: Property): Promise<string | null> {
  const url = getPropertyShareUrl(property);
  const title = `Mira esta propiedad en Total Living`;
  const text = buildPropertyShareText(property, { includeUrl: false, url });

  if (typeof navigator.share === "function") {
    try {
      const file = await tryShareCoverImage(property);
      const canShareFiles =
        file &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShareFiles && file) {
        await navigator.share({
          title,
          text: `${text}\n\n${url}`,
          url,
          files: [file],
        });
        return null;
      }

      await navigator.share({ title, text: `${text}\n\n${url}`, url });
      return null;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return null;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(
      buildPropertyShareText(property, { url, includeUrl: true }),
    );
    return "Mensaje copiado";
  } catch {
    return "No se pudo compartir";
  }
}

export function downloadTechnicalSheet(property: Property, sheetUrl: string): void {
  const link = document.createElement("a");
  link.href = sheetUrl;
  link.download = `ficha-tecnica-${property.id}.pdf`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
