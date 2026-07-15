import type { MetadataRoute } from "next";

import { getAllProperties } from "@/lib/api";
import { listZonesApi } from "@/lib/api/zones";
import { getSiteOrigin } from "@/lib/site-url";

/**
 * Sitemap dinámico — Total Living.
 *
 * Genera las URLs de todas las páginas públicas + propiedades individuales +
 * anclas de zonas para que Google las indexe.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();
  const now = new Date().toISOString();

  /* ---------- Páginas estáticas ---------- */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: origin,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${origin}/propiedades/venta`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${origin}/propiedades/renta`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${origin}/propiedades/desarrollos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${origin}/zonas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${origin}/nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${origin}/asesoria`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${origin}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  /* ---------- Propiedades individuales ---------- */
  let propertyPages: MetadataRoute.Sitemap = [];
  try {
    const properties = await getAllProperties();
    propertyPages = properties.map((p) => ({
      url: `${origin}/propiedades/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    /* Si el backend no responde, devolvemos solo las estáticas. */
  }

  /* ---------- Zonas como anclas ---------- */
  let zonePages: MetadataRoute.Sitemap = [];
  try {
    const zones = await listZonesApi({ all: true, revalidate: 60 });
    zonePages = zones.map((z) => ({
      url: `${origin}/zonas#zona-${z.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    /* fallback silencioso */
  }

  return [...staticPages, ...propertyPages, ...zonePages];
}
