import { getDevelopmentAmenityIcon } from "@/lib/data/development-amenity-icon";

interface DevelopmentAmenitiesGridProps {
  amenities: string[];
}

export function DevelopmentAmenitiesGrid({
  amenities,
}: DevelopmentAmenitiesGridProps) {
  if (amenities.length === 0) return null;

  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-tl-olive/[0.12] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-6">
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
        {amenities.map((amenity) => (
          <div
            key={amenity}
            className="group flex items-center gap-3 rounded-xl px-2.5 py-3 transition-colors hover:bg-white/[0.03]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-tl-gold/20 bg-tl-black/30 text-tl-gold/85 transition-colors group-hover:border-tl-gold/45 group-hover:text-tl-gold">
              <i
                className={`bi bi-${getDevelopmentAmenityIcon(amenity)} text-base leading-none`}
                aria-hidden="true"
              />
            </span>
            <span className="font-outfit text-[0.85rem] font-extralight leading-tight tracking-[0.01em] text-tl-beige/80">
              {amenity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
