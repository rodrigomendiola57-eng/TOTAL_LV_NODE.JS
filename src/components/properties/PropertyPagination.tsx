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
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/10 bg-tl-black/60 px-3 font-outfit font-light text-xs uppercase tracking-[0.12em] text-tl-beige/85 transition-colors hover:border-tl-gold/40 hover:text-tl-gold disabled:pointer-events-none disabled:opacity-35";

const pageButtonClassName =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border font-outfit font-light text-sm transition-colors";

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
      <p className="mb-5 text-center font-outfit font-light text-xs text-tl-beige/55">
        Mostrando {rangeStart}–{rangeEnd} de {totalCount} propiedades
      </p>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="flex w-full items-center justify-between gap-3 sm:hidden">
          {page > 1 ? (
            <Link
              href={buildCatalogHref(basePath, previousState)}
              className={navButtonClassName}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Link>
          ) : (
            <span className={navButtonClassName} aria-disabled="true">
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
              className={navButtonClassName}
              aria-label="Página siguiente"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className={navButtonClassName} aria-disabled="true">
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
                    ? "border-tl-gold bg-tl-gold text-tl-black"
                    : "border-white/10 bg-tl-black/60 text-tl-beige/85 hover:border-tl-gold/40 hover:text-tl-gold"
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
