"use client";

import { createLead } from "@/lib/api/crm";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { translateOptions } from "@/lib/i18n/asesoria-form-translations";
import {
  COMPRA_BEDROOM_OPTIONS,
  COMPRA_BUDGET_OPTIONS,
  COMPRA_EXCLUSIVE_OPTIONS,
  COMPRA_FINANCING_OPTIONS,
  COMPRA_PROPERTY_TYPE_OPTIONS,
  COMPRA_TIMELINE_OPTIONS,
  COMPRA_ZONE_CHIPS,
} from "@/lib/data/asesoria";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

const TOTAL_STEPS = 3;

const fieldClass = cn(
  "w-full min-h-12 appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3",
  "font-outfit text-sm font-extralight text-tl-beige outline-none transition-[border-color,background-color]",
  "placeholder:text-tl-beige/30 focus:border-tl-gold/50 focus:bg-white/[0.06]",
);

const labelClass =
  "mb-2.5 block font-outfit text-[10px] font-light uppercase tracking-[0.22em] text-tl-gold/80";

const chipClass = (active: boolean) =>
  cn(
    "inline-flex min-h-10 items-center justify-center rounded-full border px-3.5 py-2",
    "font-outfit text-[11px] font-extralight tracking-[0.04em] transition-colors",
    active
      ? "border-tl-gold/70 bg-tl-gold/15 text-tl-gold"
      : "border-white/12 bg-white/[0.03] text-tl-beige/70 hover:border-white/25 hover:text-tl-beige",
  );

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className={labelClass}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={chipClass(value === opt.value)}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function buildCompraMessage(payload: {
  budget: string;
  propertyType: string;
  zone: string;
  bedrooms: string;
  timeline: string;
  financing: string;
  exclusive: string;
  notes: string;
}, locale: string = "es"): string {
  const isEn = locale === "en";
  const pick = <T extends { value: string; label: string }>(
    opts: readonly T[],
    value: string,
  ) => {
    const translated = translateOptions(opts, locale);
    return translated.find((o) => o.value === value)?.label ?? (value || "—");
  };

  return [
    isEn ? "[Buying Advisory]" : "[Asesoría de compra]",
    `${isEn ? "Budget" : "Presupuesto"}: ${pick(COMPRA_BUDGET_OPTIONS, payload.budget)}`,
    `${isEn ? "Type" : "Tipo"}: ${pick(COMPRA_PROPERTY_TYPE_OPTIONS, payload.propertyType)}`,
    `${isEn ? "Zone" : "Zona"}: ${pick(COMPRA_ZONE_CHIPS, payload.zone)}`,
    `${isEn ? "Bedrooms" : "Recámaras"}: ${pick(COMPRA_BEDROOM_OPTIONS, payload.bedrooms)}`,
    `${isEn ? "Timeline" : "Horizonte"}: ${pick(COMPRA_TIMELINE_OPTIONS, payload.timeline)}`,
    `${isEn ? "Financing" : "Financiamiento"}: ${pick(COMPRA_FINANCING_OPTIONS, payload.financing)}`,
    `${isEn ? "Exclusive guidance" : "Acompañamiento exclusivo"}: ${pick(COMPRA_EXCLUSIVE_OPTIONS, payload.exclusive)}`,
    payload.notes.trim()
      ? `${isEn ? "Notes" : "Notas"}: ${payload.notes.trim()}`
      : `${isEn ? "Notes" : "Notas"}: ${isEn ? "(no additional details)" : "(sin detalle adicional)"}`,
  ].join("\n");
}

