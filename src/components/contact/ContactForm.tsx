"use client";

import { ContactField, ContactTextarea } from "@/components/contact/ContactField";
import {
  contactBody,
  contactButton,
  contactChip,
  contactLabel,
  contactSubtitle,
} from "@/components/contact/contact-typography";
import { useContactLeadForm } from "@/hooks/useContactLeadForm";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  Send,
  UserRound,
} from "lucide-react";

const QUICK_PROMPTS = [
  "Busco casa en venta",
  "Busco departamento en renta",
  "Me interesa un desarrollo",
  "Quiero asesoría para invertir",
] as const;

interface ContactFormProps {
  interestedIn?: number | null;
  propertyLabel?: string;
  defaultMessage?: string;
}

export function ContactForm({
  interestedIn = null,
  propertyLabel,
  defaultMessage = "",
}: ContactFormProps) {
  const form = useContactLeadForm({
    interestedIn,
    defaultMessage,
  });

  if (form.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[min(420px,70dvh)] flex-col items-center justify-center rounded-2xl border border-emerald-500/20 bg-[linear-gradient(165deg,rgba(16,185,129,0.08),rgba(26,26,24,0.92))] px-5 py-10 text-center sm:rounded-[1.75rem] sm:px-6 sm:py-12"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 sm:h-16 sm:w-16">
          <CheckCircle2 className="h-7 w-7 text-emerald-300 sm:h-8 sm:w-8" strokeWidth={1.25} />
        </div>
        <h3 className={cn("mt-5 sm:mt-6", contactSubtitle)}>Consulta enviada</h3>
        <p className={cn("mt-3 max-w-sm px-2", contactBody)}>
          Ya recibimos tu mensaje. Un asesor Total Living revisará tu solicitud y
          te contactará pronto.
        </p>
        <button
          type="button"
          onClick={form.resetForm}
          className={cn(
            "mt-7 min-h-11 rounded-full border border-tl-gold/35 px-6 py-3 text-tl-gold transition-colors hover:bg-tl-gold/10 sm:mt-8",
            contactButton,
          )}
        >
          Enviar otra consulta
        </button>
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-tl-gold/20 bg-[linear-gradient(165deg,rgba(214,181,133,0.08),rgba(26,26,24,0.95)_38%,rgba(10,10,10,0.98))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.32)] sm:rounded-[1.75rem] sm:p-6 md:p-7 xl:p-8 xl:shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-tl-gold/50 to-transparent sm:inset-x-8"
      />

      <div className="mb-5 h-1 overflow-hidden rounded-full bg-white/6 sm:mb-6">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-tl-gold/70 to-tl-gold"
          animate={{ width: `${form.completionPercent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      {propertyLabel ? (
        <div className="mb-4 rounded-2xl border border-tl-gold/20 bg-tl-gold/10 px-4 py-3 sm:mb-5 sm:py-3.5">
          <p className={contactLabel}>Consulta sobre</p>
          <p className={cn("mt-1.5 break-words", contactBody)}>{propertyLabel}</p>
        </div>
      ) : null}

      <form
        onSubmit={form.handleSubmit}
        autoComplete="on"
        name="total-living-contact"
        className="space-y-4 sm:space-y-5"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
        >
          <label htmlFor="tl-contact-website">Sitio web</label>
          <input
            id="tl-contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => form.setWebsite(event.target.value)}
          />
        </div>

        <ContactField
          label="Tu nombre"
          icon={UserRound}
          name="name"
          required
          value={form.name}
          onChange={(event) => form.setName(event.target.value)}
          placeholder="Ej. Ana Mendiola"
          autoComplete="name"
          enterKeyHint="next"
          readOnly={!form.autofillEnabled}
          onFocus={form.enableAutofill}
          spellCheck={false}
        />

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          <ContactField
            label="Teléfono"
            icon={Phone}
            hint="WhatsApp ok"
            name="tel"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(event) => form.setPhone(event.target.value)}
            placeholder="442 123 4567"
            autoComplete="tel-national"
            enterKeyHint="next"
            readOnly={!form.autofillEnabled}
            onFocus={form.enableAutofill}
          />
          <ContactField
            label="Correo"
            icon={Mail}
            name="email"
            type="email"
            inputMode="email"
            value={form.email}
            onChange={(event) => form.setEmail(event.target.value)}
            placeholder="tu@correo.com"
            autoComplete="email"
            enterKeyHint="next"
            readOnly={!form.autofillEnabled}
            onFocus={form.enableAutofill}
            spellCheck={false}
          />
        </div>

        <ContactTextarea
          label="¿Qué estás buscando?"
          icon={MessageSquareText}
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={(event) => form.setMessage(event.target.value)}
          placeholder="Ej. Casa en venta en Juriquilla, 3 recámaras..."
          enterKeyHint="send"
          autoComplete="off"
          className="min-h-[120px] sm:min-h-[148px]"
          footer={
            <div className="pt-3">
              <p className={contactLabel}>Respuestas rápidas</p>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 pt-2.5 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => form.setMessage(prompt)}
                    className={cn(
                      contactChip,
                      "shrink-0 rounded-full border px-3.5 py-2.5 transition-colors md:shrink",
                      form.message === prompt
                        ? "border-tl-gold/50 bg-tl-gold/15 text-tl-beige"
                        : "border-white/10 text-tl-beige/60 hover:border-tl-gold/30 hover:text-tl-beige",
                    )}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          }
        />

        <AnimatePresence>
          {form.error ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={cn(
                "rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-red-200",
                contactBody,
              )}
              role="alert"
            >
              {form.error}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <div className="sticky bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] z-10 -mx-1 bg-gradient-to-t from-[#141412] via-[#141412]/95 to-transparent px-1 pb-1 pt-3 md:static md:mx-0 md:bg-none md:p-0">
          <button
            type="submit"
            disabled={form.loading}
            className={cn(
              contactButton,
              "flex w-full min-h-12 items-center justify-center gap-2 rounded-2xl border border-tl-gold bg-tl-gold px-6 py-3.5 text-tl-black shadow-[0_8px_32px_rgba(214,181,133,0.18)] transition-all sm:min-h-[3.35rem]",
              "hover:brightness-105 active:scale-[0.99] disabled:cursor-wait disabled:opacity-90",
            )}
          >
            {form.loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar consulta
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
