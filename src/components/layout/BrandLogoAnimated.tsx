"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface BrandLogoAnimatedProps {
  animationKey: string | number;
  symbolClassName?: string;
  titleClassName?: string;
  title?: string;
  href?: string;
  onClick?: () => void;
  wrapperClassName?: string;
  innerClassName?: string;
  animateLetterSpacingTo?: string;
  priority?: boolean;
}

export function BrandLogoAnimated({
  animationKey,
  symbolClassName = "relative h-[34px] w-[42px] object-contain opacity-95 sm:h-[39px] sm:w-[48px]",
  titleClassName = "whitespace-nowrap font-cormorant text-[1.55rem] font-light text-tl-beige sm:text-[1.8rem]",
  title = "TOTAL LIVING",
  href,
  onClick,
  wrapperClassName,
  innerClassName = "relative flex min-w-0 flex-nowrap items-center gap-2.5 overflow-hidden rounded-xl px-1 py-0.5",
  animateLetterSpacingTo = "0.14em",
  priority = false,
}: BrandLogoAnimatedProps) {
  const logo = (
    <motion.div
      key={animationKey}
      initial={{ opacity: 0, y: -10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className={innerClassName}
    >
      <motion.div
        initial={{ x: "-130%", opacity: 0 }}
        animate={{ x: "175%", opacity: [0, 0.82, 0] }}
        transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="pointer-events-none absolute inset-y-0 w-24 -skew-x-12 bg-gradient-to-r from-transparent via-tl-gold/90 to-transparent blur-[1.2px]"
      />
      <motion.div
        initial={{ rotate: -18, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="relative shrink-0"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.25, ease: "easeOut", times: [0, 0.5, 1] }}
          className="absolute inset-0 rounded-full bg-tl-gold/65 blur-lg"
        />
        <Image
          src="/logo-symbol.svg"
          alt=""
          width={48}
          height={39}
          className={symbolClassName}
          priority={priority}
        />
      </motion.div>

      <motion.span
        initial={{ opacity: 0, x: -14, letterSpacing: "0.35em" }}
        animate={{
          opacity: 1,
          x: 0,
          letterSpacing: animateLetterSpacingTo,
          textShadow: [
            "0 0 0 rgba(214,181,133,0)",
            "0 0 22px rgba(214,181,133,0.42)",
            "0 0 0 rgba(214,181,133,0)",
          ],
        }}
        transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
        className={titleClassName}
      >
        {title}
      </motion.span>
    </motion.div>
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
