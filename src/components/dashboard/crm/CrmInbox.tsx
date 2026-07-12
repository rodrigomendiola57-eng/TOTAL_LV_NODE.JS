"use client";

import { CrmFiltersBar, getStatusStyle } from "@/components/dashboard/crm/CrmFiltersBar";
import {
  getLeadMessages,
  getLeads,
  markLeadRead,
  sendLeadMessage,
  updateLeadStatus,
} from "@/lib/api/crm";
import {
  DEFAULT_CRM_LEAD_FILTERS,
  type CrmLeadFilters,
} from "@/lib/crm-lead-filters";
import { cn } from "@/lib/utils";
import type { Lead, LeadMessage, LeadStatus } from "@/types/lead";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Copy,
  Inbox,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  RefreshCw,
  Send,
  StickyNote,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const STATUS_OPTIONS: LeadStatus[] = [
  "Nuevo",
  "En Contacto",
  "Negociación",
  "Cerrado",
];

function formatLeadDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Ahora";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  if (diffMinutes < 1440) return `Hace ${Math.floor(diffMinutes / 60)} h`;

  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function formatMessageTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("es-MX", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CrmInbox() {
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [messages, setMessages] = useState<LeadMessage[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [filters, setFilters] = useState<CrmLeadFilters>(DEFAULT_CRM_LEAD_FILTERS);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return allLeads.filter((lead) => {
      if (filters.status !== "all" && lead.status !== filters.status) {
        return false;
      }
      if (filters.unreadOnly && !(lead.unread || (lead.unread_count ?? 0) > 0)) {
        return false;
      }
      if (!search) return true;

      const haystack = [
        lead.name,
        lead.email,
        lead.phone,
        lead.last_message ?? "",
        lead.interested_property_title ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [allLeads, filters]);

  const selectedLead = useMemo(
    () => filteredLeads.find((lead) => lead.id === selectedLeadId) ?? null,
    [filteredLeads, selectedLeadId],
  );

  const stats = useMemo(() => {
    const unread = allLeads.filter(
      (lead) => lead.unread || (lead.unread_count ?? 0) > 0,
    ).length;
    const nuevos = allLeads.filter((lead) => lead.status === "Nuevo").length;
    const activos = allLeads.filter((lead) => lead.status !== "Cerrado").length;

    return {
      total: allLeads.length,
      unread,
      nuevos,
      activos,
    };
  }, [allLeads]);

  const loadLeads = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (options?.silent) {
        setRefreshing(true);
      } else {
        setError(null);
      }

      const data = await getLeads();
      setAllLeads(data);

      setSelectedLeadId((current) => {
        if (current && data.some((lead) => lead.id === current)) {
          return current;
        }
        return data[0]?.id ?? null;
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar los leads.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadMessages = useCallback(async (leadId: number) => {
    setLoadingMessages(true);
    try {
      const data = await getLeadMessages(leadId);
      setMessages(data);
      await markLeadRead(leadId);
      setAllLeads((current) =>
        current.map((lead) =>
          lead.id === leadId
            ? { ...lead, unread: false, unread_count: 0 }
            : lead,
        ),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar los mensajes.",
      );
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    void loadLeads();
    const interval = window.setInterval(() => {
      void loadLeads({ silent: true });
    }, 20000);
    return () => window.clearInterval(interval);
  }, [loadLeads]);

  useEffect(() => {
    if (!selectedLead?.id) {
      setMessages([]);
      return;
    }
    void loadMessages(selectedLead.id);
  }, [selectedLead?.id, loadMessages]);

  useEffect(() => {
    if (
      selectedLeadId &&
      !filteredLeads.some((lead) => lead.id === selectedLeadId)
    ) {
      setSelectedLeadId(filteredLeads[0]?.id ?? null);
      setMobileView("list");
    }
  }, [filteredLeads, selectedLeadId]);

  async function handleSend() {
    if (!selectedLead?.id || !reply.trim() || sending) return;
    setSending(true);
    try {
      const message = await sendLeadMessage(selectedLead.id, reply.trim());
      setMessages((current) => [...current, message]);
      setReply("");
      await loadLeads({ silent: true });
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "No se pudo guardar la nota.",
      );
    } finally {
      setSending(false);
    }
  }

  async function handleStatusChange(status: LeadStatus) {
    if (!selectedLead?.id) return;
    try {
      const updated = await updateLeadStatus(selectedLead.id, status);
      setAllLeads((current) =>
        current.map((lead) => (lead.id === updated.id ? updated : lead)),
      );
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "No se pudo actualizar el estatus.",
      );
    }
  }

  function handleSelectLead(leadId: number) {
    setSelectedLeadId(leadId);
    setMobileView("detail");
  }

  async function copyValue(label: string, value: string) {
    if (!value || value === "—") return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      window.setTimeout(() => setCopiedField(null), 1800);
    } catch {
      setError("No se pudo copiar al portapapeles.");
    }
  }

  const inquiryMessage = messages.find((message) => message.sender === "lead");
  const notes = messages.filter((message) => message.sender === "agent");

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold">
            CRM
          </p>
          <h1 className="mt-1.5 font-outfit text-[1.75rem] font-extralight leading-tight text-tl-beige sm:mt-2 sm:text-4xl">
            Leads del sitio web
          </h1>
          <p className="mt-2 hidden max-w-2xl font-outfit text-sm font-light text-tl-beige/65 sm:block">
            Consultas enviadas desde el formulario de contacto. Filtra, da
            seguimiento y guarda notas internas por prospecto.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadLeads()}
          disabled={refreshing}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-tl-gold/30 px-4 py-2.5 font-outfit text-xs font-light uppercase tracking-[0.12em] text-tl-beige/75 transition-colors active:border-tl-gold/50 active:text-tl-beige disabled:opacity-60 sm:min-h-0 sm:py-2 sm:hover:border-tl-gold/50 sm:hover:text-tl-beige"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
          Actualizar
        </button>
      </header>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Activos" value={stats.activos} />
        <StatCard label="Nuevos" value={stats.nuevos} accent="gold" />
        <StatCard label="Sin leer" value={stats.unread} accent="gold" />
      </div>

      <CrmFiltersBar
        filters={filters}
        resultCount={filteredLeads.length}
        totalCount={allLeads.length}
        onChange={setFilters}
      />

      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-outfit text-sm font-light text-red-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="flex h-[min(50dvh,420px)] items-center justify-center rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] lg:border-tl-gold/20 lg:bg-tl-black/60">
          <Loader2 className="h-6 w-6 animate-spin text-tl-gold" />
        </div>
      ) : allLeads.length === 0 ? (
        <EmptyState
          title="Aún no hay leads"
          description="Cuando alguien envíe el formulario de contacto en la página, aparecerá aquí automáticamente."
        />
      ) : filteredLeads.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No hay leads que coincidan con los filtros actuales. Prueba limpiarlos o ampliar la búsqueda."
          actionLabel="Limpiar filtros"
          onAction={() => setFilters(DEFAULT_CRM_LEAD_FILTERS)}
        />
      ) : (
        <div className="grid min-h-[min(70dvh,620px)] grid-cols-1 gap-3 sm:gap-4 xl:min-h-[620px] xl:grid-cols-[320px_minmax(0,1fr)]">
          <section
            className={cn(
              "flex flex-col overflow-hidden rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] lg:border-tl-gold/20 lg:bg-tl-black/60",
              mobileView === "detail" ? "hidden xl:flex" : "flex",
            )}
          >
            <div className="border-b border-tl-gold/15 px-4 py-3.5 sm:py-4">
              <p className="font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-beige/50">
                Bandeja ({filteredLeads.length})
              </p>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {filteredLeads.map((lead) => {
                const isSelected = lead.id === selectedLeadId;
                const isUnread = lead.unread || (lead.unread_count ?? 0) > 0;

                return (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => handleSelectLead(lead.id)}
                    className={cn(
                      "w-full border-b border-white/[0.06] px-4 py-4 text-left transition-colors active:bg-tl-gold/10 sm:py-4",
                      isSelected
                        ? "bg-tl-gold/10"
                        : "lg:hover:bg-white/[0.03]",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-tl-gold/25 bg-black font-outfit text-lg font-extralight text-tl-gold">
                        {getInitials(lead.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-outfit text-sm font-extralight text-tl-beige">
                            {lead.name}
                          </p>
                          <span className="shrink-0 font-outfit text-[10px] font-light text-tl-beige/40">
                            {formatLeadDate(lead.updated_at)}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 font-outfit text-xs font-light leading-relaxed text-tl-beige/55">
                          {lead.last_message || "Sin mensaje"}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <StatusBadge status={lead.status} />
                          {isUnread ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-tl-gold/30 bg-tl-gold/10 px-2 py-0.5 font-outfit text-[10px] uppercase tracking-[0.1em] text-tl-gold">
                              <span className="h-1.5 w-1.5 rounded-full bg-tl-gold" />
                              Nuevo
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section
            className={cn(
              "flex min-h-[min(75dvh,620px)] flex-col overflow-hidden rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] xl:min-h-[620px] lg:border-tl-gold/20 lg:bg-tl-black/60",
              mobileView === "list" ? "hidden xl:flex" : "flex",
            )}
          >
            {selectedLead ? (
              <>
                <div className="border-b border-tl-gold/15 px-4 py-4 sm:px-5">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setMobileView("list")}
                      className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-tl-beige/70 transition-colors active:border-tl-gold/30 active:text-tl-beige xl:hidden"
                      aria-label="Volver a la bandeja"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-outfit text-xl font-extralight text-tl-beige sm:text-2xl">
                          {selectedLead.name}
                        </h2>
                        <StatusBadge status={selectedLead.status} />
                      </div>
                      <p className="mt-1 font-outfit text-xs font-light text-tl-beige/45">
                        Recibido {formatLeadDate(selectedLead.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
                    {selectedLead.phone ? (
                      <ContactAction
                        href={`tel:${selectedLead.phone}`}
                        icon={Phone}
                        label="Llamar"
                      />
                    ) : null}
                    {selectedLead.email ? (
                      <ContactAction
                        href={`mailto:${selectedLead.email}`}
                        icon={Mail}
                        label="Correo"
                      />
                    ) : null}
                    {selectedLead.phone ? (
                      <button
                        type="button"
                        onClick={() => void copyValue("phone", selectedLead.phone)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2.5 font-outfit text-[10px] font-light uppercase tracking-[0.1em] text-tl-beige/65 transition-colors active:border-tl-gold/30 active:text-tl-beige sm:py-1.5 sm:hover:border-tl-gold/30 sm:hover:text-tl-beige"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copiedField === "phone" ? "Copiado" : "Copiar tel."}
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="grid flex-1 gap-0 xl:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="flex flex-col border-b border-tl-gold/10 xl:border-b-0 xl:border-r xl:border-tl-gold/10">
                    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
                      {loadingMessages ? (
                        <div className="flex justify-center py-10">
                          <Loader2 className="h-5 w-5 animate-spin text-tl-gold" />
                        </div>
                      ) : (
                        <>
                          <div className="rounded-2xl border border-tl-gold/20 bg-[#0a0a0a]/80 p-4">
                            <div className="flex items-center gap-2">
                              <MessageSquareText className="h-4 w-4 text-tl-gold" />
                              <p className="font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-gold/85">
                                Consulta del formulario
                              </p>
                            </div>
                            <p className="mt-3 font-outfit font-light text-sm leading-relaxed text-tl-beige/85">
                              {inquiryMessage?.content ||
                                selectedLead.last_message ||
                                "Sin mensaje registrado."}
                            </p>
                            {inquiryMessage ? (
                              <p className="mt-3 font-outfit text-[10px] font-light text-tl-beige/40">
                                {formatMessageTime(inquiryMessage.sent_at)}
                              </p>
                            ) : null}
                          </div>

                          <div>
                            <div className="mb-3 flex items-center gap-2">
                              <StickyNote className="h-4 w-4 text-tl-beige/45" />
                              <p className="font-outfit text-[10px] font-light uppercase tracking-[0.16em] text-tl-beige/45">
                                Notas internas
                              </p>
                            </div>

                            {notes.length === 0 ? (
                              <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center font-outfit text-sm font-light text-tl-beige/45">
                                Aún no hay notas para este lead.
                              </p>
                            ) : (
                              <div className="space-y-3">
                                <AnimatePresence initial={false}>
                                  {notes.map((note) => (
                                    <motion.div
                                      key={note.id}
                                      initial={{ opacity: 0, y: 8 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="rounded-2xl border border-tl-gold/15 bg-tl-gold/10 px-4 py-3"
                                    >
                                      <p className="font-outfit font-light text-sm leading-relaxed text-tl-beige">
                                        {note.content}
                                      </p>
                                      <p className="mt-2 font-outfit text-[10px] font-light text-tl-beige/40">
                                        {formatMessageTime(note.sent_at)}
                                      </p>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="border-t border-tl-gold/15 p-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:p-5">
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          void handleSend();
                        }}
                        className="space-y-3"
                      >
                        <label className="block font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-beige/45">
                          Agregar nota interna
                        </label>
                        <div className="flex items-end gap-2.5 sm:gap-3">
                          <textarea
                            value={reply}
                            onChange={(event) => setReply(event.target.value)}
                            rows={2}
                            placeholder="Ej. Llamar mañana…"
                            className="min-h-12 flex-1 resize-none rounded-xl border border-tl-gold/20 bg-black px-4 py-3 font-outfit text-sm font-light text-tl-beige outline-none placeholder:text-tl-beige/35 focus:border-tl-gold/60 sm:bg-[#0a0a0a]"
                          />
                          <button
                            type="submit"
                            disabled={sending || !reply.trim()}
                            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tl-gold text-tl-black transition-opacity active:opacity-90 disabled:opacity-40 sm:h-auto sm:w-auto sm:p-3 sm:hover:opacity-90"
                            aria-label="Guardar nota"
                          >
                            {sending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  <aside className="space-y-5 overflow-y-auto px-4 py-5 sm:px-5">
                    <ProfileField
                      icon={UserRound}
                      label="Nombre"
                      value={selectedLead.name}
                    />
                    <ProfileField
                      icon={Phone}
                      label="Teléfono"
                      value={selectedLead.phone || "—"}
                      onCopy={
                        selectedLead.phone
                          ? () => void copyValue("phone-side", selectedLead.phone)
                          : undefined
                      }
                      copied={copiedField === "phone-side"}
                    />
                    <ProfileField
                      icon={Mail}
                      label="Correo"
                      value={selectedLead.email || "—"}
                      onCopy={
                        selectedLead.email
                          ? () => void copyValue("email", selectedLead.email)
                          : undefined
                      }
                      copied={copiedField === "email"}
                    />
                    <ProfileField
                      icon={CalendarDays}
                      label="Propiedad de interés"
                      value={
                        selectedLead.interested_property_title ?? "Sin especificar"
                      }
                    />

                    <div>
                      <p className="font-outfit font-light text-[10px] uppercase tracking-[0.16em] text-tl-beige/45">
                        Estatus
                      </p>
                      <select
                        value={selectedLead.status}
                        onChange={(event) =>
                          void handleStatusChange(
                            event.target.value as LeadStatus,
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-tl-gold/20 bg-[#0a0a0a] px-3 py-2.5 font-outfit text-sm font-light text-tl-beige outline-none focus:border-tl-gold/60"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </aside>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center px-6 py-16 text-center">
                <div>
                  <Inbox className="mx-auto h-8 w-8 text-tl-gold/60" />
                  <p className="mt-4 font-outfit text-sm font-light text-tl-beige/55">
                    Selecciona un lead para ver su detalle.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = "neutral",
}: {
  label: string;
  value: number;
  accent?: "neutral" | "gold";
}) {
  return (
    <div className="rounded-2xl border border-tl-gold/15 bg-[#0a0a0a] px-3.5 py-3.5 sm:px-4 sm:py-4 lg:border-tl-gold/20 lg:bg-tl-black/60">
      <p className="font-outfit text-[9px] font-light uppercase tracking-[0.14em] text-tl-beige/45 sm:text-[10px] sm:tracking-[0.16em]">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-outfit text-[1.75rem] font-extralight sm:text-3xl",
          accent === "gold" ? "text-tl-gold" : "text-tl-beige",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 font-outfit text-[10px] font-light uppercase tracking-[0.1em]",
        getStatusStyle(status),
      )}
    >
      {status}
    </span>
  );
}

function ContactAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Phone;
  label: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-tl-gold/25 bg-tl-gold/10 px-3.5 py-2.5 font-outfit text-[10px] font-light uppercase tracking-[0.1em] text-tl-gold transition-colors active:border-tl-gold/45 sm:py-1.5 sm:hover:border-tl-gold/45 sm:hover:bg-tl-gold/15"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
  onCopy,
  copied,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="font-outfit font-light text-[10px] uppercase tracking-[0.16em] text-tl-beige/45">
          {label}
        </p>
        {onCopy ? (
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1 font-outfit text-[10px] font-light uppercase tracking-[0.1em] text-tl-gold/80 transition-colors hover:text-tl-gold"
          >
            <Copy className="h-3 w-3" />
            {copied ? "Copiado" : "Copiar"}
          </button>
        ) : null}
      </div>
      <div className="mt-2 flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-tl-gold/70" />
        <p className="font-outfit font-light text-sm leading-relaxed text-tl-beige/85">
          {value}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-tl-gold/25 bg-[#0a0a0a] px-5 py-14 text-center sm:px-6 sm:py-16 lg:bg-tl-black/60">
      <Inbox className="mx-auto h-8 w-8 text-tl-gold/60" />
      <h2 className="mt-4 font-outfit text-2xl font-extralight text-tl-beige">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md font-outfit text-sm font-light text-tl-beige/55">
        {description}
      </p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full border border-tl-gold/30 px-4 py-2 font-outfit text-xs font-light uppercase tracking-[0.12em] text-tl-beige/75 transition-colors hover:border-tl-gold/50 hover:text-tl-beige"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
