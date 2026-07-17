import { DevelopmentDetailView } from "@/components/developments/detail/DevelopmentDetailView";
import { getPublicDevelopmentBySlug } from "@/lib/api/developments";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface DevelopmentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: DevelopmentDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const development = await getPublicDevelopmentBySlug(slug);

  if (!development) {
    return { title: "Desarrollo no encontrado | Total Living" };
  }

  return {
    title: `${development.name} | Desarrollos Total Living`,
    description: development.description,
  };
}

export default async function DevelopmentDetailPage({
  params,
}: DevelopmentDetailPageProps) {
  const { slug } = await params;
  const development = await getPublicDevelopmentBySlug(slug);

  if (!development) {
    notFound();
  }

  return <DevelopmentDetailView development={development} />;
}
