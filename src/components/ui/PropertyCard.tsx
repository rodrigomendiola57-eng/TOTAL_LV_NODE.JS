import type { Property } from "@/types/property";
import { formatPropertyBathrooms, formatPropertyLocation } from "@/types/property";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

interface PropertyCardProps {
  property: Property;
}

function formatPrice(value: string, currency: string): string {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return `${value} ${currency}`;

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(parsed);
}

const FALLBACK_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop";

export function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = property.cover_image_url || FALLBACK_PROPERTY_IMAGE;
  const whatsappText = encodeURIComponent(
    `Hola, me interesa la propiedad "${property.title}" en ${formatPropertyLocation(property)}.`,
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-tl-gold/25 bg-black/30 transition-all duration-300 hover:border-tl-gold/55 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <div className="relative aspect-[5/4] overflow-hidden">
        <div
          className="h-full w-full scale-100 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-105"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 to-black/10" />

        <p className="absolute left-3 top-3 rounded-full border border-tl-gold/50 bg-tl-black/45 px-2.5 py-0.5 font-outfit text-[9px] font-light uppercase tracking-[0.2em] text-tl-gold backdrop-blur-sm">
          {property.operation_type}
        </p>

        <div className="absolute bottom-0 left-0 right-0 px-3.5 pb-3.5 pt-10">
          <p className="font-outfit text-lg font-extralight tracking-[0.02em] text-tl-gold sm:text-xl">
            {formatPrice(property.price, property.currency)}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3.5 py-3.5">
        <h3 className="line-clamp-2 font-outfit text-[1.05rem] font-extralight leading-snug tracking-[0.01em] text-tl-beige sm:text-lg">
          {property.title}
        </h3>
        <p className="mt-1 line-clamp-1 font-outfit text-[11px] font-light tracking-[0.04em] text-tl-beige/55">
          {formatPropertyLocation(property)}
        </p>

        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/65">
          <span>{property.bedrooms} rec</span>
          <span className="text-tl-gold/30">·</span>
          <span>{formatPropertyBathrooms(property)}</span>
          <span className="text-tl-gold/30">·</span>
          <span>{property.build_area_m2} m²</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Link
            href={`/propiedades/${property.id}`}
            className="inline-flex flex-1 justify-center rounded-full border border-tl-gold/45 px-3 py-1.5 font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-gold transition-colors hover:bg-tl-gold hover:text-tl-black"
          >
            Ver detalles
          </Link>
          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Contactar por WhatsApp"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-tl-gold/35 text-tl-gold transition-colors hover:border-tl-gold hover:bg-tl-gold/10"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
