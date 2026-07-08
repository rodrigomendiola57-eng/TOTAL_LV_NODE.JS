"use client";

import { PropertyCatalogError } from "@/components/properties/PropertyCatalogError";

export default function PropiedadesRentaError({
  reset,
}: {
  reset: () => void;
}) {
  return <PropertyCatalogError reset={reset} />;
}
