import { ContactView } from "@/components/contact/ContactView";
import { getPropertyById } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Total Living",
  description:
    "Contáctanos para asesoría inmobiliaria en Querétaro. Envía tu consulta y un asesor Total Living te responderá con estrategia y acompañamiento.",
};

interface ContactoPageProps {
  searchParams: Promise<{ propiedad?: string }>;
}

export default async function ContactoPage({ searchParams }: ContactoPageProps) {
  const params = await searchParams;
  const propertyId = params.propiedad?.trim();

  let propertyContext: { id: number; title: string } | null = null;

  if (propertyId) {
    const property = await getPropertyById(propertyId);
    if (property) {
      propertyContext = {
        id: property.id,
        title: property.title,
      };
    }
  }

  return <ContactView propertyContext={propertyContext} />;
}
