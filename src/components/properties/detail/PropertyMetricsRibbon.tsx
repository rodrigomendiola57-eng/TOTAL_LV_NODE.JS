import type { PropertySpecItem } from "@/lib/property-detail";
import { cn } from "@/lib/utils";

interface PropertyMetricsRibbonProps {
  items: PropertySpecItem[];
}

export function PropertyMetricsRibbon({ items }: PropertyMetricsRibbonProps) {
  if (items.length === 0) return null;

  const isOdd = items.length % 2 === 1;

  return (
    <>
      {/* Móvil: cuadrícula de tarjetas modernas */}
      <div className="grid auto-rows-fr grid-cols-2 gap-2.5 sm:hidden">
        {items.map((item, index) => {
          const Icon = item.icon;
          const spanFull = isOdd && index === items.length - 1;
          return (
            <div
              key={item.label}
              className={cn(
                "relative flex h-full flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-tl-gold/15 bg-[linear-gradient(135deg,rgba(214,181,133,0.12),rgba(255,255,255,0.02)_55%,transparent)] px-3 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
                spanFull && "col-span-2",
              )}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-tl-gold/25 bg-tl-black/40 text-tl-gold">
                <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
              </span>
              <div className="flex flex-col items-center">
                <p className="font-outfit text-[1.35rem] font-extralight leading-tight tracking-[0.01em] text-tl-beige">
                  {item.value}
                </p>
                <p className="mt-1.5 font-outfit text-[10px] font-light uppercase leading-tight tracking-[0.14em] text-tl-beige/50">
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Escritorio: cinta horizontal */}
      <div className="hidden sm:block">
        <div className="inline-flex w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(214,181,133,0.07),rgba(255,255,255,0.02)_45%,transparent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="relative flex flex-1 flex-col items-center px-5 py-6 text-center"
              >
                {index > 0 ? (
                  <span
                    className="absolute left-0 top-1/2 h-10 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-tl-gold/25 to-transparent"
                    aria-hidden="true"
                  />
                ) : null}

                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-tl-gold/20 bg-tl-black/30 text-tl-gold/90">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </span>

                <p className="font-outfit text-[clamp(1.65rem,3.5vw,2.15rem)] font-extralight leading-none tracking-[0.01em] text-tl-beige">
                  {item.value}
                </p>
                <p className="mt-2 font-outfit text-[11px] font-extralight uppercase tracking-[0.16em] text-tl-beige/45">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