export function AsesoriaCompraForm() {
  const { locale } = useLocale();
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [zone, setZone] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [timeline, setTimeline] = useState("");
  const [financing, setFinancing] = useState("");
  const [exclusive, setExclusive] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autofillReady, setAutofillReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setAutofillReady(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  function resetAll() {
    setStep(1);
    setName("");
    setPhone("");
    setEmail("");
    setBudget("");
    setPropertyType("");
    setZone("");
    setBedrooms("");
    setTimeline("");
    setFinancing("");
    setExclusive("");
    setNotes("");
    setWebsite("");
    setError(null);
    setSuccess(false);
  }

  function goNext() {
    setError(null);
    if (step === 1) {
      if (name.trim().length < 2) {
        setError(locale === "en" ? "Please enter your name." : "Escribe tu nombre.");
        return;
      }
      if (!phone.trim() && !email.trim()) {
        setError(locale === "en" ? "Please add phone or email." : "Agrega teléfono o correo.");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!budget || !propertyType || !timeline) {
        setError(locale === "en" ? "Please select budget, type, and timeline." : "Elige presupuesto, tipo y horizonte.");
        return;
      }
      setStep(3);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (step < TOTAL_STEPS) {
      goNext();
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await createLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        channel: "Web",
        interested_in: null,
        initial_message: buildCompraMessage({
          budget,
          propertyType,
          zone,
          bedrooms,
          timeline,
          financing,
          exclusive,
          notes,
        }, locale),
        website,
      });
      setSuccess(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : (locale === "en" ? "Could not send. Please try again." : "No se pudo enviar. Intenta de nuevo."),
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] px-6 py-12 text-center">
        <CheckCircle2 className="h-8 w-8 text-emerald-300" strokeWidth={1.25} />
        <p className="mt-4 font-outfit text-2xl font-extralight tracking-[0.02em] text-tl-beige">
          {locale === "en" ? "Request received" : "Solicitud recibida"}
        </p>
        <p className="mt-2 max-w-sm font-outfit text-sm font-extralight text-tl-beige/65">
          {locale === "en" ? "An advisor will review your buying brief and contact you soon." : "Un asesor revisará tu brief de compra y te contactará pronto."}
        </p>
        <button
          type="button"
          onClick={resetAll}
          className="mt-6 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-gold transition-colors hover:text-tl-beige"
        >
          {locale === "en" ? "New request" : "Nueva solicitud"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative overflow-hidden rounded-2xl border border-tl-gold/20 bg-[linear-gradient(165deg,rgba(214,181,133,0.07),rgba(18,18,16,0.96)_42%,rgba(10,10,10,0.98))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-7"
      noValidate
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-tl-gold/45 to-transparent"
      />

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-outfit text-[10px] font-light uppercase tracking-[0.26em] text-tl-gold/90">
            {locale === "en" ? "Start your process" : "Inicia tu proceso"}
          </p>
          <h3 className="mt-2 font-outfit text-2xl font-extralight tracking-[0.02em] text-tl-beige">
            {locale === "en" ? "Buying Brief" : "Brief de compra"}
          </h3>
        </div>
        <p className="shrink-0 font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-beige/40">
          {step} / {TOTAL_STEPS}
        </p>
      </div>

      <div className="mt-5 flex gap-1.5" aria-hidden>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-0.5 flex-1 rounded-full transition-colors duration-300",
              i < step ? "bg-tl-gold/80" : "bg-white/10",
            )}
          />
        ))}
      </div>

      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reducedMotion ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, x: -10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 min-h-[16rem]"
        >
          {step === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <p className="sm:col-span-2 font-outfit text-sm font-extralight text-tl-beige/60">
                {locale === "en" ? "Your contact info. Autofill is supported." : "Tus datos. El navegador puede autocompletarlos."}
              </p>
              <label className="block sm:col-span-2">
                <span className={labelClass}>{locale === "en" ? "Name" : "Nombre"}</span>
                <input
                  className={fieldClass}
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={locale === "en" ? "Your name" : "Tu nombre"}
                  autoComplete={autofillReady ? "name" : "off"}
                  required
                />
              </label>
              <label className="block">
                <span className={labelClass}>{locale === "en" ? "Phone / WhatsApp" : "Teléfono / WhatsApp"}</span>
                <input
                  className={fieldClass}
                  name="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="55…"
                  inputMode="tel"
                  autoComplete={autofillReady ? "tel" : "off"}
                />
              </label>
              <label className="block">
                <span className={labelClass}>{locale === "en" ? "Email" : "Correo"}</span>
                <input
                  className={fieldClass}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={locale === "en" ? "you@example.com" : "tu@correo.com"}
                  autoComplete={autofillReady ? "email" : "off"}
                />
              </label>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <ChipGroup
                label={locale === "en" ? "Budget" : "Presupuesto"}
                options={translateOptions(COMPRA_BUDGET_OPTIONS, locale)}
                value={budget}
                onChange={setBudget}
              />
              <ChipGroup
                label={locale === "en" ? "Property type" : "Tipo de propiedad"}
                options={translateOptions(COMPRA_PROPERTY_TYPE_OPTIONS, locale)}
                value={propertyType}
                onChange={setPropertyType}
              />
              <ChipGroup
                label={locale === "en" ? "Bedrooms" : "Recámaras"}
                options={translateOptions(COMPRA_BEDROOM_OPTIONS, locale)}
                value={bedrooms}
                onChange={setBedrooms}
              />
              <ChipGroup
                label={locale === "en" ? "How soon do you want to buy?" : "¿Qué tan pronto deseas comprar?"}
                options={translateOptions(COMPRA_TIMELINE_OPTIONS, locale)}
                value={timeline}
                onChange={setTimeline}
              />
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <ChipGroup
                label={locale === "en" ? "Preferred area" : "Zona preferida"}
                options={translateOptions(COMPRA_ZONE_CHIPS, locale)}
                value={zone}
                onChange={setZone}
              />
              <ChipGroup
                label={locale === "en" ? "Financing" : "Financiamiento"}
                options={translateOptions(COMPRA_FINANCING_OPTIONS, locale)}
                value={financing}
                onChange={setFinancing}
              />
              <ChipGroup
                label={locale === "en" ? "Interested in exclusive guidance?" : "¿Interés en acompañamiento exclusivo?"}
                options={translateOptions(COMPRA_EXCLUSIVE_OPTIONS, locale)}
                value={exclusive}
                onChange={setExclusive}
              />
              <label className="block">
                <span className={labelClass}>{locale === "en" ? "Optional details" : "Detalle opcional"}</span>
                <textarea
                  className={cn(fieldClass, "min-h-[5rem] resize-y")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={locale === "en" ? "Any key details we should know (optional)" : "Algo clave que debamos saber (opcional)"}
                  rows={2}
                />
              </label>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {error ? (
        <p role="alert" className="mt-4 font-outfit text-sm font-extralight text-red-300/95">
          {error}
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStep((s) => s - 1);
            }}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/15 px-4 font-outfit text-[11px] font-light uppercase tracking-[0.14em] text-tl-beige/70 transition-colors hover:border-white/30 hover:text-tl-beige"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            {locale === "en" ? "Back" : "Atrás"}
          </button>
        ) : null}

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-tl-gold px-6 font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-black transition-opacity hover:opacity-90 sm:flex-none sm:min-w-[11rem]"
          >
            {locale === "en" ? "Continue" : "Continuar"}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-tl-gold px-6",
              "font-outfit text-[11px] font-light uppercase tracking-[0.16em] text-tl-black transition-opacity",
              "hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55 sm:flex-none sm:min-w-[14rem]",
            )}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
            )}
            {loading ? (locale === "en" ? "Sending..." : "Enviando…") : (locale === "en" ? "Send brief" : "Enviar brief")}
          </button>
        )}
      </div>
    </form>
  );
}
