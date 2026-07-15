import { ContactView } from "@/components/contact/ContactView";
import { getPropertyById } from "@/lib/api";
import { getPublicContactPageContent } from "@/lib/api/contact";
import {
  LOCALE_COOKIE,
  normalizeLocale,
} from "@/lib/i18n/locales";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getSiteOrigin } from "@/lib/site-url";

interface ContactoPageProps {
  searchParams: Promise<{ propiedad?: string }>;
}

async function getLocaleFromCookies() {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromCookies();
  const content = await getPublicContactPageContent(locale);
  return {
    title: content.seo.title,
    description: content.seo.description,
    alternates: {
      canonical: "/contacto",
    },
  };
}

export default async function ContactoPage({ searchParams }: ContactoPageProps) {
  const locale = await getLocaleFromCookies();
  const [params, content] = await Promise.all([
    searchParams,
    getPublicContactPageContent(locale),
  ]);
  const propertyId = params.propiedad?.trim();

  let propertyContext: { id: number; title: string } | null = null;

  if (propertyId) {
    const property = await getPropertyById(propertyId);
    if (property) {
      propertyContext = {
        id: property.id,
        title: property.title,
      };
    }
  }

  const origin = getSiteOrigin();
  const breadcrumbs = [
    { name: "Inicio", url: origin },
    { name: "Contacto", url: `${origin}/contacto` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <ContactView content={content} propertyContext={propertyContext} />
    </>
  );
}
