"use client";

import { BrandLogoAnimated } from "@/components/layout/BrandLogoAnimated";
import { cn } from "@/lib/utils";
import {
  Building2,
  BriefcaseBusiness,
  Home,
  Landmark,
  LayoutDashboard,
  MapPin,
  Menu,
  MessagesSquare,
  Phone,
  Settings,
  Users,
  X,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useState,
  useTransition,
  type ReactNode,
} from "react";

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/inicio", label: "Inicio", icon: Home },
  { href: "/dashboard/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/dashboard/desarrollos", label: "Desarrollos", icon: Landmark },
  { href: "/dashboard/zonas", label: "Zonas", icon: MapPin },
  { href: "/dashboard/nosotros", label: "Nosotros", icon: Users },
  { href: "/dashboard/asesoria", label: "Asesoría", icon: BriefcaseBusiness },
  { href: "/dashboard/contacto", label: "Contacto", icon: Phone },
  { href: "/dashboard/crm", label: "CRM", icon: MessagesSquare },
  { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
];

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isPending, startTransition] = useTransition();
  const panelId = useId();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    closeMenu();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* igual redirigimos */
    }
    router.replace("/login");
    router.refresh();
  }

  useEffect(() => {
    closeMenu();
    // Tras navegar entre módulos, subir al inicio y liberar el scroll
    // (el drawer móvil pone overflow:hidden y el Link usa preventDefault).
    document.body.style.overflow = "";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous || "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  function navigateTo(href: string) {
    closeMenu();
    document.body.style.overflow = "";
    if (pathname === href) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <>
      {/* Barra superior móvil */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b border-tl-gold/15 bg-[#0a0a0a]/95 lg:hidden",
          "pt-[env(safe-area-inset-top,0px)]",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Link
            href="/dashboard"
            className="flex min-w-0 items-center gap-2"
            aria-label="Total Living — Panel Admin"
          >
            <BrandLogoAnimated
              animationKey="dashboard-mobile-top"
              innerClassName="relative flex min-w-0 flex-nowrap items-center gap-2 overflow-visible"
              symbolClassName="h-7 w-auto shrink-0 opacity-95"
              title="TOTAL LIVING"
              titleClassName="relative top-[0.12em] min-w-0 whitespace-nowrap font-cormorant text-[1.05rem] font-light leading-none tracking-[0.05em] text-tl-beige"
              animateLetterSpacingFrom="0.1em"
              animateLetterSpacingTo="0.05em"
            />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-tl-gold/25 text-tl-beige transition-colors active:bg-tl-gold/10"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls={panelId}
          >
            {menuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </header>

      {/* Overlay móvil */}
      <button
        type="button"
        aria-label="Cerrar menú"
        onClick={closeMenu}
        className={cn(
          "fixed inset-0 z-40 bg-black/70 transition-opacity lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Navegación: drawer en móvil, sidebar fijo en desktop */}
      <aside
        id={panelId}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r border-tl-gold/15 bg-tl-black",
          "pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]",
          "transition-transform duration-300 ease-out",
          "lg:translate-x-0 lg:w-64",
          menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="border-b border-tl-gold/15 px-5 py-5 lg:py-6">
          <div className="flex items-start justify-between gap-3">
            <BrandLogoAnimated
              animationKey="dashboard-sidebar"
              href="/dashboard"
              wrapperClassName="block min-w-0"
              innerClassName="relative flex min-w-0 flex-nowrap items-center gap-2.5 overflow-visible"
              symbolClassName="h-8 w-auto shrink-0 opacity-95 sm:h-10"
              title="TOTAL LIVING"
              titleClassName="relative top-[0.2em] min-w-0 whitespace-nowrap font-cormorant text-[1.2rem] font-light leading-none tracking-[0.06em] text-tl-beige lg:text-[1.35rem]"
              animateLetterSpacingFrom="0.14em"
              animateLetterSpacingTo="0.06em"
              onClick={closeMenu}
            />
            <button
              type="button"
              onClick={closeMenu}
              className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-tl-beige/70 lg:hidden"
              aria-label="Cerrar menú"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div
            aria-hidden
            className="mt-4 h-px w-full bg-gradient-to-r from-tl-gold/70 via-tl-gold/55 to-tl-gold/25"
          />

          <p className="mt-3.5 text-center font-outfit text-[0.8rem] font-light uppercase tracking-[0.32em] text-tl-beige/90">
            Panel Admin
          </p>

          {isPending ? (
            <p className="mt-2 text-center font-outfit text-[10px] uppercase tracking-[0.16em] text-tl-gold/70">
              Cargando módulo…
            </p>
          ) : null}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                prefetch
                onClick={(event) => {
                  if (
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey ||
                    event.button !== 0
                  ) {
                    return;
                  }
                  event.preventDefault();
                  navigateTo(href);
                }}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 font-outfit text-sm font-light transition-colors",
                  isActive
                    ? "bg-tl-gold/15 text-tl-gold"
                    : "text-tl-beige/70 active:bg-tl-olive/30 active:text-tl-beige lg:hover:bg-tl-olive/30 lg:hover:text-tl-beige",
                  isPending && !isActive && "opacity-60",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-tl-gold/15 px-4 py-4 lg:py-5">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 font-outfit text-xs font-light uppercase tracking-[0.14em] text-tl-beige/70 transition-colors hover:border-tl-gold/30 hover:text-tl-gold disabled:opacity-60"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            {loggingOut ? "Saliendo…" : "Cerrar sesión"}
          </button>
          <p className="mt-3 text-center font-outfit text-[10px] font-light uppercase tracking-[0.2em] text-tl-beige/40">
            CRM & Catálogo · v0.1
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <main
          className={cn(
            "min-h-screen",
            "px-4 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pt-[calc(3.5rem+env(safe-area-inset-top,0px)+0.75rem)]",
            "sm:px-5",
            "lg:p-8 lg:pt-8",
          )}
        >
          {children}
        </main>
      </div>
    </>
  );
}
