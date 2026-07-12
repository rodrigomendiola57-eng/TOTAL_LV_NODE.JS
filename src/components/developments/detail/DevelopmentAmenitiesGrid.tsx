import { getDevelopmentAmenityIcon } from "@/lib/data/development-amenity-icon";
import { cn } from "@/lib/utils";

interface DevelopmentAmenitiesGridProps {
  amenities: string[];
  /** Frase bajo el eyebrow; por defecto tono Total Living. */
  headline?: string;
}

/**
 * Ancho por ítem según cantidad: filas equilibradas y última fila centrada
 * (flex + justify-center), como en el diseño de referencia.
 */
function itemWidthClass(count: number): string {
  if (count <= 2) return "w-1/2 sm:w-40";
  if (count === 3) return "w-1/2 sm:w-1/3";
  if (count === 4) return "w-1/2 sm:w-1/4";
  if (count === 5) return "w-1/2 sm:w-1/3 lg:w-1/5";
  // 6+: hasta 6 por fila en desktop; filas incompletas quedan centradas
  return "w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6";
}

export function DevelopmentAmenitiesGrid({
  amenities,
  headline = "Disfruta de un entorno placentero sin salir de casa",
}: DevelopmentAmenitiesGridProps) {
  if (amenities.length === 0) return null;

  const widthClass = itemWidthClass(amenities.length);

  return (
    <section className="w-full pt-6 pb-8 sm:pt-8 sm:pb-10 lg:pt-10 lg:pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-outfit text-[11px] font-light uppercase tracking-[0.36em] text-tl-gold sm:text-xs">
            Amenidades
          </p>
          <h2 className="mt-2.5 font-outfit text-2xl font-light leading-snug tracking-[0.01em] text-tl-beige sm:mt-3 sm:text-3xl lg:text-[2.15rem]">
            {headline}
          </h2>
        </header>

        <ul
          className="mt-8 flex list-none flex-wrap justify-center gap-y-8 p-0 sm:mt-10 sm:gap-y-10"
          role="list"
        >
          {amenities.map((amenity) => (
            <li
              key={amenity}
              className={cn(
                "flex flex-col items-center px-2 text-center sm:px-3",
                widthClass,
              )}
            >
              <span
                className="flex h-14 w-14 items-center justify-center text-tl-beige sm:h-16 sm:w-16"
                aria-hidden="true"
              >
                <i
                  className={`bi bi-${getDevelopmentAmenityIcon(amenity)} text-[2rem] leading-none sm:text-[2.35rem]`}
                />
              </span>
              <span className="mt-3 max-w-[8.5rem] font-outfit text-[11px] font-light leading-snug tracking-[0.02em] text-tl-beige/90 sm:mt-3.5 sm:text-xs">
                {amenity}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
