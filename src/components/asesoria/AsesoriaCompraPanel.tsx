"use client";

import { AsesoriaCompraForm } from "@/components/asesoria/AsesoriaCompraForm";
import { AsesoriaCompraProcessMobile } from "@/components/asesoria/AsesoriaCompraProcessMobile";
import { AsesoriaQueIncluye } from "@/components/asesoria/AsesoriaQueIncluye";
import type { AsesoriaTab } from "@/lib/data/asesoria";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface AsesoriaCompraPanelProps {
  tab: AsesoriaTab;
}

const snapEase = [0.2, 0.8, 0.2, 1] as const;

export function AsesoriaCompraPanel({ tab }: AsesoriaCompraPanelProps) {
  const steps = tab.process ?? [];
  const reducedMotion = useReducedMotion();
  const [desktopMotion, setDesktopMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktopMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const animateProcess = desktopMotion && !reducedMotion;

  function scrollToBrief() {
    document
      .getElementById("compra-brief")
      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className="space-y-10 sm:space-y-12 lg:space-y-14">
      <header className="text-center">
        <h3 className="font-outfit text-2xl font-extralight tracking-[0.02em] text-tl-beige sm:text-3xl">
          {tab.title}
        </h3>
        <p className="mx-auto mt-3 max-w-2xl font-outfit text-sm font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/70 sm:text-base">
          {tab.description}
        </p>

        {/* CTA móvil → formulario */}
        <button
          type="button"
          onClick={scrollToBrief}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-tl-gold/45 px-5 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-gold transition-colors hover:bg-tl-gold/10 lg:hidden"
        >
          Iniciar brief
        </button>
      </header>

      {steps.length > 0 ? (
        <div>
          <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/85">
            Proceso
          </p>

          <div className="mt-5">
            <AsesoriaCompraProcessMobile steps={steps} />
          </div>

          {/* Desktop grid — cards más anchas, tipografía blanca */}
          <div className="relative mt-6 hidden lg:block lg:-mx-3 xl:-mx-6">
            <ol className="grid gap-5 lg:grid-cols-4 xl:gap-6">
              {steps.map((step, index) => (
                <motion.li
                  key={step.id}
                  initial={
                    animateProcess
                      ? {
                          opacity: 0,
                          y: 48,
                          rotateX: 18,
                          scale: 0.88,
                        }
                      : false
                  }
                  whileInView={
                    animateProcess
                      ? {
                          opacity: 1,
                          y: 0,
                          rotateX: 0,
                          scale: 1,
                        }
                      : undefined
                  }
                  viewport={{ once: true, amount: 0.4 }}
                  transition={
                    animateProcess
                      ? {
                          duration: 0.55,
                          ease: snapEase,
                          delay: 0.15 + index * 0.12,
                        }
                      : undefined
                  }
                  style={{ transformPerspective: 900 }}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-white/10 bg-[#161614] px-7 py-7 xl:px-8",
                    "transition-[border-color,box-shadow] duration-500",
                    "hover:border-tl-gold/35 hover:shadow-[0_0_28px_rgba(214,181,133,0.08)]",
                  )}
                >
                  <div className="relative z-[1]">
                    <motion.span
                      className="inline-block font-outfit text-3xl font-extralight tracking-[0.04em] text-white xl:text-4xl"
                      initial={
                        animateProcess ? { opacity: 0, x: -10 } : false
                      }
                      whileInView={
                        animateProcess ? { opacity: 1, x: 0 } : undefined
                      }
                      viewport={{ once: true }}
                      transition={
                        animateProcess
                          ? {
                              duration: 0.4,
                              ease: snapEase,
                              delay: 0.28 + index * 0.12,
                            }
                          : undefined
                      }
                    >
                      {String(index + 1).padStart(2, "0")}
                    </motion.span>
                    <h4 className="mt-5 text-center font-outfit text-lg font-extralight tracking-[0.02em] text-white xl:text-xl">
                      {step.title}
                    </h4>
                    <p className="mt-3 text-center font-outfit text-[15px] font-extralight leading-relaxed tracking-[0.01em] text-white/85 xl:text-base">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      ) : null}

      {/* Móvil: form primero. Desktop: incluye | form */}
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-start lg:gap-10 xl:gap-12">
        <div className="order-2 lg:order-1">
          <AsesoriaQueIncluye features={tab.features} />
        </div>
        <div id="compra-brief" className="order-1 lg:order-2">
          <AsesoriaCompraForm />
        </div>
      </div>
    </div>
  );
}
