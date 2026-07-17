import { PropertiesManager } from "@/components/dashboard/PropertiesManager";
import { getDashboardProperties } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DashboardPropertiesPage() {
  const properties = await getDashboardProperties();

  return <PropertiesManager properties={properties} />;
}
