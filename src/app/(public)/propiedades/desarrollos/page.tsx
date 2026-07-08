import { DESARROLLOS_CATALOG } from "@/components/properties/catalog-config";
import { PropertyListingView } from "@/components/properties/PropertyListingView";
import { getProperties } from "@/lib/api";

export default async function DesarrollosPage() {
  const properties = await getProperties({ property_type: "Condominio" });

  return (
    <PropertyListingView properties={properties} config={DESARROLLOS_CATALOG} />
  );
}
