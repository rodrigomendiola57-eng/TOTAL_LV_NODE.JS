"use client";

import { PropertyCatalogError } from "@/components/properties/PropertyCatalogError";

export default function DesarrollosError({
  reset,
}: {
  reset: () => void;
}) {
  return <PropertyCatalogError reset={reset} />;
}
