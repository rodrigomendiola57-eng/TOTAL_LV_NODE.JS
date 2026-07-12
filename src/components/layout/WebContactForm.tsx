"use client";

import { ContactField, ContactTextarea, contactInputClassName } from "@/components/contact/ContactField";
import { useContactLeadForm } from "@/hooks/useContactLeadForm";
import { cn } from "@/lib/utils";
import { Loader2, Mail, MessageSquareText, Phone, Send, UserRound } from "lucide-react";

interface WebContactFormProps {
  variant?: "compact" | "page";
  interestedIn?: number | null;
  propertyLabel?: string;
  defaultMessage?: string;
  className?: string;
}

export function WebContactForm({
  variant = "compact",
  interestedIn = null,
  propertyLabel,
  defaultMessage = "",
  className,
}: WebContactFormProps) {
  const form = useContactLeadForm({ interestedIn, defaultMessage });
  const isPage = variant === "page";

  if (form.success) {
    return (
      <p className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 font-outfit text-sm font-light text-emerald-200">
        Mensaje recibido. Un asesor te contactará pronto.
      </p>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit}
      autoComplete="on"
      name="total-living-contact-compact"
      className={cn(
        "relative",
        isPage ? "space-y-4" : "mt-6 space-y-3",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor="tl-contact-website-compact">Sitio web</label>
        <input
          id="tl-contact-website-compact"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => form.setWebsite(event.target.value)}
        />
      </div>

      {propertyLabel ? (
        <div className="rounded-xl border border-tl-gold/20 bg-tl-gold/10 px-4 py-3">
          <p className="font-outfit text-[10px] font-light uppercase tracking-[0.14em] text-tl-gold/85">
            Consulta sobre
          </p>
          <p className="mt-1 font-outfit text-sm font-light text-tl-beige">
            {propertyLabel}
          </p>
        </div>
      ) : null}

      {isPage ? (
        <>
          <ContactField
            label="Tu nombre"
            icon={UserRound}
            name="name"
            required
            value={form.name}
            onChange={(event) => form.setName(event.target.value)}
            placeholder="Nombre"
            autoComplete="name"
            readOnly={!form.autofillEnabled}
            onFocus={form.enableAutofill}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <ContactField
              label="Teléfono"
              icon={Phone}
              name="tel"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(event) => form.setPhone(event.target.value)}
              placeholder="Teléfono"
              autoComplete="tel-national"
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
              placeholder="Correo"
              autoComplete="email"
              readOnly={!form.autofillEnabled}
              onFocus={form.enableAutofill}
            />
          </div>
          <ContactTextarea
            label="Mensaje"
            icon={MessageSquareText}
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={(event) => form.setMessage(event.target.value)}
            placeholder="Cuéntanos qué buscas..."
          />
        </>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              name="name"
              value={form.name}
              onChange={(event) => form.setName(event.target.value)}
              placeholder="Nombre"
              autoComplete="name"
              readOnly={!form.autofillEnabled}
              onFocus={form.enableAutofill}
              className={contactInputClassName}
            />
            <input
              name="tel"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(event) => form.setPhone(event.target.value)}
              placeholder="Teléfono"
              autoComplete="tel-national"
              readOnly={!form.autofillEnabled}
              onFocus={form.enableAutofill}
              className={contactInputClassName}
            />
          </div>
          <input
            name="email"
            type="email"
            inputMode="email"
            value={form.email}
            onChange={(event) => form.setEmail(event.target.value)}
            placeholder="Correo electrónico"
            autoComplete="email"
            readOnly={!form.autofillEnabled}
            onFocus={form.enableAutofill}
            className={contactInputClassName}
          />
          <textarea
            required
            name="message"
            rows={4}
            value={form.message}
            onChange={(event) => form.setMessage(event.target.value)}
            placeholder="Cuéntanos qué propiedad buscas o cómo podemos ayudarte..."
            className={cn(contactInputClassName, "resize-none")}
          />
        </>
      )}

      {form.error ? (
        <p className="font-outfit text-sm font-light text-red-300">{form.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={!form.canSubmit}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-tl-gold px-5 py-2.5 font-outfit text-xs font-light uppercase tracking-[0.14em] text-tl-gold transition-colors hover:bg-tl-gold hover:text-tl-black disabled:opacity-50"
      >
        {form.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Enviar consulta
      </button>
    </form>
  );
}
