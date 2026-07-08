import { PropertiesManager } from "@/components/dashboard/PropertiesManager";
import { getAllProperties } from "@/lib/api";

export default async function DashboardDevelopmentsPage() {
  const properties = await getAllProperties({ property_type: "Condominio" });

  return (
    <PropertiesManager
      properties={properties}
      title="Desarrollos"
      description="Gestiona proyectos en preventa y desarrollos inmobiliarios de la marca."
    />
  );
}
