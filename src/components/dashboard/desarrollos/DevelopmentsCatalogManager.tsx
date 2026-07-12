"use client";

import { DevelopmentForm } from "@/components/dashboard/desarrollos/DevelopmentForm";
import {
  deleteDevelopmentApi,
  listDevelopmentsApi,
  type DevelopmentApiModel,
} from "@/lib/api/developments";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface DevelopmentsCatalogManagerProps {
  initialRows?: DevelopmentApiModel[];
}

export function DevelopmentsCatalogManager({
  initialRows = [],
}: DevelopmentsCatalogManagerProps) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editing, setEditing] = useState<DevelopmentApiModel | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listDevelopmentsApi();
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialRows.length === 0) {
      void refresh();
    }
  }, [initialRows.length, refresh]);

  function openCreate() {
    setEditing(null);
    setMode("create");
    setError(null);
  }

  function openEdit(row: DevelopmentApiModel) {
    setEditing(row);
    setMode("edit");
    setError(null);
  }

  function handleSaved(row: DevelopmentApiModel) {
    setRows((current) => {
      const index = current.findIndex((item) => item.id === row.id);
      if (index === -1) return [row, ...current];
      const next = [...current];
      next[index] = { ...next[index], ...row };
      return next;
    });
    setEditing(row);
    router.refresh();
  }

  async function handleDelete(slug: string) {
    if (!window.confirm("¿Eliminar este desarrollo y todos sus modelos?")) {
      return;
    }
    setError(null);
    try {
      await deleteDevelopmentApi(slug);
      await refresh();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar");
    }
  }

  if (mode === "create" || mode === "edit") {
    return (
      <DevelopmentForm
        mode={mode}
        initialSlug={editing?.slug ?? null}
        initialRow={editing}
        onCancel={() => {
          setMode("list");
          setEditing(null);
          void refresh();
        }}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-outfit text-[10px] uppercase tracking-[0.2em] text-tl-gold/80">
            Catálogo
          </p>
          <h2 className="mt-1 font-outfit text-3xl font-extralight text-tl-beige sm:text-4xl">
            Desarrollos
          </h2>
          <p className="mt-2 max-w-xl font-outfit text-sm font-light text-tl-beige/55">
            Alta y edición con modelos, fotos y ubicación.{" "}
            {rows.length} registro{rows.length === 1 ? "" : "s"} en base de
            datos.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-tl-gold px-5 py-2.5 font-outfit text-xs uppercase tracking-[0.14em] text-tl-black"
        >
          <Plus className="h-4 w-4" />
          Agregar desarrollo
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-outfit text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-tl-gold" />
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-tl-gold/25 bg-white/[0.02] px-6 py-16 text-center">
          <p className="font-outfit text-2xl font-extralight text-tl-beige">
            Empieza tu portafolio
          </p>
          <p className="mx-auto mt-2 max-w-md font-outfit text-sm font-light text-tl-beige/55">
            Crea el primer desarrollo: datos, mapa, fotos y tipologías con su
            propia galería.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-tl-gold px-5 py-2.5 font-outfit text-xs uppercase tracking-[0.14em] text-tl-black"
          >
            <Plus className="h-4 w-4" />
            Crear desarrollo
          </button>
        </div>
      ) : (
        <ul className="grid gap-4">
          {rows.map((row) => {
            const cover =
              resolveMediaUrl(row.cover_image_url) ||
              row.cover_image_url ||
              row.cover_image_external_url ||
              "";
            return (
              <li
                key={row.id}
                className="overflow-hidden rounded-2xl border border-tl-gold/15 bg-[#0a0a0a]/80 transition-colors hover:border-tl-gold/30"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-40 w-full shrink-0 bg-tl-black sm:h-auto sm:w-44">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt=""
                        className="h-full w-full object-cover sm:absolute sm:inset-0"
                      />
                    ) : (
                      <div className="flex h-full min-h-40 items-center justify-center font-outfit text-xs text-tl-beige/30">
                        Sin portada
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-outfit text-2xl font-extralight text-tl-beige">
                          {row.name}
                        </h3>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 font-outfit text-[10px] uppercase tracking-[0.12em]",
                            row.is_published
                              ? "bg-tl-olive/20 text-tl-beige/80"
                              : "bg-tl-beige/10 text-tl-beige/45",
                          )}
                        >
                          {row.is_published ? "Publicado" : "Borrador"}
                        </span>
                        {row.featured ? (
                          <span className="rounded-full bg-tl-gold/15 px-2.5 py-0.5 font-outfit text-[10px] uppercase tracking-[0.12em] text-tl-gold">
                            Destacado
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 font-outfit text-sm font-light text-tl-beige/55">
                        {row.status}
                        {row.zone ? ` · ${row.zone}` : ""}
                        {row.models_count != null
                          ? ` · ${row.models_count} modelo${row.models_count === 1 ? "" : "s"}`
                          : ""}
                      </p>
                      {row.tagline ? (
                        <p className="mt-2 line-clamp-2 font-outfit text-xs font-light text-tl-beige/40">
                          {row.tagline}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/propiedades/desarrollos/${row.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 rounded-full border border-tl-gold/25 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.12em] text-tl-beige/70"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Ver
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-tl-gold/40 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.12em] text-tl-gold"
                      >
                        <Pencil className="h-3 w-3" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(row.slug)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-[0.12em] text-red-300/80"
                      >
                        <Trash2 className="h-3 w-3" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
