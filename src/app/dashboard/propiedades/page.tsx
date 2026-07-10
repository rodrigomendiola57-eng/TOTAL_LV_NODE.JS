import { PropertiesManager } from "@/components/dashboard/PropertiesManager";
import { getDashboardProperties } from "@/lib/api";

export const revalidate = 20;

export default async function DashboardPropertiesPage() {
  const properties = await getDashboardProperties();

  return <PropertiesManager properties={properties} />;
}
