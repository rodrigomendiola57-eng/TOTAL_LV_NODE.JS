import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat, Outfit } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

/** Tipografía primaria — títulos y encabezados de marca. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/** Tipografía de cuerpo — manual de marca. */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

/** Tipografía de textos — redonda, delgada y minimalista. */
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
        : "http://localhost:3000"),
  ),
  title: {
    default: "Total Living | Inmobiliaria Premium en Querétaro — Venta, Renta e Inversión",
    template: "%s | Total Living",
  },
  description:
    "Total Living — inmobiliaria premium en Querétaro. Casas, departamentos y terrenos en venta y renta en Juriquilla, Zibatá, Campanario, Centro y más. Asesoría estratégica e inversión inmobiliaria.",
  keywords: [
    "inmobiliaria Querétaro",
    "casas en venta Querétaro",
    "departamentos en renta Querétaro",
    "propiedades premium Querétaro",
    "bienes raíces Querétaro",
    "inversión inmobiliaria Querétaro",
    "Juriquilla",
    "Zibatá",
    "Campanario",
    "Total Living",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Total Living",
    title: "Total Living | Inmobiliaria Premium en Querétaro",
    description:
      "Casas, departamentos y terrenos en las zonas más exclusivas de Querétaro. Venta, renta, desarrollos e inversión con asesoría estratégica.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Total Living | Inmobiliaria Premium en Querétaro",
    description:
      "Propiedades premium en Querétaro: Juriquilla, Zibatá, Campanario y más. Estrategia real detrás de cada propiedad.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${montserrat.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#1a1a18] text-tl-beige">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        {children}
      </body>
    </html>
  );
}
