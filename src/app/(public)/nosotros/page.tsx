import { AboutView } from "@/components/about/AboutView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros | Total Living",
  description:
    "Conoce a Total Living: filosofía, valores, misión, visión, equipo y organigrama. Estrategia real detrás de cada propiedad en Querétaro.",
};

export default function NosotrosPage() {
  return <AboutView />;
}
