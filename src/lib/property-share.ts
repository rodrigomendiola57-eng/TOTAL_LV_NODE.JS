import { formatPrice } from "@/lib/format-price";
import type { Property } from "@/types/property";
import { formatPropertyLocation } from "@/types/property";

export async function shareProperty(property: Property): Promise<string | null> {
  const url = window.location.href;
  const title = property.title;
  const text = `${property.title} · ${formatPropertyLocation(property)} · ${formatPrice(property.price, property.currency)}`;

  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return null;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return null;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return "Enlace copiado";
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
