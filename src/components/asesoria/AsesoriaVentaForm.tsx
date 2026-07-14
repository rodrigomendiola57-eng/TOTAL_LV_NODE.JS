"use client";

import { createLead } from "@/lib/api/crm";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { translateOptions } from "@/lib/i18n/asesoria-form-translations";
import {
  VENTA_CONDITION_OPTIONS,
  VENTA_EXCLUSIVE_OPTIONS,
  VENTA_OCCUPANCY_OPTIONS,
  VENTA_PROPERTY_TYPE_OPTIONS,
  VENTA_TIMELINE_OPTIONS,
  VENTA_VALUE_OPTIONS,
  VENTA_ZONE_CHIPS,
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

function buildVentaMessage(payload: {
  propertyType: string;
  valueRange: string;
  timeline: string;
  zone: string;
  condition: string;
  occupancy: string;
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
    isEn ? "[Selling Advisory]" : "[Asesoría de venta]",
    `${isEn ? "Type" : "Tipo"}: ${pick(VENTA_PROPERTY_TYPE_OPTIONS, payload.propertyType)}`,
    `${isEn ? "Estimated value" : "Valor estimado"}: ${pick(VENTA_VALUE_OPTIONS, payload.valueRange)}`,
    `${isEn ? "Timeline" : "Horizonte"}: ${pick(VENTA_TIMELINE_OPTIONS, payload.timeline)}`,
    `${isEn ? "Zone" : "Zona"}: ${pick(VENTA_ZONE_CHIPS, payload.zone)}`,
    `${isEn ? "Condition" : "Condición"}: ${pick(VENTA_CONDITION_OPTIONS, payload.condition)}`,
    `${isEn ? "Occupancy" : "Ocupación"}: ${pick(VENTA_OCCUPANCY_OPTIONS, payload.occupancy)}`,
    `${isEn ? "Exclusive" : "Exclusiva"}: ${pick(VENTA_EXCLUSIVE_OPTIONS, payload.exclusive)}`,
    payload.notes.trim()
      ? `${isEn ? "Notes" : "Notas"}: ${payload.notes.trim()}`
      : `${isEn ? "Notes" : "Notas"}: ${isEn ? "(no additional details)" : "(sin detalle adicional)"}`,
  ].join("\n");
}

export function AsesoriaVentaForm() {
  const { locale } = useLocale();
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [valueRange, setValueRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [zone, setZone] = useState("");
  const [condition, setCondition] = useState("");
  const [occupancy, setOccupancy] = useState("");
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
    setPropertyType("");
    setValueRange("");
    setTimeline("");
    setZone("");
    setCondition("");
    setOccupancy("");
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
      if (!propertyType || !valueRange || !timeline) {
        setError(locale === "en" ? "Please select type, value range, and timeline." : "Elige tipo, valor estimado y horizonte.");
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
        initial_message: buildVentaMessage({
          propertyType,
          valueRange,
          timeline,
          zone,
          condition,
          occupancy,
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
          {locale === "en" ? "An advisor will review your selling brief and contact you soon." : "Un asesor revisará tu brief de venta y te contactará pronto."}
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
      className="relative overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(200deg,rgba(255,255,255,0.05),rgba(18,18,16,0.97)_38%,rgba(10,10,10,0.99))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.4)] sm:p-7"
      noValidate
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-tl-gold/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-tl-gold/35 to-transparent"
      />

      <div className="relative flex items-end justify-between gap-3">
        <div>
          <p className="font-outfit text-[10px] font-light uppercase tracking-[0.26em] text-tl-gold/90">
            Valúa y vende
          </p>
          <h3 className="mt-2 font-outfit text-2xl font-extralight tracking-[0.02em] text-tl-beige">
            {locale === "en" ? "Selling Brief" : "Brief de venta"}
          </h3>
        </div>
        <p className="shrink-0 font-outfit text-[10px] font-light uppercase tracking-[0.18em] text-tl-beige/40">
          {step} / {TOTAL_STEPS}
        </p>
      </div>

      {/* Progress as segmented dots — distinto al barrado de compra */}
      <div className="relative mt-5 flex items-center gap-2" aria-hidden>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <span key={i} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border font-outfit text-[10px] transition-all duration-300",
                i + 1 < step
                  ? "border-tl-gold/70 bg-tl-gold/20 text-tl-gold"
                  : i + 1 === step
                    ? "border-tl-gold bg-tl-gold text-tl-black"
                    : "border-white/15 text-tl-beige/35",
              )}
            >
              {i + 1}
            </span>
            {i < TOTAL_STEPS - 1 ? (
              <span
                className={cn(
                  "h-px flex-1 transition-colors duration-300",
                  i + 1 < step ? "bg-tl-gold/50" : "bg-white/10",
                )}
              />
            ) : null}
          </span>
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
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-7 min-h-[16rem]"
        >
          {step === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <p className="sm:col-span-2 font-outfit text-sm font-extralight text-tl-beige/60">
                Datos de contacto. El navegador puede autocompletarlos.
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
                label={locale === "en" ? "Property type" : "Tipo de propiedad"}
                options={translateOptions(VENTA_PROPERTY_TYPE_OPTIONS, locale)}
                value={propertyType}
                onChange={setPropertyType}
              />
              <ChipGroup
                label={locale === "en" ? "Estimated value" : "Valor estimado"}
                options={translateOptions(VENTA_VALUE_OPTIONS, locale)}
                value={valueRange}
                onChange={setValueRange}
              />
              <ChipGroup
                label={locale === "en" ? "How soon do you want to sell?" : "¿Qué tan pronto deseas vender?"}
                options={translateOptions(VENTA_TIMELINE_OPTIONS, locale)}
                value={timeline}
                onChange={setTimeline}
              />
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <ChipGroup
                label="Zona"
                options={VENTA_ZONE_CHIPS}
                value={zone}
                onChange={setZone}
              />
              <ChipGroup
                label="Condición actual"
                options={VENTA_CONDITION_OPTIONS}
                value={condition}
                onChange={setCondition}
              />
              <ChipGroup
                label="Ocupación"
                options={VENTA_OCCUPANCY_OPTIONS}
                value={occupancy}
                onChange={setOccupancy}
              />
              <ChipGroup
                label="¿Exclusiva con Total Living?"
                options={VENTA_EXCLUSIVE_OPTIONS}
                value={exclusive}
                onChange={setExclusive}
              />
              <label className="block">
                <span className={labelClass}>Detalle opcional</span>
                <textarea
                  className={cn(fieldClass, "min-h-[5rem] resize-y")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Antigüedad, amenidades, motivo de venta… (opcional)"
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

      <div className="relative mt-7 flex flex-wrap items-center gap-3">
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
