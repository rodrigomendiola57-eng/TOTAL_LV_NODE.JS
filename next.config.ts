import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const isProd = process.env.NODE_ENV === "production";

/**
 * CSP pragmática para Total Living:
 * - Google Maps / gstatic
 * - Matterport iframes
 * - Unsplash + media Django
 * - WebGL (blob/data/worker)
 * Next aún necesita 'unsafe-inline' en style/script en muchas builds.
 */
function buildContentSecurityPolicy(): string {
  const directives = [
    "default-src 'self'",
    [
      "script-src",
      "'self'",
      "'unsafe-inline'",
      isProd ? null : "'unsafe-eval'",
      "https://maps.googleapis.com",
      "https://maps.gstatic.com",
      "https://*.googleapis.com",
      "https://*.gstatic.com",
    ]
      .filter(Boolean)
      .join(" "),
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    [
      "img-src",
      "'self'",
      "data:",
      "blob:",
      "https:",
      "http://127.0.0.1:8000",
      "http://localhost:8000",
    ].join(" "),
    "font-src 'self' data: https://fonts.gstatic.com",
    [
      "connect-src",
      "'self'",
      "https://maps.googleapis.com",
      "https://*.googleapis.com",
      "https://*.gstatic.com",
      "https://images.unsplash.com",
      // CSP no permite *.s3.*.amazonaws.com (wildcard anidado inválido)
      "https://*.s3.amazonaws.com",
      "https://*.s3.us-east-1.amazonaws.com",
      "https://*.s3.us-east-2.amazonaws.com",
      "https://*.s3.us-west-1.amazonaws.com",
      "https://*.s3.us-west-2.amazonaws.com",
      "https://*.r2.dev",
      isProd ? null : "ws:",
      isProd ? null : "wss:",
      isProd ? null : "http://127.0.0.1:8000",
      isProd ? null : "http://localhost:8000",
    ]
      .filter(Boolean)
      .join(" "),
    "frame-src 'self' https://my.matterport.com https://*.matterport.com",
    "worker-src 'self' blob:",
    // Videos del hero/feed viven en S3/R2 (no solo /public)
    [
      "media-src",
      "'self'",
      "blob:",
      "data:",
      "https://*.s3.amazonaws.com",
      "https://*.s3.us-east-1.amazonaws.com",
      "https://*.s3.us-east-2.amazonaws.com",
      "https://*.s3.us-west-1.amazonaws.com",
      "https://*.s3.us-west-2.amazonaws.com",
      "https://*.r2.dev",
      "https://*.cloudflarestorage.com",
    ].join(" "),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    ...(isProd ? ["upgrade-insecure-requests"] : []),
  ];
  return directives.join("; ");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: buildContentSecurityPolicy(),
  },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  // Permite abrir `npm run dev` vía ngrok en el celular (JS, menú, animaciones).
  allowedDevOrigins: [
    "*.ngrok-free.dev",
    "*.ngrok-free.app",
    "*.ngrok.io",
    "*.ngrok.app",
  ],
  ...(isGithubPages
    ? {
        output: "export",
        trailingSlash: true,
      }
    : {}),
  ...(basePath
    ? {
        basePath,
        assetPrefix: `${basePath}/`,
      }
    : {}),
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // S3 / CloudFront / R2 (docs/S3_MEDIA.md)
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudflarestorage.com",
        pathname: "/**",
      },
      ...(process.env.NEXT_PUBLIC_MEDIA_CDN_HOST
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.NEXT_PUBLIC_MEDIA_CDN_HOST.replace(
                /^https?:\/\//,
                "",
              ).replace(/\/$/, ""),
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
  // headers() no aplica con output: "export" (GitHub Pages).
  async headers() {
    if (isGithubPages) return [];
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
