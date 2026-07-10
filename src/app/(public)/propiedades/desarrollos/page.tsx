import { DevelopmentsView } from "@/components/developments/DevelopmentsView";
import {
  getPublicDevelopments,
  getPublicDevelopmentsPage,
} from "@/lib/api/developments";
import type { Metadata } from "next";

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicDevelopmentsPage();
  return {
    title: page?.meta_title || "Desarrollos | Total Living",
    description:
      page?.meta_description ||
      "Desarrollos inmobiliarios de alto valor y arquitectura de autor en las zonas más exclusivas.",
  };
}

export default async function DesarrollosPage() {
  const [developments, pageContent] = await Promise.all([
    getPublicDevelopments(),
    getPublicDevelopmentsPage(),
  ]);

  return (
    <DevelopmentsView developments={developments} pageContent={pageContent} />
  );
}
