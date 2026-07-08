"use client";

import { PropertyForm } from "@/app/dashboard/propiedades/PropertyForm";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { PropertiesTable } from "@/components/dashboard/PropertiesTable";
import { PropertyFormModal } from "@/components/dashboard/PropertyFormModal";
import { deleteProperty } from "@/lib/api";
import type { Property } from "@/types/property";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [formOpen, setFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openCreateForm() {
    setEditingProperty(null);
    setFormOpen(true);
  }

  function openEditForm(property: Property) {
    setEditingProperty(property);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingProperty(null);
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
          <h1 className="mt-2 font-cormorant text-4xl font-light text-tl-beige">{title}</h1>
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

      {deleteError ? (
        <p className="rounded-xl border border-red-500/30 bg-red-950/25 px-4 py-3 font-outfit font-light text-sm text-red-300">
          {deleteError}
        </p>
      ) : null}

      <PropertiesTable
        properties={properties}
        onEdit={openEditForm}
        onDelete={setDeletingProperty}
      />

      <PropertyFormModal open={formOpen} onClose={closeForm}>
        <PropertyForm
          key={editingProperty?.id ?? "new"}
          property={editingProperty ?? undefined}
          onClose={closeForm}
          onSuccess={closeForm}
        />
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
