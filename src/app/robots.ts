import type { MetadataRoute } from "next";

import { getSiteOrigin } from "@/lib/site-url";

/**
 * robots.txt dinámico — Total Living.
 *
 * - Permite todo el sitio público.
 * - Bloquea el dashboard, login y rutas de API internas.
 * - Apunta al sitemap generado por Next.js.
 */
export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/login",
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
