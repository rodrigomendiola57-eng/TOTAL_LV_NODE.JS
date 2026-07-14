import { HOME_HERO_VIDEO } from "@/lib/hero-media";

export type HomeJournalKind = "text" | "image" | "video";

export interface HomeJournalItem {
  id: string;
  kind: HomeJournalKind;
  category: string;
  title: string;
  body: string;
  dateLabel?: string;
  imageUrl?: string;
  videoUrl?: string;
}

/** Máximo de recuadros en Novedades (desktop grid + móvil). */
export const HOME_JOURNAL_FALLBACK_MAX = 12;

/**
 * Fallback del feed — exactamente 4 posts.
 */
export const HOME_JOURNAL_ITEMS: HomeJournalItem[] = [
  {
    id: "formacion-continua",
    kind: "video",
    category: "Equipo",
    title: "Formación continua",
    body: "Escrituración, due diligence documental y criterios fiscales: lo que aprendimos lo aplicamos en cada operación con el cliente.",
    dateLabel: "Hoy",
    imageUrl: "/images/home/formacion-continua-poster.jpg",
    videoUrl: HOME_HERO_VIDEO,
  },
  {
    id: "img-residencia",
    kind: "image",
    category: "En el mercado",
    title: "Residencia en preventa",
    body: "Acabados de lujo · norte de Querétaro. Una lectura de plusvalía con criterio de zona.",
    dateLabel: "2 d",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "texto-promo",
    kind: "text",
    category: "Promoción",
    title: "1 mes de renta gratis",
    body: "Departamentos amueblados con amenidades. Vigencia limitada este trimestre — pregunta por disponibilidad.",
    dateLabel: "4 d",
  },
  {
    id: "video-notaria",
    kind: "video",
    category: "Capacitación",
    title: "En la Notaría 31-69",
    body: "El equipo Total Living reforzó aspectos notariales, jurídicos y fiscales para cerrar con más certeza.",
    dateLabel: "Hoy",
    imageUrl:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
    videoUrl: HOME_HERO_VIDEO,
  },
];
