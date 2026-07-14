export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export const LOCALE_COOKIE = "tl_locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  es: "ES",
  en: "EN",
};

export function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en";
}

export function normalizeLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
