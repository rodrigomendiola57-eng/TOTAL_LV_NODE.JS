/**
 * Contenido estático del módulo Asesoría.
 * Base tipada para futura UI/CMS sin acoplar aún a Django.
 */

export type AsesoriaHeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
};

export type AsesoriaFeature = {
  icon: string;
  title: string;
  description: string;
  /** Detalle corto extra (desktop). */
  detail?: string;
};

export type AsesoriaProcessStep = {
  id: string;
  title: string;
  description: string;
};

export type AsesoriaInvestmentMetric = {
  id: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type AsesoriaOpportunityZone = {
  id: string;
  name: string;
  /** Presión de demanda, 0–100. */
  demandScore: number;
  roiLabel: string;
  note: string;
};

export type AsesoriaTab = {
  id: string;
  tabLabel: string;
  title: string;
  description: string;
  features: AsesoriaFeature[];
  whatsappMessage: string;
  /** Compra / Venta: pasos del proceso. */
  process?: AsesoriaProcessStep[];
  /** Solo Inversión por ahora: KPIs y radar de oportunidad. */
  investmentMetrics?: AsesoriaInvestmentMetric[];
  opportunityZones?: AsesoriaOpportunityZone[];
};

export type AsesoriaPillar = {
  id: string;
  title: string;
  description: string;
};

export type AsesoriaCtaContent = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  whatsappMessage: string;
};

export type AsesoriaPageContent = {
  hero: AsesoriaHeroContent;
  tabs: AsesoriaTab[];
  pillars: AsesoriaPillar[];
  cta: AsesoriaCtaContent;
};

/** Opciones del formulario de asesoría de compra. */
export const COMPRA_BUDGET_OPTIONS = [
  { value: "2-4m", label: "$2 – $4 MDP" },
  { value: "4-7m", label: "$4 – $7 MDP" },
  { value: "7-12m", label: "$7 – $12 MDP" },
  { value: "12-20m", label: "$12 – $20 MDP" },
  { value: "20m+", label: "Más de $20 MDP" },
  { value: "por-definir", label: "Por definir con asesor" },
] as const;

export const COMPRA_PROPERTY_TYPE_OPTIONS = [
  { value: "Casa", label: "Casa" },
  { value: "Departamento", label: "Departamento" },
  { value: "Penthouse", label: "Penthouse" },
  { value: "Casa en condominio", label: "Casa en condominio" },
  { value: "Terreno", label: "Terreno" },
  { value: "Indistinto", label: "Indistinto" },
] as const;

export const COMPRA_TIMELINE_OPTIONS = [
  { value: "inmediato", label: "0–30 días" },
  { value: "1-3m", label: "1–3 meses" },
  { value: "3-6m", label: "3–6 meses" },
  { value: "explorando", label: "Solo exploro" },
] as const;

export const COMPRA_BEDROOM_OPTIONS = [
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "indistinto", label: "Indistinto" },
] as const;

export const COMPRA_ZONE_CHIPS = [
  { value: "Zona Juriquilla / Jurica", label: "Juriquilla" },
  { value: "Zona Campanario / Altozano", label: "Campanario" },
  { value: "Zona Zibatá / Zakia", label: "Zibatá" },
  { value: "Zona Corregidora", label: "Corregidora" },
  { value: "Zona Centro / Querétaro Tradicional", label: "Centro" },
  { value: "Zona El Refugio / Norte de El Marqués", label: "El Refugio" },
  { value: "indistinto", label: "Indistinto" },
] as const;

export const COMPRA_FINANCING_OPTIONS = [
  { value: "contado", label: "Contado" },
  { value: "credito", label: "Crédito" },
  { value: "mixto", label: "Mixto" },
  { value: "por-definir", label: "Por definir" },
] as const;

export const COMPRA_EXCLUSIVE_OPTIONS = [
  { value: "si", label: "Sí, exclusivo" },
  { value: "no", label: "Aún no" },
] as const;

/** Opciones del formulario de asesoría de venta. */
export const VENTA_PROPERTY_TYPE_OPTIONS = [
  { value: "Casa", label: "Casa" },
  { value: "Departamento", label: "Departamento" },
  { value: "Penthouse", label: "Penthouse" },
  { value: "Casa en condominio", label: "Casa en condominio" },
  { value: "Terreno", label: "Terreno" },
  { value: "Otro", label: "Otro" },
] as const;

export const VENTA_VALUE_OPTIONS = [
  { value: "2-4m", label: "$2 – $4 MDP" },
  { value: "4-7m", label: "$4 – $7 MDP" },
  { value: "7-12m", label: "$7 – $12 MDP" },
  { value: "12-20m", label: "$12 – $20 MDP" },
  { value: "20m+", label: "Más de $20 MDP" },
  { value: "por-definir", label: "Aún no lo sé" },
] as const;

export const VENTA_TIMELINE_OPTIONS = [
  { value: "urgente", label: "Lo antes posible" },
  { value: "1-3m", label: "1–3 meses" },
  { value: "3-6m", label: "3–6 meses" },
  { value: "sin-prisa", label: "Sin prisa" },
] as const;

