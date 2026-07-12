import { DevelopmentModelView } from "@/components/developments/detail/DevelopmentModelView";
import {
  getPublicDevelopmentBySlug,
  getPublicDevelopments,
} from "@/lib/api/developments";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ModelPageProps {
  params: Promise<{ slug: string; modelSlug: string }>;
}

export const revalidate = 30;

export async function generateStaticParams() {
  try {
    const developments = await getPublicDevelopments();
    return developments.flatMap((development) =>
      development.models.map((model) => ({
        slug: development.slug,
        modelSlug: model.slug,
      })),
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ModelPageProps): Promise<Metadata> {
  const { slug, modelSlug } = await params;
  const development = await getPublicDevelopmentBySlug(slug);
  const model = development?.models.find((item) => item.slug === modelSlug);

  if (!development || !model) {
    return { title: "Modelo no encontrado | Total Living" };
  }

  return {
    title: `${model.name} · ${development.name} | Total Living`,
    description: model.description,
  };
}

export default async function DevelopmentModelPage({ params }: ModelPageProps) {
  const { slug, modelSlug } = await params;
  const development = await getPublicDevelopmentBySlug(slug);
  const model = development?.models.find((item) => item.slug === modelSlug);

  if (!development || !model) {
    notFound();
  }

  return (
    <DevelopmentModelView development={development} model={model} />
  );
}
