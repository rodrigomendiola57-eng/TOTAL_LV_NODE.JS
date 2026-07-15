import { SOCIAL_LINKS } from "@/lib/social-links";
import Image from "next/image";
import Link from "next/link";

const PROPERTY_LINKS = [
  { label: "Venta", href: "/propiedades/venta" },
  { label: "Renta", href: "/propiedades/renta" },
  { label: "Desarrollos", href: "/propiedades/desarrollos" },
] as const;

const COMPANY_LINKS = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Zonas", href: "/zonas" },
  { label: "Asesoría", href: "/asesoria" },
  { label: "Contacto", href: "/contacto" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto shrink-0 overflow-hidden border-t border-tl-gold/15 bg-[#141412] pb-[env(safe-area-inset-bottom,0px)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(74,78,56,0.45),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tl-gold/35 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr_1fr] lg:gap-10 lg:gap-y-0">
          {/* Marca */}
          <div className="max-w-md">
            <Link href="/#inicio" className="inline-flex items-center gap-4 sm:gap-5">
              <Image
                src="/logo-symbol.svg"
                alt="Total Living — Inmobiliaria Premium en Querétaro"
                width={80}
                height={80}
                className="h-16 w-auto opacity-95 sm:h-20"
              />
              <span className="whitespace-nowrap font-cormorant text-2xl font-light tracking-[0.14em] text-tl-beige sm:text-3xl lg:text-4xl">
                TOTAL LIVING
              </span>
            </Link>
            <p className="mt-4 font-outfit text-sm font-light leading-relaxed text-white/90 sm:mt-5 sm:text-base">
              <span className="sm:hidden">
                Firma inmobiliaria premium en Querétaro.
              </span>
              <span className="hidden sm:inline">
                Firma inmobiliaria premium en Querétaro. Estrategia real detrás
                de cada propiedad.
              </span>
            </p>
            <Link
              href="/contacto"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/20 px-6 py-3 font-outfit text-xs font-normal uppercase tracking-[0.18em] text-white transition-colors active:bg-white active:text-tl-black sm:mt-6 sm:min-h-10 sm:w-auto sm:justify-start sm:py-2 sm:hover:bg-white sm:hover:text-tl-black"
            >
              Hablar con un asesor
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-0 border-t border-white/[0.07] pt-7 lg:col-span-2 lg:grid-cols-2 lg:gap-10 lg:border-0 lg:pt-0">
            <div>
              <p className="font-outfit text-sm font-medium uppercase tracking-[0.24em] text-tl-gold">
                Propiedades
              </p>
              <ul className="mt-4 space-y-1 sm:mt-6 sm:space-y-4" role="list">
                {PROPERTY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center font-outfit text-lg font-light tracking-[0.03em] text-white/90 transition-colors active:text-white/80 sm:min-h-0 sm:hover:text-tl-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-outfit text-sm font-medium uppercase tracking-[0.24em] text-tl-gold">
                Empresa
              </p>
              <ul className="mt-4 space-y-1 sm:mt-6 sm:space-y-4" role="list">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center font-outfit text-lg font-light tracking-[0.03em] text-white/90 transition-colors active:text-white/80 sm:min-h-0 sm:hover:text-tl-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-center gap-5 border-t border-white/[0.07] pt-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:pt-6 lg:mt-10">
          <ul
            className="flex flex-wrap items-center justify-center gap-3.5 sm:justify-start sm:gap-4"
            role="list"
          >
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => {
              const external = href.startsWith("http");
              return (
              <li key={label}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 text-white transition-colors active:border-white/40 active:text-white/80 sm:h-16 sm:w-16 sm:hover:border-white/40 sm:hover:text-white"
                >
                  <Icon className="h-7 w-7" />
                </a>
              </li>
              );
            })}
          </ul>

          <p className="text-center font-outfit text-[13px] font-light tracking-[0.04em] text-white/60 sm:text-left sm:text-sm">
            © {year} Total Living · Querétaro, México
          </p>
        </div>
      </div>
    </footer>
  );
}
