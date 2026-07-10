"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const CITY_IMAGE_DESKTOP = "/images/home/campanario-queretaro.png";
const CITY_IMAGE_MOBILE = "/images/home/queretaro-mobile.png";

interface CityHighlightSectionProps {
  ariaLabel?: string;
  cityName?: string;
  title?: string;
  description?: string;
  imageDesktop?: string;
  imageMobile?: string;
}

export function CityHighlightSection({
  ariaLabel = "Querétaro — epicentro del lujo inmobiliario",
  cityName = "Querétaro",
  title = "El epicentro del lujo y la plusvalía",
  description = "Querétaro concentra la mayor proyección de desarrollo inmobiliario premium en el Bajío. La zona correcta, en el momento exacto, transforma una simple compra en un legado patrimonial.",
  imageDesktop = CITY_IMAGE_DESKTOP,
  imageMobile = CITY_IMAGE_MOBILE,
}: CityHighlightSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const fadeEase = [0.22, 1, 0.36, 1] as const;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.05, 1.12]);
  const desktopParallaxStyle = {
    y: reducedMotion ? 0 : imageY,
    scale: reducedMotion ? 1.05 : imageScale,
  };

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      className="relative w-full overflow-hidden md:min-h-[60dvh]"
    >
      <img
        aria-hidden
        src={imageMobile}
        alt=""
        width={478}
        height={1024}
        className="relative z-0 block h-auto w-full md:hidden"
      />

      <motion.div
        aria-hidden
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat will-change-transform md:block"
        style={{
          backgroundImage: `url('${imageDesktop}')`,
          ...desktopParallaxStyle,
        }}
      />

      <div aria-hidden className="absolute inset-0 z-[1] bg-tl-black/45" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(56,56,46,0.12)_75%,rgba(26,26,24,0.38)_100%)]"
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center px-5 py-16 md:relative md:min-h-[60dvh] md:py-28">
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35, margin: "0px 0px -10% 0px" }}
          transition={{
            duration: reducedMotion ? 0.35 : 0.85,
            ease: fadeEase,
          }}
          className="mx-auto flex w-full max-w-4xl flex-col items-center text-center"
        >
          <div className="flex w-full items-center justify-center gap-5 sm:gap-7">
            <span
              aria-hidden
              className="h-px w-10 bg-tl-gold/40 sm:w-16 md:w-24"
            />
            <p className="font-outfit text-4xl font-extralight uppercase tracking-[0.2em] text-tl-gold sm:text-5xl sm:tracking-[0.24em] md:text-6xl lg:text-7xl">
              {cityName}
            </p>
            <span
              aria-hidden
              className="h-px w-10 bg-tl-gold/40 sm:w-16 md:w-24"
            />
          </div>

          <h2 className="mt-6 font-cormorant text-5xl font-light leading-[1.08] text-tl-beige sm:mt-8 sm:text-6xl md:text-7xl">
            {title}
          </h2>

          <div className="mt-9 w-full sm:mt-10">
            <div className="relative mx-auto w-full max-w-2xl px-1 md:w-fit md:overflow-hidden md:rounded-xl md:border md:border-tl-gold/20 md:bg-black/30 md:px-6 md:py-5 md:shadow-[0_8px_32px_rgba(0,0,0,0.2)] md:backdrop-blur-md">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-gradient-to-r from-transparent via-tl-gold/40 to-transparent md:block"
              />
              <p className="font-outfit text-lg font-extralight leading-relaxed tracking-[0.02em] text-tl-beige/90 sm:text-xl sm:leading-relaxed md:text-tl-beige/85">
                {description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
