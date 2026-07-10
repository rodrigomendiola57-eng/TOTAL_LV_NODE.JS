"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { AboutImageAlbumDesktop, AboutImageAlbumMobile } from "@/components/layout/AboutImageAlbum";
import type { AboutAlbumImage } from "@/lib/home-content-mappers";
import { SOCIAL_LINKS } from "@/lib/social-links";

const revealEase = [0.22, 1, 0.36, 1] as const;
const MOBILE_MQ = "(max-width: 1023px)";

function subscribeMobile(onStoreChange: () => void) {
  const mq = window.matchMedia(MOBILE_MQ);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getMobileSnapshot() {
  return window.matchMedia(MOBILE_MQ).matches;
}

function AboutSocialLinks({ label = "Síguenos" }: { label?: string }) {
  return (
    <div className="mt-6 sm:mt-7">
      <p className="mb-4 font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-beige/45">
        {label}
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

export function AboutSection({
  eyebrow = "Quiénes somos",
  title = "Estrategia Real detrás de cada Propiedad",
  body = "En Total Living no solo mostramos casas; diseñamos la ruta para que logres tu próxima gran inversión con absoluta certeza. Tu tranquilidad es nuestro mejor cierre.",
  ctaLabel = "Conoce al equipo",
  ctaUrl = "/nosotros",
  socialLabel = "Síguenos",
  albumImages,
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  socialLabel?: string;
  albumImages?: AboutAlbumImage[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const albumRef = useRef<HTMLDivElement>(null);
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    () => false,
  );

  // Móvil: once=true evita que el álbum desaparezca al hacer scroll rápido.
  const textInView = useInView(textRef, {
    amount: isMobile ? 0.18 : 0.28,
    once: isMobile,
  });
  const albumInView = useInView(albumRef, {
    amount: isMobile ? 0.1 : 0.28,
    once: isMobile,
    margin: isMobile ? "0px 0px -40px 0px" : undefined,
  });

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
              ? { opacity: 1, x: 0, y: 0 }
              : isMobile
                ? { opacity: 0, y: 18, x: 0 }
                : { opacity: 0, x: -72 }
          }
          transition={{
            duration: isMobile ? 0.55 : 0.9,
            ease: revealEase,
          }}
          className="max-w-xl"
        >
          <div className="mb-4 h-px w-10 bg-tl-gold/70" />
          <p className="font-outfit font-light text-[10px] uppercase tracking-[0.2em] text-tl-gold sm:text-xs sm:tracking-[0.24em]">
            {eyebrow}
          </p>
          <h2 className="text-fluid-h2 mt-3 font-cormorant font-light leading-tight text-tl-beige">
            {title}
          </h2>
          <p className="text-fluid-body mt-4 font-outfit font-light leading-relaxed text-tl-beige/80">
            {body}
          </p>
          <Link
            href={ctaUrl}
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-tl-gold/40 px-5 py-2.5 font-outfit font-light text-[10px] uppercase tracking-[0.14em] text-tl-gold transition-colors hover:border-tl-gold hover:bg-tl-gold/10 sm:text-[11px] sm:tracking-[0.16em]"
          >
            {ctaLabel}
          </Link>
          <AboutSocialLinks label={socialLabel} />
        </motion.div>

        <motion.div
          ref={albumRef}
          animate={
            albumInView
              ? { opacity: 1, x: 0, y: 0 }
              : isMobile
                ? { opacity: 0, y: 20, x: 0 }
                : { opacity: 0, x: 72 }
          }
          transition={{
            duration: isMobile ? 0.5 : 0.9,
            ease: revealEase,
            delay: albumInView && !isMobile ? 0.08 : 0,
          }}
          className="w-full"
        >
          {!isMobile ? (
            <AboutImageAlbumDesktop sectionRef={sectionRef} images={albumImages} />
          ) : null}
          <AboutImageAlbumMobile images={albumImages} />
        </motion.div>
      </div>
    </section>
  );
}
