"use client";

import { motion, useInView, useScroll } from "framer-motion";
import { useRef } from "react";
import { AboutImageAlbumDesktop, AboutImageAlbumMobile } from "@/components/layout/AboutImageAlbum";
import { SOCIAL_LINKS } from "@/lib/social-links";

const revealEase = [0.22, 1, 0.36, 1] as const;

function AboutSocialLinks() {
  return (
    <div className="mt-6 sm:mt-7">
      <p className="mb-4 font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-beige/45">
        Síguenos
      </p>
      <ul className="flex flex-wrap items-center gap-3" role="list">
        {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white transition-all hover:border-tl-gold hover:bg-white/5 hover:text-tl-gold"
            >
              <Icon className="h-5 w-5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const albumRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.15"],
  });

  const textInView = useInView(textRef, { amount: 0.28, once: false });
  const albumInView = useInView(albumRef, { amount: 0.28, once: false });

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto mb-16 w-full max-w-6xl sm:mb-24"
    >
      <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] lg:gap-14 xl:gap-16">
        <motion.div
          ref={textRef}
          animate={
            textInView
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: -72 }
          }
          transition={{ duration: 0.9, ease: revealEase }}
          className="max-w-xl"
        >
          <div className="mb-4 h-px w-10 bg-tl-gold/70" />
          <p className="font-outfit font-light text-[10px] uppercase tracking-[0.2em] text-tl-gold sm:text-xs sm:tracking-[0.24em]">
            Quiénes somos
          </p>
          <h2 className="text-fluid-h2 mt-3 font-cormorant font-light leading-tight text-tl-beige">
            Estrategia Real detrás de cada Propiedad
          </h2>
          <p className="text-fluid-body mt-4 font-outfit font-light leading-relaxed text-tl-beige/80">
            En Total Living no solo mostramos casas; diseñamos la ruta para que
            logres tu próxima gran inversión con absoluta certeza. Tu
            tranquilidad es nuestro mejor cierre.
          </p>
          <AboutSocialLinks />
        </motion.div>

        <motion.div
          ref={albumRef}
          animate={
            albumInView
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: 72 }
          }
          transition={{ duration: 0.9, ease: revealEase, delay: albumInView ? 0.08 : 0 }}
          className="w-full"
        >
          <AboutImageAlbumDesktop scrollYProgress={scrollYProgress} />
          <AboutImageAlbumMobile />
        </motion.div>
      </div>
    </section>
  );
}
