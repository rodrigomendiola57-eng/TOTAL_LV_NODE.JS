"use client";

import {
  buildCatalogHref,
  getVisiblePageNumbers,
  type CatalogQueryState,
} from "@/lib/property-catalog-params";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PropertyPaginationProps {
  basePath: string;
  catalogState: CatalogQueryState;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

const navButtonClassName =
  "inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-transparent text-tl-beige/65 transition-all duration-300 hover:border-tl-gold/45 hover:text-tl-gold disabled:pointer-events-none disabled:opacity-20";

const mobileNavButtonClassName =
  "inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-transparent px-5 font-outfit font-light text-sm uppercase tracking-[0.14em] text-tl-beige/85 transition-all duration-300 hover:border-tl-gold/40 hover:text-tl-gold disabled:pointer-events-none disabled:opacity-25";

const pageButtonClassName =
  "inline-flex h-12 w-12 items-center justify-center rounded-full border font-outfit font-light text-base tracking-[0.02em] transition-all duration-300";

export function PropertyPagination({
  basePath,
  catalogState,
  totalPages,
  totalCount,
  pageSize,
}: PropertyPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const { page } = catalogState;
  const previousState = { ...catalogState, page: Math.max(1, page - 1) };
  const nextState = { ...catalogState, page: Math.min(totalPages, page + 1) };
  const pageNumbers = getVisiblePageNumbers(page, totalPages);

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalCount);

  return (
    <nav
      className="mt-12 border-t border-white/10 pt-8"
      aria-label="Paginación de propiedades"
    >
      <p className="mb-6 text-center font-outfit font-light text-sm tracking-[0.08em] text-tl-beige/70 uppercase">
        Mostrando {rangeStart}–{rangeEnd} de {totalCount} propiedades
      </p>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="flex w-full items-center justify-between gap-3 sm:hidden">
          {page > 1 ? (
            <Link
              href={buildCatalogHref(basePath, previousState)}
              className={mobileNavButtonClassName}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Link>
          ) : (
            <span className={mobileNavButtonClassName} aria-disabled="true">
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </span>
          )}

          <span className="font-outfit font-light text-sm text-tl-beige/75">
            {page} / {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={buildCatalogHref(basePath, nextState)}
              className={mobileNavButtonClassName}
              aria-label="Página siguiente"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className={mobileNavButtonClassName} aria-disabled="true">
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {page > 1 ? (
            <Link
              href={buildCatalogHref(basePath, previousState)}
              className={navButtonClassName}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span className={navButtonClassName} aria-disabled="true">
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}

          {pageNumbers.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-1 font-outfit font-light text-sm text-tl-beige/40"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              <Link
                key={item}
                href={buildCatalogHref(basePath, { ...catalogState, page: item })}
                aria-label={`Ir a la página ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={`${pageButtonClassName} ${
                  item === page
                    ? "border-tl-gold text-tl-gold bg-transparent shadow-[0_0_14px_rgba(214,181,133,0.15)] font-normal"
                    : "border-transparent bg-transparent text-tl-beige/60 hover:text-tl-gold"
                }`}
              >
                {item}
              </Link>
            ),
          )}

          {page < totalPages ? (
            <Link
              href={buildCatalogHref(basePath, nextState)}
              className={navButtonClassName}
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className={navButtonClassName} aria-disabled="true">
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
