"use client";

import { PropertyCatalogError } from "@/components/properties/PropertyCatalogError";

export default function PropiedadesVentaError({
  reset,
}: {
  reset: () => void;
}) {
  return <PropertyCatalogError reset={reset} />;
}
