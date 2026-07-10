import { DevelopmentModelView } from "@/components/developments/detail/DevelopmentModelView";
import { getDevelopmentModel, getDevelopments } from "@/lib/mock/developments";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ModelPageProps {
  params: Promise<{ slug: string; modelSlug: string }>;
}

export function generateStaticParams() {
  return getDevelopments().flatMap((development) =>
    development.models.map((model) => ({
      slug: development.slug,
      modelSlug: model.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: ModelPageProps): Promise<Metadata> {
  const { slug, modelSlug } = await params;
  const result = getDevelopmentModel(slug, modelSlug);

  if (!result) {
    return { title: "Modelo no encontrado | Total Living" };
  }

  return {
    title: `${result.model.name} · ${result.development.name} | Total Living`,
    description: result.model.description,
  };
}

export default async function DevelopmentModelPage({ params }: ModelPageProps) {
  const { slug, modelSlug } = await params;
  const result = getDevelopmentModel(slug, modelSlug);

  if (!result) {
    notFound();
  }

  return (
    <DevelopmentModelView
      development={result.development}
      model={result.model}
    />
  );
}
