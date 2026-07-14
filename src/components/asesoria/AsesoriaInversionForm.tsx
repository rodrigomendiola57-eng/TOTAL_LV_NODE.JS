"use client";

import { createLead } from "@/lib/api/crm";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { translateOptions } from "@/lib/i18n/asesoria-form-translations";
import {
  INVERSION_ASSET_OPTIONS,
  INVERSION_CAPITAL_OPTIONS,
  INVERSION_EXPERIENCE_OPTIONS,
  INVERSION_HORIZON_OPTIONS,
  INVERSION_LIQUIDITY_OPTIONS,
  INVERSION_OBJECTIVE_OPTIONS,
  INVERSION_ZONE_CHIPS,
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

function buildInversionMessage(payload: {
  capital: string;
  objective: string;
  horizon: string;
  asset: string;
  zone: string;
  experience: string;
  liquidity: string;
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
    isEn ? "[Investment Advisory]" : "[Asesoría de inversión]",
    `${isEn ? "Capital" : "Capital"}: ${pick(INVERSION_CAPITAL_OPTIONS, payload.capital)}`,
    `${isEn ? "Objective" : "Objetivo"}: ${pick(INVERSION_OBJECTIVE_OPTIONS, payload.objective)}`,
    `${isEn ? "Horizon" : "Horizonte"}: ${pick(INVERSION_HORIZON_OPTIONS, payload.horizon)}`,
    `${isEn ? "Asset type" : "Activo"}: ${pick(INVERSION_ASSET_OPTIONS, payload.asset)}`,
    `${isEn ? "Focus zone" : "Zona foco"}: ${pick(INVERSION_ZONE_CHIPS, payload.zone)}`,
    `${isEn ? "Experience" : "Experiencia"}: ${pick(INVERSION_EXPERIENCE_OPTIONS, payload.experience)}`,
    `${isEn ? "Liquidity preference" : "Liquidez"}: ${pick(INVERSION_LIQUIDITY_OPTIONS, payload.liquidity)}`,
    payload.notes.trim()
      ? `${isEn ? "Notes" : "Notas"}: ${payload.notes.trim()}`
      : `${isEn ? "Notes" : "Notas"}: ${isEn ? "(no additional details)" : "(sin detalle adicional)"}`,
  ].join("\n");
}

export function AsesoriaInversionForm() {
  const { locale } = useLocale();
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [capital, setCapital] = useState("");
  const [objective, setObjective] = useState("");
  const [horizon, setHorizon] = useState("");
  const [asset, setAsset] = useState("");
  const [zone, setZone] = useState("");
  const [experience, setExperience] = useState("");
  const [liquidity, setLiquidity] = useState("");
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
    setCapital("");
    setObjective("");
    setHorizon("");
    setAsset("");
    setZone("");
    setExperience("");
    setLiquidity("");
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
      if (!capital || !objective || !horizon) {
        setError(locale === "en" ? "Please select capital, objective, and horizon." : "Elige capital, objetivo y horizonte.");
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
        initial_message: buildInversionMessage({
          capital,
          objective,
          horizon,
          asset,
          zone,
          experience,
          liquidity,
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
          {locale === "en" ? "Profile received" : "Perfil recibido"}
        </p>
        <p className="mt-2 max-w-sm font-outfit text-sm font-extralight text-tl-beige/65">
          {locale === "en" ? "An advisor will review your investment profile and contact you with opportunities aligned to your capital and horizon." : "Un asesor revisará tu perfil de inversión y te contactará con oportunidades alineadas a tu capital y horizonte."}
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
      className="relative overflow-hidden rounded-2xl border border-tl-gold/20 bg-[linear-gradient(165deg,rgba(214,181,133,0.07),rgba(18,18,16,0.96)_42%,rgba(10,10,10,0.98))] p-5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-7"
      noValidate
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-tl-gold/45 to-transparent"
      />

      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-outfit text-[10px] font-light uppercase tracking-[0.26em] text-tl-gold/90">
            {locale === "en" ? "Capital profile" : "Perfil de capital"}
          </p>
          <h3 className="mt-2 font-outfit text-2xl font-extralight tracking-[0.02em] text-tl-beige">
            {locale === "en" ? "Investment Brief" : "Brief de inversión"}
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
                {locale === "en" ? "Your contact info. Autofill is supported." : "Datos de contacto. El navegador puede autocompletarlos."}
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
                label={locale === "en" ? "Capital to invest" : "Capital a invertir"}
                options={translateOptions(INVERSION_CAPITAL_OPTIONS, locale)}
                value={capital}
                onChange={setCapital}
              />
              <ChipGroup
                label={locale === "en" ? "Primary objective" : "Objetivo principal"}
                options={translateOptions(INVERSION_OBJECTIVE_OPTIONS, locale)}
                value={objective}
                onChange={setObjective}
              />
              <ChipGroup
                label={locale === "en" ? "Investment horizon" : "Horizonte de inversión"}
                options={translateOptions(INVERSION_HORIZON_OPTIONS, locale)}
                value={horizon}
                onChange={setHorizon}
              />
              <ChipGroup
                label={locale === "en" ? "Asset type" : "Tipo de activo"}
                options={translateOptions(INVERSION_ASSET_OPTIONS, locale)}
                value={asset}
                onChange={setAsset}
              />
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <ChipGroup
                label={locale === "en" ? "Zone of interest" : "Zona de interés"}
                options={translateOptions(INVERSION_ZONE_CHIPS, locale)}
                value={zone}
                onChange={setZone}
              />
              <ChipGroup
                label={locale === "en" ? "Investor experience" : "Experiencia inversionista"}
                options={translateOptions(INVERSION_EXPERIENCE_OPTIONS, locale)}
                value={experience}
                onChange={setExperience}
              />
              <ChipGroup
                label={locale === "en" ? "Liquidity preference" : "Preferencia de liquidez"}
                options={translateOptions(INVERSION_LIQUIDITY_OPTIONS, locale)}
                value={liquidity}
                onChange={setLiquidity}
              />
              <label className="block">
                <span className={labelClass}>{locale === "en" ? "Optional details" : "Detalle opcional"}</span>
                <textarea
                  className={cn(fieldClass, "min-h-[5rem] resize-y")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={locale === "en" ? "Target return, exit timeframe, restrictions... (optional)" : "Meta de rendimiento, plazo de salida, restricciones… (opcional)"}
                  rows={2}
                />
              </label>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {error ? (
        <p
          role="alert"
          className="mt-4 font-outfit text-sm font-extralight text-red-300/95"
        >
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
            {loading ? (locale === "en" ? "Sending..." : "Enviando…") : (locale === "en" ? "Send profile" : "Enviar perfil")}
          </button>
        )}
      </div>
    </form>
  );
}
