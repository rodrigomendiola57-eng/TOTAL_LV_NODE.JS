import { getAmenityBootstrapIcon } from "@/lib/data/amenity-bootstrap-icons";
import { AMENITY_CATEGORY_ORDER } from "@/lib/data/amenity-icons";
import type { Amenity, AmenityCategory } from "@/types/property";

interface PropertyAmenitiesPanelProps {
  amenities: Amenity[];
}

export function PropertyAmenitiesPanel({ amenities }: PropertyAmenitiesPanelProps) {
  if (amenities.length === 0) return null;

  const map = new Map<AmenityCategory, Amenity[]>();
  for (const amenity of amenities) {
    const list = map.get(amenity.category) ?? [];
    list.push(amenity);
    map.set(amenity.category, list);
  }

  const groups = AMENITY_CATEGORY_ORDER.filter((category) => map.has(category)).map(
    (category) => ({ category, items: map.get(category) ?? [] }),
  );

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-tl-olive/[0.12] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      {groups.map(({ category, items }, groupIndex) => (
        <div
          key={category}
          className={
            groupIndex > 0 ? "border-t border-white/[0.06]" : undefined
          }
        >
          <div className="flex items-center gap-3 px-5 pt-6 pb-4 sm:px-7">
            <span className="font-outfit text-[11px] font-light uppercase tracking-[0.22em] text-tl-gold">
              {category}
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-tl-gold/25 to-transparent" />
            <span className="font-outfit text-[11px] font-extralight tabular-nums text-tl-beige/35">
              {items.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 pb-5 sm:grid-cols-3 sm:px-5 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((amenity) => (
              <div
                key={amenity.id}
                className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-white/[0.03]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-tl-gold/20 bg-tl-black/30 text-tl-gold/85 transition-colors group-hover:border-tl-gold/45 group-hover:text-tl-gold">
                  <i
                    className={`bi bi-${getAmenityBootstrapIcon(amenity.slug)} text-[0.95rem] leading-none`}
                    aria-hidden="true"
                  />
                </span>
                <span className="font-outfit text-[0.82rem] font-extralight leading-tight tracking-[0.01em] text-tl-beige/80">
                  {amenity.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
