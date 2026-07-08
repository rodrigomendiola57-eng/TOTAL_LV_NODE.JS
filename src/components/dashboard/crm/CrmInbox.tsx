"use client";

import { MOCK_LEADS, MOCK_MESSAGES } from "@/lib/mock/crm";
import { cn } from "@/lib/utils";
import type { Lead, LeadChannel } from "@/types/lead";
import { motion } from "framer-motion";
import { Globe, Megaphone, MessageCircle, Send } from "lucide-react";
import { useMemo, useState } from "react";

const CHANNEL_STYLES: Record<
  LeadChannel,
  { label: string; className: string; icon: typeof Globe }
> = {
  Web: {
    label: "Web",
    className: "border-sky-500/40 bg-sky-500/10 text-sky-300",
    icon: Globe,
  },
  WhatsApp: {
    label: "WhatsApp",
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    icon: MessageCircle,
  },
  Meta: {
    label: "Meta",
    className: "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300",
    icon: Megaphone,
  },
};

export function CrmInbox() {
  const [selectedLeadId, setSelectedLeadId] = useState<number>(MOCK_LEADS[0]?.id ?? 0);
  const [reply, setReply] = useState("");

  const selectedLead = useMemo(
    () => MOCK_LEADS.find((lead) => lead.id === selectedLeadId) ?? MOCK_LEADS[0],
    [selectedLeadId],
  );

  const messages = MOCK_MESSAGES[selectedLead?.id ?? 0] ?? [];

  return (
    <div className="space-y-6">
      <header>
        <p className="font-outfit font-light text-[10px] uppercase tracking-[0.22em] text-tl-gold">
          CRM Omnicanal
        </p>
        <h1 className="mt-2 font-cormorant text-4xl font-light text-tl-beige">
          Bandeja de Entrada
        </h1>
        <p className="mt-2 max-w-2xl font-outfit font-light text-sm text-tl-beige/65">
          Centraliza leads de la web, WhatsApp, Instagram y Facebook en un solo
          flujo de atención.
        </p>
      </header>

      <div className="grid h-[calc(100vh-14rem)] min-h-[520px] grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_300px]">
        <LeadList
          leads={MOCK_LEADS}
          selectedId={selectedLead?.id}
          onSelect={setSelectedLeadId}
        />
        <ChatWindow
          lead={selectedLead}
          messages={messages}
          reply={reply}
          onReplyChange={setReply}
        />
        <LeadProfile lead={selectedLead} />
      </div>
    </div>
  );
}

function LeadList({
  leads,
  selectedId,
  onSelect,
}: {
  leads: Lead[];
  selectedId?: number;
  onSelect: (id: number) => void;
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-tl-gold/20 bg-tl-black/60">
      <div className="border-b border-tl-gold/15 px-4 py-4">
        <p className="font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-beige/50">
          Conversaciones activas
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {leads.map((lead) => (
          <button
            key={lead.id}
            type="button"
            onClick={() => onSelect(lead.id)}
            className={cn(
              "w-full border-b border-tl-gold/10 px-4 py-4 text-left transition-colors",
              selectedId === lead.id
                ? "bg-tl-gold/10"
                : "hover:bg-tl-olive/20",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-outfit font-light text-sm text-tl-beige">{lead.name}</p>
              {lead.unread ? (
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-tl-gold" />
              ) : null}
            </div>
            <p className="mt-1 line-clamp-2 font-outfit font-light text-xs text-tl-beige/55">
              {lead.last_message}
            </p>
            <div className="mt-3">
              <ChannelBadge channel={lead.channel} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function ChatWindow({
  lead,
  messages,
  reply,
  onReplyChange,
}: {
  lead?: Lead;
  messages: { id: number; content: string; sender: "lead" | "agent"; sent_at: string }[];
  reply: string;
  onReplyChange: (value: string) => void;
}) {
  if (!lead) {
    return (
      <section className="flex items-center justify-center rounded-2xl border border-tl-gold/20 bg-tl-black/60">
        <p className="font-outfit font-light text-sm text-tl-beige/50">
          Selecciona un lead para ver la conversación.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-tl-gold/20 bg-tl-black/60">
      <div className="flex items-center justify-between border-b border-tl-gold/15 px-5 py-4">
        <div>
          <p className="font-outfit font-light text-sm text-tl-beige">{lead.name}</p>
          <p className="mt-1 font-outfit font-light text-xs text-tl-beige/50">
            {lead.status}
          </p>
        </div>
        <ChannelBadge channel={lead.channel} />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3 font-outfit font-light text-sm",
              message.sender === "agent"
                ? "ml-auto bg-tl-gold/20 text-tl-beige"
                : "bg-[#0a0a0a] text-tl-beige/85",
            )}
          >
            {message.content}
          </motion.div>
        ))}
      </div>

      <div className="border-t border-tl-gold/15 p-4">
        <div className="flex items-center gap-3">
          <input
            value={reply}
            onChange={(e) => onReplyChange(e.target.value)}
            placeholder="Escribe una respuesta..."
            className="flex-1 rounded-xl border border-tl-gold/20 bg-[#0a0a0a] px-4 py-3 font-outfit font-light text-sm text-tl-beige outline-none placeholder:text-tl-beige/35 focus:border-tl-gold/60"
          />
          <button
            type="button"
            className="rounded-full bg-tl-gold p-3 text-tl-black transition-opacity hover:opacity-90"
            aria-label="Enviar mensaje"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function LeadProfile({ lead }: { lead?: Lead }) {
  if (!lead) return null;

  const fields = [
    { label: "Nombre", value: lead.name },
    { label: "Teléfono", value: lead.phone },
    { label: "Correo", value: lead.email },
    {
      label: "Propiedad de interés",
      value: lead.interested_property_title ?? "Sin especificar",
    },
    { label: "Estatus", value: lead.status },
    { label: "Origen", value: lead.channel },
  ];

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-tl-gold/20 bg-tl-black/60">
      <div className="border-b border-tl-gold/15 px-5 py-4">
        <p className="font-outfit font-light text-[10px] uppercase tracking-[0.18em] text-tl-beige/50">
          Perfil del prospecto
        </p>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-tl-gold/30 bg-tl-olive/30 font-cormorant text-2xl text-tl-gold">
          {lead.name.charAt(0)}
        </div>
        {fields.map((field) => (
          <div key={field.label}>
            <p className="font-outfit font-light text-[10px] uppercase tracking-[0.16em] text-tl-beige/45">
              {field.label}
            </p>
            <p className="mt-1 font-outfit font-light text-sm text-tl-beige/85">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChannelBadge({ channel }: { channel: LeadChannel }) {
  const config = CHANNEL_STYLES[channel];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-outfit font-light text-[10px] uppercase tracking-[0.1em]",
        config.className,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
