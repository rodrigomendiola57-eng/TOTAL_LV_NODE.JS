import type { DevelopmentStatus } from "@/types/development";
import { getSiteWhatsAppUrl } from "@/lib/whatsapp";

/** Clases de la píldora de estatus, dentro de la paleta Total Living. */
export function developmentStatusClasses(status: DevelopmentStatus): string {
  switch (status) {
    case "Entrega inmediata":
      return "border-transparent bg-tl-gold text-tl-black";
    case "En construcción":
      return "border-tl-beige/30 bg-tl-black/50 text-tl-beige/85";
    case "Preventa":
    default:
      return "border-tl-gold/50 bg-tl-gold/10 text-tl-gold";
  }
}

export function developmentWhatsAppUrl(name: string, zone: string): string {
  return getSiteWhatsAppUrl(
    `Hola, me interesa el desarrollo "${name}" en ${zone}. ¿Me pueden dar más información?`,
  );
}
