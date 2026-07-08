/**
 * Utilidades compartidas del portal Total Living.
 * Punto de entrada para helpers reutilizables.
 */

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
