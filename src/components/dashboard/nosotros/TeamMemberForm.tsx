"use client";

import { ZoneImageDropzone } from "@/components/dashboard/zonas/ZoneImageDropzone";
import {
  createTeamMemberApi,
  updateTeamMemberApi,
  uploadTeamMemberPhotoApi,
  type TeamMemberApiModel,
  type TeamMemberWritePayload,
} from "@/lib/api/about";
import { resolveMediaUrl } from "@/lib/media-url";
import type { TeamSocialLink } from "@/types/company";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

const SOCIAL_PLATFORMS: TeamSocialLink["platform"][] = [
  "linkedin",
  "instagram",
  "facebook",
  "whatsapp",
  "email",
];

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 font-outfit text-sm font-light text-tl-beige outline-none transition-colors placeholder:text-tl-beige/25 focus:border-tl-gold/40";
const labelClass =
  "mb-1.5 block font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/45";

interface TeamMemberFormProps {
  initial?: TeamMemberApiModel | null;
  onSaved: (row: TeamMemberApiModel) => void;
  onCancel: () => void;
}

export function TeamMemberForm({
  initial,
  onSaved,
  onCancel,
}: TeamMemberFormProps) {
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [department, setDepartment] = useState(initial?.department ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [order, setOrder] = useState(String(initial?.order ?? 0));
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true);
  const [socials, setSocials] = useState<TeamSocialLink[]>(
    initial?.socials?.length
      ? initial.socials
      : [{ platform: "linkedin", url: "" }],
  );
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    };
  }, [pendingPreview]);

  const previewImage = useMemo(() => {
    if (pendingPreview) return pendingPreview;
    return (
      resolveMediaUrl(initial?.photo_url) ||
      initial?.photo_external_url ||
      initial?.photo_url ||
      ""
    );
  }, [initial, pendingPreview]);

  function handlePickImage(file: File | null) {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    if (!file) {
      setPendingImage(null);
      setPendingPreview(null);
      return;
    }
    setPendingImage(file);
    setPendingPreview(URL.createObjectURL(file));
  }

  function updateSocial(index: number, patch: Partial<TeamSocialLink>) {
    setSocials((current) =>
      current.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Escribe el nombre del asesor.");
      setSaving(false);
      return;
    }

    const payload: TeamMemberWritePayload = {
      name: trimmedName,
      role: role.trim(),
      department: department.trim(),
      bio: bio.trim(),
      socials: socials.filter((item) => item.url.trim()),
      is_published: isPublished,
      order: Number(order) || 0,
    };

    try {
      let row =
        isEdit && initial
          ? await updateTeamMemberApi(initial.slug, payload)
          : await createTeamMemberApi(payload);

      if (pendingImage) {
        row = await uploadTeamMemberPhotoApi(row.slug, pendingImage);
        handlePickImage(null);
      }

      onSaved(row);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-7">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelClass}>Nombre</span>
            <input
              className={fieldClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className={labelClass}>Cargo / rol</span>
            <input
              className={fieldClass}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className={labelClass}>Departamento</span>
            <input
              className={fieldClass}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Biografía</span>
            <textarea
              className={`${fieldClass} min-h-28 resize-y`}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Orden</span>
            <input
              type="number"
              min={0}
              className={fieldClass}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </label>
          <label className="inline-flex items-center gap-2.5 self-end rounded-full border border-white/10 px-4 py-2.5 font-outfit text-sm font-light text-tl-beige/75">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="accent-tl-gold"
            />
            Publicado en /nosotros
          </label>
        </div>

        <div className="border-t border-white/8 pt-6">
          <ZoneImageDropzone
            previewUrl={previewImage || null}
            disabled={saving}
            allowClear={Boolean(pendingImage)}
            onFile={handlePickImage}
            label="Fotografía del asesor"
            hint="JPG, PNG o WebP"
          />
        </div>

        <div className="space-y-3 border-t border-white/8 pt-6">
          <div className="flex items-center justify-between gap-3">
            <p className={labelClass}>Redes sociales</p>
            <button
              type="button"
              onClick={() =>
                setSocials((current) => [
                  ...current,
                  { platform: "instagram", url: "" },
                ])
              }
              className="inline-flex items-center gap-1.5 font-outfit text-[10px] uppercase tracking-[0.14em] text-tl-gold"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar
            </button>
          </div>
          {socials.map((social, index) => (
            <div
              key={`${social.platform}-${index}`}
              className="grid gap-2 sm:grid-cols-[10rem_minmax(0,1fr)_auto]"
            >
              <select
                className={fieldClass}
                value={social.platform}
                onChange={(e) =>
                  updateSocial(index, {
                    platform: e.target.value as TeamSocialLink["platform"],
                  })
                }
              >
                {SOCIAL_PLATFORMS.map((platform) => (
                  <option key={platform} value={platform} className="bg-tl-black">
                    {platform}
                  </option>
                ))}
              </select>
              <input
                className={fieldClass}
                value={social.url}
                onChange={(e) => updateSocial(index, { url: e.target.value })}
                placeholder="https://… o mailto:… o wa.me/…"
              />
              <button
                type="button"
                onClick={() =>
                  setSocials((current) =>
                    current.filter((_, i) => i !== index),
                  )
                }
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-tl-beige/50 hover:border-red-400/40 hover:text-red-300"
                aria-label="Quitar red"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 font-outfit text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 py-2.5 font-outfit text-[11px] uppercase tracking-[0.14em] text-tl-beige/70"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-tl-gold px-6 py-2.5 font-outfit text-[11px] uppercase tracking-[0.14em] text-tl-black disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isEdit ? "Guardar cambios" : "Crear miembro"}
        </button>
      </div>
    </form>
  );
}
