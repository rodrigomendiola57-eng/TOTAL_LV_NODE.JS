import { formatPrice } from "@/lib/format-price";
import { getPropertyWhatsAppUrl } from "@/lib/property-detail";
import type { Property } from "@/types/property";
import { MessageCircle } from "lucide-react";
import { DetailButton } from "./DetailButton";
import { PropertyContactActions } from "./PropertyContactActions";
import { PropertyMobileShareButton } from "./PropertyMobileShareButton";

interface PropertyContactCardProps {
  property: Property;
  variant?: "sidebar" | "mobile";
}

export function PropertyContactCard({
  property,
  variant = "sidebar",
}: PropertyContactCardProps) {
  const whatsappUrl = getPropertyWhatsAppUrl(property);

  if (variant === "mobile") {
    return (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-tl-black/95 px-4 py-3 tl-mobile-solid-chrome supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-outfit text-[1.35rem] font-extralight leading-none text-tl-gold">
              {formatPrice(property.price, property.currency)}
            </p>
            <p className="mt-1 truncate font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/45">
              {property.operation_type} · {property.property_type}
            </p>
          </div>
          <PropertyMobileShareButton property={property} />
          <DetailButton
            href={whatsappUrl}
            label="WhatsApp"
            icon={MessageCircle}
            variant="primary"
            external
            compact
            className="shrink-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-tl-gold/20 bg-[linear-gradient(165deg,rgba(214,181,133,0.1),rgba(56,56,46,0.92)_38%,rgba(26,26,24,0.98))] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
      <p className="text-center font-outfit text-[clamp(1.1rem,2.4vw,1.35rem)] font-extralight tracking-[0.02em] text-tl-gold/85">
        Valor de la propiedad
      </p>

      <p className="mt-5 text-center font-outfit text-sm font-extralight uppercase tracking-[0.14em] text-tl-beige/45">
        {property.operation_type}
      </p>
      <p className="mt-2 text-center font-outfit text-[clamp(2rem,4.5vw,2.75rem)] font-extralight leading-none tracking-[0.01em] text-tl-gold">
        {formatPrice(property.price, property.currency)}
      </p>

      {property.maintenance_fee && Number(property.maintenance_fee) > 0 ? (
        <p className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-outfit text-[11px] font-light text-tl-beige/55">
          Mantenimiento {formatPrice(property.maintenance_fee, property.currency)}
        </p>
      ) : null}

      <div className="my-6 h-px bg-gradient-to-r from-transparent via-tl-gold/25 to-transparent" />

      <div className="space-y-3">
        <DetailButton
          href={whatsappUrl}
          label="Agendar por WhatsApp"
          icon={MessageCircle}
          variant="primary"
          external
        />
        <DetailButton
          href={`/contacto?propiedad=${property.id}`}
          label="Contactar asesor"
          variant="secondary"
        />
        <PropertyContactActions property={property} />
      </div>

      <p className="mt-5 text-center font-outfit text-[10px] font-light leading-relaxed text-tl-beige/38">
        Visitas privadas, asesoría legal y acompañamiento en todo el proceso.
      </p>
    </div>
  );
}
