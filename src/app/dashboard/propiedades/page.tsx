import { PropertiesManager } from "@/components/dashboard/PropertiesManager";
import { getAllProperties } from "@/lib/api";

export default async function DashboardPropertiesPage() {
  const properties = await getAllProperties();

  return <PropertiesManager properties={properties} />;
}
