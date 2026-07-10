export function formatPrice(value: string, currency: string): string {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return `${value} ${currency}`;

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(parsed);
}