export const VENTA_ZONE_CHIPS = [
  { value: "Zona Juriquilla / Jurica", label: "Juriquilla" },
  { value: "Zona Campanario / Altozano", label: "Campanario" },
  { value: "Zona Zibatá / Zakia", label: "Zibatá" },
  { value: "Zona Corregidora", label: "Corregidora" },
  { value: "Zona Centro / Querétaro Tradicional", label: "Centro" },
  { value: "Zona El Refugio / Norte de El Marqués", label: "El Refugio" },
  { value: "otra", label: "Otra zona" },
] as const;

export const VENTA_CONDITION_OPTIONS = [
  { value: "lista", label: "Lista para mostrar" },
  { value: "mejoras-menores", label: "Mejoras menores" },
  { value: "remodelacion", label: "Necesita remodelación" },
  { value: "por-definir", label: "Por definir" },
] as const;

export const VENTA_EXCLUSIVE_OPTIONS = [
  { value: "si", label: "Sí, exclusiva" },
  { value: "explorando", label: "Estoy explorando" },
  { value: "no", label: "Prefiero no exclusivo" },
] as const;

export const VENTA_OCCUPANCY_OPTIONS = [
  { value: "vacia", label: "Vacía" },
  { value: "habitada", label: "Habitada" },
  { value: "rentada", label: "Rentada" },
] as const;

/** Opciones del formulario de asesoría de inversión. */
export const INVERSION_CAPITAL_OPTIONS = [
  { value: "1-2m", label: "$1 – $2 MDP" },
  { value: "2-4m", label: "$2 – $4 MDP" },
  { value: "4-7m", label: "$4 – $7 MDP" },
  { value: "7-12m", label: "$7 – $12 MDP" },
  { value: "12m+", label: "Más de $12 MDP" },
  { value: "por-definir", label: "Por definir con asesor" },
] as const;

export const INVERSION_OBJECTIVE_OPTIONS = [
  { value: "plusvalia", label: "Plusvalía" },
  { value: "renta", label: "Flujo de renta" },
  { value: "mixto", label: "Mixto" },
  { value: "preservar", label: "Preservar capital" },
] as const;

export const INVERSION_HORIZON_OPTIONS = [
  { value: "corto", label: "1–3 años" },
  { value: "medio", label: "3–5 años" },
  { value: "largo", label: "5+ años" },
  { value: "explorando", label: "Aún exploro" },
] as const;

export const INVERSION_ASSET_OPTIONS = [
  { value: "Departamento", label: "Departamento" },
  { value: "Casa", label: "Casa" },
  { value: "Terreno", label: "Terreno" },
  { value: "Preventa", label: "Preventa / desarrollo" },
  { value: "Indistinto", label: "Indistinto" },
] as const;

export const INVERSION_ZONE_CHIPS = [
  { value: "Zona Juriquilla / Jurica", label: "Juriquilla" },
  { value: "Zona Campanario / Altozano", label: "Campanario" },
  { value: "Zona Zibatá / Zakia", label: "Zibatá" },
  { value: "Zona Corregidora", label: "Corregidora" },
  { value: "Zona Centro Sur / Sur de Querétaro", label: "Centro Sur" },
  { value: "Zona El Refugio / Norte de El Marqués", label: "El Refugio" },
  { value: "Zona Centro / Querétaro Tradicional", label: "Centro" },
  { value: "Zona Ciudad del Sol / Poniente", label: "Ciudad del Sol" },
  { value: "indistinto", label: "Indistinto" },
] as const;

export const INVERSION_EXPERIENCE_OPTIONS = [
  { value: "primera", label: "Primera inversión" },
  { value: "alguna", label: "Ya he invertido" },
  { value: "portafolio", label: "Tengo portafolio" },
] as const;

export const INVERSION_LIQUIDITY_OPTIONS = [
  { value: "alta", label: "Alta liquidez" },
  { value: "media", label: "Equilibrio" },
  { value: "baja", label: "Puedo esperar" },
] as const;

