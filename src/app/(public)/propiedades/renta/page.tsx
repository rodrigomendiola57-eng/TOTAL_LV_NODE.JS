import { RENTA_CATALOG } from "@/components/properties/catalog-config";
import { PropertyListingView } from "@/components/properties/PropertyListingView";
import { getProperties } from "@/lib/api";

export default async function PropiedadesRentaPage() {
  const properties = await getProperties({ category: "Renta" });

  return <PropertyListingView properties={properties} config={RENTA_CATALOG} />;
}
