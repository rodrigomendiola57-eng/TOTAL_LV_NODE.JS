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
  { label: "Asesoría", href: "/#asesoria" },
  { label: "Contacto", href: "/contacto" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto shrink-0 overflow-hidden border-t border-tl-gold/15 bg-[#141412]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(74,78,56,0.45),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tl-gold/35 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr_1fr] lg:gap-10">
          <div className="max-w-md">
            <Link href="/#inicio" className="inline-flex items-center gap-3">
              <Image
                src="/logo-symbol.svg"
                alt=""
                width={40}
                height={40}
                className="h-10 w-auto opacity-95"
              />
              <span className="font-cormorant text-2xl font-light tracking-[0.06em] text-tl-beige sm:text-[1.75rem]">
                TOTAL LIVING
              </span>
            </Link>
            <p className="mt-5 font-outfit text-sm font-light leading-relaxed text-tl-beige/65">
              Firma inmobiliaria premium en Querétaro. Estrategia real detrás de
              cada propiedad.
            </p>
            <Link
              href="/contacto"
              className="mt-7 inline-flex min-h-11 items-center rounded-full border border-tl-gold/50 px-6 py-2.5 font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-gold transition-colors hover:bg-tl-gold hover:text-tl-black sm:text-[11px]"
            >
              Hablar con un asesor
            </Link>
          </div>

          <div>
            <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/80">
              Propiedades
            </p>
            <ul className="mt-5 space-y-3" role="list">
              {PROPERTY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-outfit text-sm font-light text-tl-beige/70 transition-colors hover:text-tl-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/80">
              Empresa
            </p>
            <ul className="mt-5 space-y-3" role="list">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-outfit text-sm font-light text-tl-beige/70 transition-colors hover:text-tl-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-8 border-t border-white/[0.06] pt-8 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap items-center gap-3" role="list">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-tl-beige/75 transition-colors hover:border-tl-gold/40 hover:text-tl-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>

          <p className="font-outfit text-xs font-light tracking-[0.04em] text-tl-beige/45">
            © {year} Total Living. Querétaro, México.
          </p>
        </div>
      </div>
    </footer>
  );
}
