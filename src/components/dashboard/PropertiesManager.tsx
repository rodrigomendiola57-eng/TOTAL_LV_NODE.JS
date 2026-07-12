"use client";

import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { PropertiesFiltersBar } from "@/components/dashboard/PropertiesFiltersBar";
import { PropertiesTable } from "@/components/dashboard/PropertiesTable";
import { PropertyFormModal } from "@/components/dashboard/PropertyFormModal";
import { deleteProperty, getPropertyById } from "@/lib/api";
import {
  DEFAULT_PROPERTY_DASHBOARD_FILTERS,
  filterDashboardProperties,
  getDashboardZoneOptions,
  hasActiveDashboardFilters,
} from "@/lib/property-dashboard-filters";
import type { Property } from "@/types/property";
import { Loader2, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const PropertyForm = dynamic(
  () =>
    import("@/app/dashboard/propiedades/PropertyForm").then(
      (module) => module.PropertyForm,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center font-outfit text-sm text-tl-beige/50">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-tl-gold" />
        Cargando formulario…
      </div>
    ),
  },
);

interface PropertiesManagerProps {
  properties: Property[];
  title?: string;
  description?: string;
}

export function PropertiesManager({
  properties,
  title = "Gestión de Propiedades",
  description = "Administra el catálogo inmobiliario de Total Living.",
}: PropertiesManagerProps) {
  const router = useRouter();
  const [filters, setFilters] = useState(DEFAULT_PROPERTY_DASHBOARD_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const zoneOptions = useMemo(() => getDashboardZoneOptions(properties), [properties]);

  const filteredProperties = useMemo(
    () => filterDashboardProperties(properties, filters),
    [properties, filters],
  );

  function openCreateForm() {
    setEditingProperty(null);
    setEditError(null);
    setFormOpen(true);
  }

  async function openEditForm(property: Property) {
    setEditError(null);
    setLoadingEdit(true);
    setFormOpen(true);
    setEditingProperty(null);
    try {
      const full = await getPropertyById(String(property.id));
      setEditingProperty(full ?? property);
    } catch {
      setEditingProperty(property);
      setEditError(
        "No se pudo cargar el detalle completo; se abrirá con datos del listado.",
      );
    } finally {
      setLoadingEdit(false);
    }
  }

  function closeForm() {
    setFormOpen(false);
    setEditingProperty(null);
    setEditError(null);
    setLoadingEdit(false);
  }

  async function handleDelete() {
    if (!deletingProperty) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteProperty(deletingProperty.id);
      setDeletingProperty(null);
      router.refresh();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "No se pudo eliminar la propiedad.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-outfit font-light text-[10px] uppercase tracking-[0.22em] text-tl-gold">
            Catálogo
          </p>
          <h1 className="mt-2 font-outfit text-4xl font-extralight text-tl-beige">{title}</h1>
          <p className="mt-2 max-w-2xl font-outfit font-light text-sm text-tl-beige/65">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-full bg-tl-gold px-5 py-3 font-outfit font-light text-xs uppercase tracking-[0.16em] text-tl-black shadow-[0_0_24px_rgba(214,181,133,0.2)] transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nueva Propiedad
        </button>
      </div>

      <PropertiesFiltersBar
        filters={filters}
        zoneOptions={zoneOptions}
        resultCount={filteredProperties.length}
        totalCount={properties.length}
        onChange={setFilters}
      />

      {deleteError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-950/25 px-4 py-3 font-outfit font-light text-sm text-red-300">
          {deleteError}
        </p>
      ) : null}

      <PropertiesTable
        properties={filteredProperties}
        onEdit={(property) => {
          void openEditForm(property);
        }}
        onDelete={setDeletingProperty}
        emptyMessage={
          properties.length === 0
            ? 'No hay propiedades registradas. Crea la primera con el botón "Nueva Propiedad".'
            : hasActiveDashboardFilters(filters)
              ? "No hay propiedades que coincidan con los filtros seleccionados."
              : undefined
        }
      />

      <PropertyFormModal open={formOpen} onClose={closeForm}>
        {loadingEdit ? (
          <div className="flex h-64 items-center justify-center font-outfit text-sm text-tl-beige/50">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-tl-gold" />
            Cargando propiedad…
          </div>
        ) : (
          <>
            {editError ? (
              <p className="mb-4 rounded-xl border border-tl-gold/25 bg-tl-gold/5 px-4 py-3 font-outfit text-xs text-tl-beige/70">
                {editError}
              </p>
            ) : null}
            <PropertyForm
              key={editingProperty?.id ?? "new"}
              property={editingProperty ?? undefined}
              onClose={closeForm}
              onSuccess={closeForm}
            />
          </>
        )}
      </PropertyFormModal>

      <ConfirmDialog
        open={Boolean(deletingProperty)}
        title="Eliminar propiedad"
        description={
          deletingProperty
            ? `¿Seguro que deseas eliminar "${deletingProperty.title}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeletingProperty(null);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
