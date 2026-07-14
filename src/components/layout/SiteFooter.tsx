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

      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr_1fr] lg:gap-10 lg:gap-y-0">
          {/* Marca */}
          <div className="max-w-md">
            <Link href="/#inicio" className="inline-flex items-center gap-2.5 sm:gap-3">
              <Image
                src="/logo-symbol.svg"
                alt=""
                width={40}
                height={40}
                className="h-9 w-auto opacity-95 sm:h-10"
              />
              <span className="font-cormorant text-[1.35rem] font-light tracking-[0.08em] text-tl-beige sm:text-2xl sm:tracking-[0.06em] lg:text-[1.75rem]">
                TOTAL LIVING
              </span>
            </Link>
            <p className="mt-3 font-outfit text-[13px] font-light leading-relaxed text-tl-beige/60 sm:mt-5 sm:text-sm sm:text-tl-beige/65">
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
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-tl-gold/55 px-6 py-3 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-gold transition-colors active:bg-tl-gold active:text-tl-black sm:mt-7 sm:min-h-11 sm:w-auto sm:justify-start sm:py-2.5 sm:hover:bg-tl-gold sm:hover:text-tl-black"
            >
              Hablar con un asesor
            </Link>
          </div>

          {/* Links — 2 cols en móvil */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-0 border-t border-white/[0.07] pt-7 lg:col-span-2 lg:grid-cols-2 lg:gap-10 lg:border-0 lg:pt-0">
            <div>
              <p className="font-outfit text-[10px] font-light uppercase tracking-[0.2em] text-tl-gold/85">
                Propiedades
              </p>
              <ul className="mt-3 space-y-0.5 sm:mt-5 sm:space-y-3" role="list">
                {PROPERTY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center font-outfit text-sm font-light text-tl-beige/75 transition-colors active:text-tl-gold sm:min-h-0 sm:hover:text-tl-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-outfit text-[10px] font-light uppercase tracking-[0.2em] text-tl-gold/85">
                Empresa
              </p>
              <ul className="mt-3 space-y-0.5 sm:mt-5 sm:space-y-3" role="list">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center font-outfit text-sm font-light text-tl-beige/75 transition-colors active:text-tl-gold sm:min-h-0 sm:hover:text-tl-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-col items-center gap-5 border-t border-white/[0.07] pt-7 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:pt-8 lg:mt-14">
          <ul
            className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start sm:gap-3"
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
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-tl-beige/70 transition-colors active:border-tl-gold/40 active:text-tl-gold sm:h-11 sm:w-11 sm:hover:border-tl-gold/40 sm:hover:text-tl-gold"
                >
                  <Icon className="h-[1.05rem] w-[1.05rem]" />
                </a>
              </li>
              );
            })}
          </ul>

          <p className="text-center font-outfit text-[11px] font-light tracking-[0.04em] text-tl-beige/40 sm:text-left sm:text-xs sm:text-tl-beige/45">
            © {year} Total Living · Querétaro, México
          </p>
        </div>
      </div>
    </footer>
  );
}
