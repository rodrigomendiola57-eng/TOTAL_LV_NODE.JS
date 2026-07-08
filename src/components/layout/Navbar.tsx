"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BrandLogoAnimated } from "@/components/layout/BrandLogoAnimated";
import { MobileNavbarBar } from "@/components/layout/MobileNavbarBar";
import { StaggeredMenu } from "@/components/layout/StaggeredMenu";
import {
  NAVBAR_FLOATING_CLASSES,
  NAVBAR_OVERLAY_CLASSES,
  shouldUseOverlayNavbar,
} from "@/lib/site-nav";
import { SOCIAL_LINKS } from "@/lib/social-links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const mobileMenuItems = [
  { label: "Inicio", ariaLabel: "Ir al inicio", link: "/#inicio" },
  { label: "Propiedades", ariaLabel: "Ver propiedades", link: "/#propiedades" },
  {
    label: "Asesoría inmobiliaria",
    ariaLabel: "Ver asesoría inmobiliaria",
    link: "/#asesoria",
  },
  { label: "Zonas", ariaLabel: "Ver zonas", link: "/#zonas" },
  { label: "Nosotros", ariaLabel: "Conócenos", link: "/#nosotros" },
  { label: "Contacto", ariaLabel: "Contáctanos", link: "/#contacto" },
];

const mobileSocialItems = SOCIAL_LINKS;

const propertyLinks = [
  { label: "Propiedades en Venta", href: "/propiedades/venta" },
  { label: "Propiedades en Renta", href: "/propiedades/renta" },
  { label: "Desarrollos", href: "/propiedades/desarrollos" },
];

interface NavLinkProps {
  href: string;
  label: string;
}

function NavLink({ href, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="group relative py-2 font-outfit font-light text-[11px] uppercase tracking-[0.2em] text-tl-beige/90 transition-colors hover:text-tl-gold"
    >
      {label}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-tl-gold transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

interface NavDropdownProps {
  label: string;
  links: ReadonlyArray<NavLinkProps>;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function NavDropdown({ label, links, isOpen, onOpen, onClose }: NavDropdownProps) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        className="group relative inline-flex items-center gap-1.5 py-2 font-outfit font-light text-[11px] uppercase tracking-[0.2em] text-tl-beige/90 transition-colors hover:text-tl-gold"
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5" />
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-tl-gold transition-all duration-300 group-hover:w-full" />
      </button>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-10 min-w-56 rounded-xl border border-tl-gold/25 bg-tl-black/95 p-2 shadow-[0_18px_44px_rgba(0,0,0,0.45)] backdrop-blur-md"
          >
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 font-outfit font-light text-[11px] uppercase tracking-[0.16em] text-tl-beige/90 transition-colors hover:bg-tl-gold/10 hover:text-tl-gold"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const logoAnimationKey = pathname;
  const isOverlayNav = shouldUseOverlayNavbar(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showSolidNav = scrolled;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 hidden md:block">
        <motion.nav
        animate={{
          backgroundColor: showSolidNav
            ? "rgba(22, 22, 20, 0.9)"
            : "rgba(22, 22, 20, 0.08)",
          borderColor: showSolidNav
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(255, 255, 255, 0.06)",
        }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className={`mx-auto flex items-center justify-between border backdrop-blur-[2px] transition-[background-color,border-color] duration-300 ${
          isOverlayNav ? NAVBAR_OVERLAY_CLASSES : NAVBAR_FLOATING_CLASSES
        }`}
      >
        <Link
          href="/#inicio"
          className="flex shrink-0 items-center gap-2.5"
        >
          <BrandLogoAnimated
            animationKey={logoAnimationKey}
            priority
          />
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-6 px-6 lg:gap-8">
          <NavLink href="/" label="Inicio" />
          <NavDropdown
            label="Propiedades"
            links={propertyLinks}
            isOpen={propertyOpen}
            onOpen={() => setPropertyOpen(true)}
            onClose={() => setPropertyOpen(false)}
          />
          <NavLink href="/#asesoria" label="Asesoría inmobiliaria" />
          <NavLink href="/#zonas" label="Zonas" />
          <NavLink href="/#nosotros" label="Nosotros" />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/#contacto"
            className="rounded-full border border-tl-gold/70 px-5 py-2.5 font-outfit font-light text-[11px] uppercase tracking-[0.16em] text-tl-beige transition-all hover:bg-tl-gold/10 hover:shadow-[0_0_18px_rgba(214,181,133,0.28)]"
          >
            Contacto
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setLanguageOpen(true)}
            onMouseLeave={() => setLanguageOpen(false)}
          >
            <button
              type="button"
              className="group relative inline-flex items-center gap-1.5 py-2 font-outfit font-light text-[11px] uppercase tracking-[0.2em] text-tl-beige/90 transition-colors hover:text-tl-gold"
            >
              Idioma
              <ChevronDown className="h-3.5 w-3.5" />
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-tl-gold transition-all duration-300 group-hover:w-full" />
            </button>
            <AnimatePresence>
              {languageOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-10 min-w-32 rounded-xl border border-tl-gold/25 bg-tl-black/95 p-2 shadow-[0_18px_44px_rgba(0,0,0,0.45)] backdrop-blur-md"
                >
                  <button
                    type="button"
                    className="block w-full rounded-lg px-3 py-2.5 text-left font-outfit font-light text-[11px] uppercase tracking-[0.16em] text-tl-gold"
                  >
                    ES
                  </button>
                  <button
                    type="button"
                    className="block w-full rounded-lg px-3 py-2.5 text-left font-outfit font-light text-[11px] uppercase tracking-[0.16em] text-tl-beige/90 transition-colors hover:bg-tl-gold/10 hover:text-tl-gold"
                  >
                    EN
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

      </motion.nav>
      </header>

      <MobileNavbarBar
        open={mobileMenuOpen}
        onToggle={() => setMobileMenuOpen(true)}
        logoAnimationKey={logoAnimationKey}
      />

      <StaggeredMenu
        position="right"
        logoUrl="/logo-symbol.svg"
        brandTitle="TOTAL LIVING"
        items={mobileMenuItems}
        socialItems={mobileSocialItems}
        propertySubItems={propertyLinks.map((item) => ({
          label: item.label,
          link: item.href,
        }))}
        displaySocials
        displayItemNumbering={false}
        showHeader={false}
        isOpen={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        colors={["#4A4E38", "#D6B585"]}
        accentColor="#D6B585"
        closeOnClickAway={false}
        className="md:hidden"
      />
    </>
  );
}
