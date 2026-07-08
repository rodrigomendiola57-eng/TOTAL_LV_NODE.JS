import { VENTA_CATALOG } from "@/components/properties/catalog-config";
import { PropertyListingView } from "@/components/properties/PropertyListingView";
import { getProperties } from "@/lib/api";

export default async function PropiedadesVentaPage() {
  const properties = await getProperties({ category: "Venta" });

  return <PropertyListingView properties={properties} config={VENTA_CATALOG} />;
}
