export function formatMapPinPrice(value: string, currency: string): string {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return value;

  if (parsed >= 1_000_000) {
    const millions = parsed / 1_000_000;
    const formatted =
      millions >= 10
        ? Math.round(millions).toString()
        : millions.toFixed(1).replace(/\.0$/, "");
    return `$${formatted}M`;
  }

  if (parsed >= 1_000) {
    const thousands = parsed / 1_000;
    const formatted =
      thousands >= 100
        ? Math.round(thousands).toString()
        : thousands.toFixed(1).replace(/\.0$/, "");
    return `$${formatted}k`;
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(parsed);
}
