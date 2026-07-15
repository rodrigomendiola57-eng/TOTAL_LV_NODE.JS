import { DevelopmentsView } from "@/components/developments/DevelopmentsView";
import {
  getPublicDevelopments,
  getPublicDevelopmentsPage,
} from "@/lib/api/developments";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getSiteOrigin } from "@/lib/site-url";

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicDevelopmentsPage();
  return {
    title: page?.meta_title || "Desarrollos Inmobiliarios en Querétaro",
    description:
      page?.meta_description ||
      "Desarrollos inmobiliarios de alto valor y arquitectura de autor en las zonas más exclusivas.",
    alternates: {
      canonical: "/propiedades/desarrollos",
    },
  };
}

export default async function DesarrollosPage() {
  const [developments, pageContent] = await Promise.all([
    getPublicDevelopments(),
    getPublicDevelopmentsPage(),
  ]);

  const origin = getSiteOrigin();
  const breadcrumbs = [
    { name: "Inicio", url: origin },
    { name: "Desarrollos", url: `${origin}/propiedades/desarrollos` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <DevelopmentsView developments={developments} pageContent={pageContent} />
    </>
  );
}
