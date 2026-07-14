"use client";

import { LanguageMenu } from "@/components/i18n/LanguageMenu";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useMemo } from "react";
import { BrandLogoAnimated } from "@/components/layout/BrandLogoAnimated";
import { CompactNavbarBar } from "@/components/layout/MobileNavbarBar";
import { StaggeredMenu } from "@/components/layout/StaggeredMenu";
import {
  NAVBAR_FLOATING_CLASSES,
  NAVBAR_OVERLAY_CLASSES,
  shouldUseOverlayNavbar,
} from "@/lib/site-nav";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SCROLL_TOP_THRESHOLD = 8;
const SCROLL_DIRECTION_DELTA = 2;

const menuItems = [
  { label: "Inicio", ariaLabel: "Ir al inicio", link: "/#inicio" },
  { label: "Propiedades", ariaLabel: "Ver propiedades", link: "/#propiedades" },
  {
    label: "Asesoría inmobiliaria",
    ariaLabel: "Ver asesoría inmobiliaria",
    link: "/asesoria",
  },
  { label: "Zonas", ariaLabel: "Ver zonas", link: "/zonas" },
  { label: "Nosotros", ariaLabel: "Conócenos", link: "/nosotros" },
  { label: "Contacto", ariaLabel: "Contáctanos", link: "/contacto" },
];

const propertyLinks = [
  { label: "Propiedades en Venta", href: "/propiedades/venta" },
  { label: "Propiedades en Renta", href: "/propiedades/renta" },
  { label: "Desarrollos", href: "/propiedades/desarrollos" },
] as const;

interface NavLinkProps {
  href: string;
  label: string;
}

function NavLink({ href, label }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="group relative py-2 font-outfit text-[0.95rem] font-extralight tracking-[0.02em] text-tl-beige/90 transition-colors hover:text-tl-gold xl:text-lg"
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
        aria-expanded={isOpen}
        className="group relative inline-flex items-center gap-1 py-2 font-outfit text-[0.95rem] font-extralight tracking-[0.02em] text-tl-beige/90 transition-colors hover:text-tl-gold xl:text-lg"
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 xl:h-4 xl:w-4 ${
            isOpen ? "rotate-180 text-tl-gold" : ""
          }`}
          strokeWidth={1.25}
        />
        <span
          className={`absolute -bottom-0.5 left-0 h-px bg-tl-gold transition-all duration-300 ${
            isOpen ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3"
          >
            <div className="flex flex-col items-center gap-2.5 py-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap font-outfit text-[1.05rem] font-extralight tracking-[0.06em] text-tl-beige/70 transition-colors hover:text-tl-gold xl:text-lg"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const { locale } = useLocale();
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const [routeHash, setRouteHash] = useState("");
  const logoAnimationKey = `${pathname}${routeHash}`;
  const translatedMenuItems = useMemo(() => {
    if (locale !== "en") return menuItems;
    return [
      { label: "Home", ariaLabel: "Go to home", link: "/#inicio" },
      { label: "Properties", ariaLabel: "View properties", link: "/#propiedades" },
      {
        label: "Real Estate Advisory",
        ariaLabel: "View real estate advisory",
        link: "/asesoria",
      },
      { label: "Zones", ariaLabel: "View zones", link: "/zonas" },
      { label: "About Us", ariaLabel: "About us", link: "/nosotros" },
      { label: "Contact", ariaLabel: "Contact us", link: "/contacto" },
    ];
  }, [locale]);

  const translatedPropertyLinks = useMemo(() => {
    if (locale !== "en") return propertyLinks;
    return [
      { label: "Properties for Sale", href: "/propiedades/venta" },
      { label: "Properties for Rent", href: "/propiedades/renta" },
      { label: "Developments", href: "/propiedades/desarrollos" },
    ];
  }, [locale]);

  const isOverlayNav = shouldUseOverlayNavbar(pathname);

  useEffect(() => {
    const syncHash = () => setRouteHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    // Cierra el menú al cambiar de ruta.
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= SCROLL_TOP_THRESHOLD) {
        setSolid(false);
      } else if (currentY < lastScrollY.current - SCROLL_DIRECTION_DELTA) {
        setSolid(false);
      } else if (currentY > lastScrollY.current + SCROLL_DIRECTION_DELTA) {
        setSolid(true);
      }

      lastScrollY.current = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop (lg+ ≥1024): menú completo. Teléfonos e iPads en vertical quedan en compacto. */}
      <header className="fixed inset-x-0 top-0 z-[100] hidden lg:block">
        <motion.nav
          animate={{
            backgroundColor: solid
              ? "rgba(74, 78, 56, 0.94)"
              : "rgba(74, 78, 56, 0)",
            borderColor: solid
              ? "rgba(214, 181, 133, 0.18)"
              : "rgba(255, 255, 255, 0.07)",
          }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={`mx-auto flex items-center justify-between border ${
            isOverlayNav ? NAVBAR_OVERLAY_CLASSES : NAVBAR_FLOATING_CLASSES
          }`}
        >
          <Link href="/#inicio" className="flex shrink-0 items-center gap-2.5">
            <BrandLogoAnimated animationKey={logoAnimationKey} priority />
          </Link>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-5 px-3 xl:gap-10 xl:px-6">
            <NavLink href="/" label={locale === "en" ? "Home" : "Inicio"} />
            <NavDropdown
              label={locale === "en" ? "Properties" : "Propiedades"}
              links={translatedPropertyLinks}
              isOpen={propertyOpen}
              onOpen={() => setPropertyOpen(true)}
              onClose={() => setPropertyOpen(false)}
            />
            <NavLink href="/asesoria" label={locale === "en" ? "Real Estate Advisory" : "Asesoría inmobiliaria"} />
            <NavLink href="/zonas" label={locale === "en" ? "Zones" : "Zonas"} />
            <NavLink href="/nosotros" label={locale === "en" ? "About Us" : "Nosotros"} />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/contacto"
              className="rounded-full border border-tl-gold/70 px-4 py-2.5 font-outfit text-sm font-extralight uppercase tracking-[0.14em] text-tl-beige transition-all hover:bg-tl-gold/10 hover:shadow-[0_0_18px_rgba(214,181,133,0.28)] xl:px-6 xl:py-3 xl:text-base"
            >
              {locale === "en" ? "Contact" : "Contacto"}
            </Link>
            <LanguageMenu align="right" />
          </div>
        </motion.nav>
      </header>

      {/* Teléfono + iPad/tablet (< xl) */}
      <CompactNavbarBar
        open={menuOpen}
        onOpenMenu={() => setMenuOpen(true)}
        logoAnimationKey={logoAnimationKey}
      />

      <StaggeredMenu
        position="right"
        logoUrl="/logo-symbol.svg"
        brandTitle="TOTAL LIVING"
        items={translatedMenuItems}
        socialItems={SOCIAL_LINKS}
        propertySubItems={translatedPropertyLinks.map((item) => ({
          label: item.label,
          link: item.href,
        }))}
        displaySocials
        displayItemNumbering={false}
        showHeader={false}
        isOpen={menuOpen}
        onOpenChange={setMenuOpen}
        colors={["#4A4E38", "#D6B585"]}
        accentColor="#D6B585"
        closeOnClickAway
        className="lg:hidden"
      />
    </>
  );
}
