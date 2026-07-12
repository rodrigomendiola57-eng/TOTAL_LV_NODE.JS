"use client";

import { ZoneForm } from "@/components/dashboard/zonas/ZoneForm";
import {
  deleteZoneApi,
  listZonesApi,
  type ZoneApiModel,
} from "@/lib/api/zones";
import { resolveMediaUrl } from "@/lib/media-url";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ZonesCatalogManagerProps {
  initialRows?: ZoneApiModel[];
}

export function ZonesCatalogManager({
  initialRows = [],
}: ZonesCatalogManagerProps) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editing, setEditing] = useState<ZoneApiModel | null>(null);
  const [query, setQuery] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listZonesApi({ all: true, revalidate: false });
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.slug.toLowerCase().includes(q) ||
        row.growth_label.toLowerCase().includes(q),
    );
  }, [query, rows]);

  const publishedCount = rows.filter((row) => row.is_published).length;

  function openCreate() {
    setEditing(null);
    setMode("create");
    setError(null);
  }

  function openEdit(row: ZoneApiModel) {
    setEditing(row);
    setMode("edit");
    setError(null);
  }

  function backToList() {
    setMode("list");
    setEditing(null);
  }

  function handleSaved(row: ZoneApiModel) {
    setRows((current) => {
      const index = current.findIndex((item) => item.id === row.id);
      if (index === -1) {
        return [...current, row].sort((a, b) => a.order - b.order);
      }
      const next = [...current];
      next[index] = { ...next[index], ...row };
      return next.sort((a, b) => a.order - b.order);
    });
    setEditing(row);
    setMode("list");
    router.refresh();
  }

  async function handleDelete(slug: string) {
    if (!window.confirm("¿Eliminar esta zona del catálogo público?")) return;
    setError(null);
    try {
      await deleteZoneApi(slug);
      setRows((current) => current.filter((row) => row.slug !== slug));
      if (editing?.slug === slug) backToList();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar");
    }
  }

  if (mode === "create" || mode === "edit") {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-outfit text-[10px] uppercase tracking-[0.22em] text-tl-gold/80">
              Catálogo
            </p>
            <h2 className="mt-2 font-outfit text-3xl font-extralight text-tl-beige sm:text-4xl">
              {mode === "create" ? "Nueva zona" : "Editar zona"}
            </h2>
            {editing ? (
              <p className="mt-2 font-outfit text-sm font-light text-tl-beige/50">
                {editing.name}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={backToList}
            className="font-outfit text-xs uppercase tracking-[0.14em] text-tl-beige/50 transition-colors hover:text-tl-gold"
          >
            ← Volver al listado
          </button>
        </div>

        <div className="rounded-[1.35rem] border border-tl-gold/20 bg-[linear-gradient(165deg,rgba(214,181,133,0.06),rgba(10,10,10,0.92)_40%)] p-5 sm:p-7">
          <ZoneForm
            initial={editing}
            onSaved={handleSaved}
            onCancel={backToList}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-outfit text-[10px] uppercase tracking-[0.22em] text-tl-gold/80">
            Catálogo
          </p>
          <h2 className="mt-2 font-outfit text-3xl font-extralight text-tl-beige sm:text-4xl">
            Zonas
          </h2>
          <p className="mt-2 font-outfit text-sm font-light text-tl-beige/55">
            {publishedCount} publicadas · {rows.length} en total
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-beige/70 transition-colors hover:border-tl-gold/35 hover:text-tl-gold disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
            )}
            Actualizar
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-tl-gold bg-tl-gold px-4 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-black"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Agregar zona
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar zona…"
          className="w-full max-w-md rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 font-outfit text-sm font-light text-tl-beige outline-none placeholder:text-tl-beige/30 focus:border-tl-gold/40"
        />
        {query ? (
          <p className="font-outfit text-[11px] text-tl-beige/40">
            {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 font-outfit text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {filtered.length === 0 && !loading ? (
        <div className="rounded-[1.35rem] border border-dashed border-white/12 px-6 py-16 text-center">
          <p className="font-outfit text-2xl font-extralight text-tl-beige">
            {query ? "Sin coincidencias" : "Aún no hay zonas"}
          </p>
          <p className="mt-2 font-outfit text-sm font-light text-tl-beige/45">
            {query
              ? "Prueba con otro término de búsqueda."
              : "Crea la primera zona del catálogo público."}
          </p>
          {!query ? (
            <button
              type="button"
              onClick={openCreate}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-tl-gold bg-tl-gold px-5 py-2.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-black"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar zona
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((row) => {
            const image =
              resolveMediaUrl(row.image_url) ||
              row.image_external_url ||
              row.image_url;

            return (
              <article
                key={row.id}
                className="group overflow-hidden rounded-[1.25rem] border border-tl-gold/15 bg-[#0a0a0a]/70 transition-colors hover:border-tl-gold/40"
              >
                <button
                  type="button"
                  onClick={() => openEdit(row)}
                  className="block w-full text-left"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#141412]">
                    {image ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.04]"
                        style={{ backgroundImage: `url('${image}')` }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center font-outfit text-[10px] uppercase tracking-[0.16em] text-tl-beige/30">
                        Sin imagen
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 font-outfit text-[9px] uppercase tracking-[0.14em] backdrop-blur-sm",
                          row.is_published
                            ? "border-tl-gold/40 bg-tl-black/40 text-tl-gold"
                            : "border-white/20 bg-tl-black/40 text-tl-beige/55",
                        )}
                      >
                        {row.is_published ? "Publicada" : "Borrador"}
                      </span>
                      <span className="rounded-full border border-white/15 bg-tl-black/40 px-2.5 py-1 font-outfit text-[9px] uppercase tracking-[0.14em] text-tl-beige/70 backdrop-blur-sm">
                        #{row.order}
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="font-outfit text-[10px] uppercase tracking-[0.16em] text-tl-gold/85">
                        {row.growth_label}
                      </p>
                      <h3 className="mt-1 line-clamp-2 font-outfit text-2xl font-extralight leading-tight text-tl-beige">
                        {row.name}
                      </h3>
                    </div>
                  </div>
                </button>

                <div className="flex items-center justify-between gap-2 border-t border-white/6 px-3 py-3">
                  <p className="truncate font-outfit text-[11px] text-tl-beige/35">
                    /{row.slug}
                  </p>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/zonas#${row.slug}`}
                      target="_blank"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-tl-beige/50 transition-colors hover:border-tl-gold/35 hover:text-tl-gold"
                      aria-label="Ver en sitio"
                    >
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-tl-beige/50 transition-colors hover:border-tl-gold/35 hover:text-tl-gold"
                      aria-label="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(row.slug)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-tl-beige/50 transition-colors hover:border-red-400/40 hover:text-red-300"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
