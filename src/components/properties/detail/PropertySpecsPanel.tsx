import type { Property } from "@/types/property";
import type { PropertySpecItem } from "@/lib/property-detail";
import { PropertyTechnicalSheetDownload } from "./PropertyTechnicalSheetDownload";
import { cn } from "@/lib/utils";

interface PropertySpecsPanelProps {
  items: PropertySpecItem[];
  property?: Property;
}

export function PropertySpecsPanel({ items, property }: PropertySpecsPanelProps) {
  if (items.length === 0 && !property) return null;

  const isOdd = items.length % 2 === 1;

  return (
    <>
      {/* Móvil: cuadrícula de tarjetas */}
      <div className="grid grid-cols-2 gap-2.5 sm:hidden">
        {items.map((item, index) => {
          const Icon = item.icon;
          const spanFull = isOdd && index === items.length - 1;
          return (
            <div
              key={item.label}
              className={cn(
                "flex flex-col justify-between rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(74,78,56,0.22),rgba(0,0,0,0.28))] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
                spanFull && "col-span-2 flex-row items-center gap-4",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-tl-gold/20 bg-[linear-gradient(145deg,rgba(214,181,133,0.14),rgba(74,78,56,0.2))] text-tl-gold",
                  spanFull ? "mb-0" : "mb-3",
                )}
              >
                <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/45">
                  {item.label}
                </p>
                <p className="mt-1 font-outfit text-lg font-extralight tracking-[0.01em] text-tl-beige">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
        {property ? (
          <PropertyTechnicalSheetDownload property={property} className="sm:hidden" />
        ) : null}
      </div>

      {/* Escritorio: lista en panel */}
      <div className="hidden overflow-hidden rounded-[1.35rem] border border-white/10 bg-tl-olive/15 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:block">
        <div className="grid gap-px bg-white/6 sm:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="group flex items-center gap-4 bg-tl-black/35 px-5 py-5 transition-colors hover:bg-white/[0.03]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-tl-gold/15 bg-[linear-gradient(145deg,rgba(214,181,133,0.12),rgba(74,78,56,0.18))] text-tl-gold transition-colors group-hover:border-tl-gold/35">
                  <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-beige/45">
                    {item.label}
                  </p>
                  <p className="mt-1.5 font-outfit text-[clamp(1.05rem,2vw,1.2rem)] font-extralight tracking-[0.01em] text-tl-beige">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
