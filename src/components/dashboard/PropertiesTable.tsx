"use client";

import type { Property } from "@/types/property";
import { formatPropertyLocation } from "@/types/property";
import { cn } from "@/lib/utils";
import { Pencil, Star, Trash2 } from "lucide-react";

interface PropertiesTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
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

export function PropertiesTable({
  properties,
  onEdit,
  onDelete,
}: PropertiesTableProps) {
  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-tl-gold/20 bg-tl-black/50 px-6 py-16 text-center">
        <p className="font-outfit font-light text-sm text-tl-beige/70">
          No hay propiedades registradas. Crea la primera con el botón
          &quot;Nueva Propiedad&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-tl-gold/20 bg-tl-black/50">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead>
            <tr className="border-b border-tl-gold/15 bg-tl-black/80">
              {["Título", "Precio", "Tipo", "Operación", "Zona", "Destacada", "Acciones"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-5 py-4 font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-beige/50"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr
                key={property.id}
                className="border-b border-tl-gold/10 transition-colors last:border-0 hover:bg-tl-olive/15"
              >
                <td className="px-5 py-4">
                  <p className="font-outfit font-light text-sm text-tl-beige">{property.title}</p>
                  <p className="mt-1 font-outfit font-light text-xs text-tl-beige/50">
                    {formatPropertyLocation(property)}
                  </p>
                </td>
                <td className="px-5 py-4 font-outfit font-light text-sm text-tl-gold">
                  {formatPrice(property.price, property.currency)}
                </td>
                <td className="px-5 py-4 font-outfit font-light text-xs text-tl-beige/80">
                  {property.property_type}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full border border-tl-gold/30 px-3 py-1 font-outfit font-light text-[10px] uppercase tracking-[0.12em] text-tl-beige/80">
                    {property.operation_type}
                  </span>
                </td>
                <td className="px-5 py-4 font-outfit font-light text-xs text-tl-beige/70">
                  {property.zone}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 font-outfit font-light text-xs",
                      property.is_featured ? "text-tl-gold" : "text-tl-beige/40",
                    )}
                  >
                    <Star
                      className="h-3.5 w-3.5"
                      fill={property.is_featured ? "currentColor" : "none"}
                    />
                    {property.is_featured ? "Sí" : "No"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(property)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-tl-gold/30 px-3 py-1.5 font-outfit font-light text-[10px] uppercase tracking-[0.12em] text-tl-beige/80 transition-colors hover:border-tl-gold hover:text-tl-gold"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(property)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-3 py-1.5 font-outfit font-light text-[10px] uppercase tracking-[0.12em] text-red-300/80 transition-colors hover:border-red-400 hover:text-red-200"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Borrar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