export const ASESORIA_PAGE_DEFAULT: AsesoriaPageContent = {
  hero: {
    eyebrow: "Total Living · Asesoría",
    title: "Asesoría inmobiliaria",
    subtitle:
      "Te acompañamos a comprar, vender o invertir con criterio: opciones claras, datos reales y un asesor dedicado en cada paso.",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
  },
  tabs: [
    {
      id: "compra",
      tabLabel: "Compra",
      title: "Asesoría de compra",
      description:
        "De un mercado saturado de opciones a una ruta clara: perfilamos tu búsqueda, filtramos con criterio y te acompañamos hasta la firma.",
      whatsappMessage: "Hola, me interesa la asesoría de compra de Total Living.",
      process: [
        {
          id: "brief",
          title: "Brief estratégico",
          description:
            "Presupuesto, zona, estilo de vida y horizonte. Definimos qué sí y qué no.",
        },
        {
          id: "shortlist",
          title: "Shortlist curada",
          description:
            "Solo propiedades que cumplen el brief. Sin ruido, sin tours innecesarios.",
        },
        {
          id: "visitas",
          title: "Visitas con criterio",
          description:
            "Recorridos enfocados, lectura de plusvalía y comparación objetiva.",
        },
        {
          id: "cierre",
          title: "Negociación y cierre",
          description:
            "Oferta, revisión documental y acompañamiento notarial hasta la escritura.",
        },
      ],
      features: [
        {
          icon: "Search",
          title: "Filtrado inteligente",
          description:
            "Cruzamos presupuesto, zona y estilo de vida para llegar solo a lo que sí hace sentido.",
          detail: "Shortlist curada · sin ruido",
        },
        {
          icon: "FileCheck",
          title: "Acompañamiento documental",
          description:
            "Revisión legal y notarial de punta a punta, sin sorpresas ni letras pequeñas.",
          detail: "Due diligence · cierre seguro",
        },
        {
          icon: "Handshake",
          title: "Negociación táctica",
          description:
            "Defendemos tu presupuesto con datos de mercado, no con intuición.",
          detail: "Comparables · oferta óptima",
        },
        {
          icon: "MapPin",
          title: "Lectura de zona",
          description:
            "Plusvalía, conectividad y proyección real en Querétaro antes de decidir.",
          detail: "Contexto local · plusvalía",
        },
      ],
    },
    {
      id: "venta",
      tabLabel: "Venta",
      title: "Asesoría de venta",
      description:
        "Posicionamos tu propiedad para vender al precio justo, en el tiempo correcto — con estrategia, no con prisa.",
      whatsappMessage: "Hola, quiero una asesoría de venta con Total Living.",
      process: [
        {
          id: "valoracion",
          title: "Valoración real",
          description:
            "Comparables, absorción y precio de salida que el mercado sí paga.",
        },
        {
          id: "preparacion",
          title: "Preparación",
          description:
            "Staging, narrativa y assets visuales para destacar desde el primer scroll.",
        },
        {
          id: "exposicion",
          title: "Exposición selectiva",
          description:
            "Canales premium y filtro de prospectos: menos visitas, más calidad.",
        },
        {
          id: "negociacion",
          title: "Negociación y cierre",
          description:
            "Ofertas, contraofertas y acompañamiento hasta la firma notarial.",
        },
      ],
      features: [
        {
          icon: "LineChart",
          title: "Valoración estratégica",
          description:
            "Precio de salida basado en comparables reales, no en cifras optimistas.",
          detail: "Pricing · absorción",
        },
        {
          icon: "Sparkles",
          title: "Marketing premium",
          description:
            "Fotografía, narrativa y medios de alto nivel para propiedades que compiten por atención.",
          detail: "Story · visuales",
        },
        {
          icon: "Users",
          title: "Perfilamiento de prospectos",
          description:
            "Filtramos interesados reales antes de abrir la puerta de tu propiedad.",
          detail: "Calidad · no volumen",
        },
        {
          icon: "Handshake",
          title: "Negociación con datos",
          description:
            "Defendemos tu precio con evidencia de mercado y timing, no con presión.",
          detail: "Oferta · cierre",
        },
      ],
    },
    {
      id: "inversion",
      tabLabel: "Inversión",
      title: "Asesoría de inversión",
      description:
        "Leemos el mercado antes de que se mueva, para que tu capital llegue primero.",
      whatsappMessage:
        "Hola, quiero asesoría de inversión inmobiliaria con Total Living.",
      // KPIs y radar: ver inversion-zone-metrics.ts (datos por zona, interactivos en UI).
      features: [
        {
          icon: "TrendingUp",
          title: "Oferta y demanda",
          description:
            "Identificamos zonas con presión de demanda real antes de que suban de precio.",
        },
        {
          icon: "Target",
          title: "Estrategia de colocación",
          description:
            "Definimos el momento y el canal correctos para vender o rentar con ventaja.",
        },
        {
          icon: "PiggyBank",
          title: "Maximización de ROI",
          description:
            "Modelamos plusvalía, renta y horizonte de salida antes de comprometer capital.",
        },
      ],
    },
  ],
  pillars: [
    {
      id: "analisis",
      title: "Análisis de mercado",
      description: "Datos y contexto local de Querétaro antes de cada recomendación.",
    },
    {
      id: "acompanamiento",
      title: "Acompañamiento",
      description: "Un asesor dedicado, disponible en cada etapa del proceso.",
    },
    {
      id: "resultado",
      title: "Resultado",
      description:
        "Priorizamos decisiones que mueven tu patrimonio, no volumen de opciones.",
    },
  ],
  cta: {
    title: "¿Listo para trazar tu ruta?",
    subtitle:
      "Una primera conversación sin costo para entender tu objetivo y proponer el siguiente paso.",
    ctaLabel: "Contactar a un asesor",
    whatsappMessage: "Hola, quiero agendar una asesoría inmobiliaria con Total Living.",
  },
};
