"use client";

import { BrandLogoSymbol } from "@/components/layout/BrandLogoSymbol";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const TL_BEIGE = "#F2ECE0";
const TL_GOLD = "#D6B585";
const easeInOut = [0.42, 0, 0.58, 1] as const;

interface BrandLogoAnimatedProps {
  animationKey: string | number;
  symbolClassName?: string;
  titleClassName?: string;
  title?: string;
  href?: string;
  onClick?: () => void;
  wrapperClassName?: string;
  innerClassName?: string;
  /** Tracking inicial (en móvil debe ser bajo para no desbordar). */
  animateLetterSpacingFrom?: string;
  animateLetterSpacingTo?: string;
  priority?: boolean;
}

const titleContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.38,
    },
  },
};

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    color: TL_GOLD,
    textShadow: "0 0 20px rgba(214,181,133,0.9)",
  },
  visible: {
    opacity: 1,
    y: 0,
    color: [TL_GOLD, TL_GOLD, "#E8D4B0", TL_BEIGE],
    textShadow: [
      "0 0 22px rgba(214,181,133,0.95)",
      "0 0 18px rgba(214,181,133,0.8)",
      "0 0 10px rgba(214,181,133,0.35)",
      "0 0 0px rgba(214,181,133,0)",
    ],
    transition: {
      duration: 0.85,
      ease: easeInOut,
      color: { duration: 1.35, times: [0, 0.45, 0.75, 1], ease: easeInOut },
      textShadow: {
        duration: 1.35,
        times: [0, 0.45, 0.75, 1],
        ease: easeInOut,
      },
    },
  },
};

const letterVariantsReduced = {
  hidden: { opacity: 0, color: TL_GOLD },
  visible: {
    opacity: 1,
    color: TL_BEIGE,
    transition: { duration: 0.35, ease: easeInOut },
  },
};

interface BrandTitleProps {
  animationKey: string | number;
  title: string;
  titleClassName: string;
  animateLetterSpacingFrom: string;
  animateLetterSpacingTo: string;
}

function BrandTitle({
  animationKey,
  title,
  titleClassName,
  animateLetterSpacingFrom,
  animateLetterSpacingTo,
}: BrandTitleProps) {
  const characters = Array.from(title);
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      key={`title-${animationKey}`}
      className={`relative inline-block min-w-0 ${titleClassName}`}
      aria-label={title}
      initial={
        reduceMotion
          ? false
          : { letterSpacing: animateLetterSpacingFrom }
      }
      animate={{ letterSpacing: animateLetterSpacingTo }}
      transition={{ duration: 1.05, delay: 0.32, ease: easeInOut }}
    >
      <motion.span
        className="relative inline-flex max-w-full"
        variants={titleContainerVariants}
        initial="hidden"
        animate="visible"
        aria-hidden
      >
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={reduceMotion ? letterVariantsReduced : letterVariants}
            className="inline-block"
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>

      {!reduceMotion ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.55,
            delay: 0.55,
            times: [0, 0.15, 0.7, 1],
            ease: easeInOut,
          }}
        >
          <motion.span
            className="absolute inset-y-0 w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-[#D6B585]/80 to-transparent"
            initial={{ left: "-45%" }}
            animate={{ left: "125%" }}
            transition={{ duration: 1.35, delay: 0.6, ease: easeInOut }}
          />
        </motion.span>
      ) : null}
    </motion.span>
  );
}

export function BrandLogoAnimated({
  animationKey,
  symbolClassName = "opacity-95",
  titleClassName = "whitespace-nowrap font-cormorant text-[1.55rem] font-light text-tl-beige sm:text-[1.8rem]",
  title = "TOTAL LIVING",
  href,
  onClick,
  wrapperClassName,
  innerClassName = "relative flex min-w-0 flex-nowrap items-center gap-2.5 overflow-visible rounded-xl px-1 py-0.5",
  animateLetterSpacingFrom = "0.28em",
  animateLetterSpacingTo = "0.14em",
}: BrandLogoAnimatedProps) {
  const logo = (
    <div className={innerClassName}>
      <div className="relative shrink-0">
        <BrandLogoSymbol
          animationKey={animationKey}
          className={symbolClassName}
        />
      </div>

      <BrandTitle
        animationKey={animationKey}
        title={title}
        titleClassName={titleClassName}
        animateLetterSpacingFrom={animateLetterSpacingFrom}
        animateLetterSpacingTo={animateLetterSpacingTo}
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={wrapperClassName}
        aria-label="Total Living inicio"
      >
        {logo}
      </Link>
    );
  }

  return logo;
}
