import type { CompanyProfile } from "@/types/company";

export const COMPANY_PROFILE: CompanyProfile = {
  hero: {
    eyebrow: "Total Living · Nosotros",
    titleLines: ["En Querétaro,", "método antes", "que promesas."],
    description:
      "Un equipo inmobiliario que elige procesos claros, estrategia real y acompañamiento de principio a fin — porque tu patrimonio merece certeza, no discurso.",
    methodTag: "Método TOTAL",
    stats: [
      { value: "+8", label: "Años de experiencia" },
      { value: "+120", label: "Operaciones cerradas" },
      { value: "8", label: "Zonas premium" },
    ],
  },
  philosophy: {
    title: "Filosofía Total",
    subtitle: "Cómo pensamos el negocio inmobiliario",
    introLines: [
      "En el sector inmobiliario sobran promesas y faltan procesos.",
    ],
    methodClosing: "Nosotros elegimos método TOTAL.",
    pillars: [
      {
        id: "transparencia",
        letter: "T",
        title: "Transparencia",
        description: "Verdad completa, sin letras chiquitas.",
      },
      {
        id: "orden",
        letter: "O",
        title: "Orden",
        description: "Procesos claros que aceleran cierres.",
      },
      {
        id: "estrategia",
        letter: "T",
        title: "Trabajo con estrategia",
        description: "No mostramos propiedades, construimos decisiones.",
      },
      {
        id: "acompanamiento",
        letter: "A",
        title: "Acompañamiento",
        description: "De principio a fin (y más allá).",
      },
      {
        id: "lealtad",
        letter: "L",
        title: "Lealtad",
        description: "Tu patrimonio es nuestra prioridad absoluta.",
      },
    ],
  },
  values: [
    {
      id: "pasion-servicio",
      title: "Pasión por el Servicio",
      description:
        "Cada interacción importa: escuchamos, respondemos y acompañamos con energía y cercanía.",
      icon: "heart",
    },
    {
      id: "integridad",
      title: "Integridad",
      description:
        "Transparencia y criterio profesional en cada paso, sin atajos ni promesas vacías.",
      icon: "shield",
    },
    {
      id: "trabajo-equipo",
      title: "Trabajo en Equipo",
      description:
        "Coordinación real entre especialistas para que tu operación avance con orden.",
      icon: "users",
    },
    {
      id: "responsabilidad-social",
      title: "Responsabilidad Social",
      description:
        "Contribuimos con prácticas conscientes y relaciones de respeto con clientes y comunidad.",
      icon: "globe",
    },
    {
      id: "imagen-impecable",
      title: "Imagen Impecable",
      description:
        "Presentación, comunicación y estándares que reflejan la calidad de Total Living.",
      icon: "sparkles",
    },
  ],
  missionVision: {
    mission: {
      title: "Misión",
      statement:
        "Guiar a nuestros clientes hacia las mejores decisiones inmobiliarias en Querétaro, ofreciendo asesoría estratégica, portafolio curado y un servicio que prioriza claridad, confianza y resultados medibles.",
    },
    vision: {
      title: "Visión",
      statement:
        "Ser la firma inmobiliaria de referencia en la región por nuestra capacidad de combinar análisis de mercado, experiencia local y un trato genuinamente personalizado en cada operación.",
    },
  },
  team: [
    {
      id: "director-general",
      name: "Alfredo Mendiola",
      role: "Director General · CEO",
      department: "Dirección",
      bio: "Lidera la visión y el rumbo de Total Living. Conecta estrategia, portafolio premium y relaciones con desarrolladores e inversionistas para que cada decisión inmobiliaria tenga método y respaldo.",
      photo: "/images/team/alfredo-mendiola.png",
      socials: [
        { platform: "linkedin", url: "https://www.linkedin.com" },
        { platform: "instagram", url: "https://www.instagram.com" },
        { platform: "whatsapp", url: "https://wa.me/524421000000" },
        { platform: "email", url: "mailto:contacto@totalliving.mx" },
      ],
    },
    {
      id: "directora-ejecutiva",
      name: "Patricia Chavarría",
      role: "Directora Ejecutiva",
      department: "Dirección",
      bio: "Segunda al mando: coordina operación, equipos y ejecución diaria. Traduce la estrategia en procesos claros y acompaña de cerca cada área para que el servicio Total Living se sienta impecable en el cliente.",
      photo: "/images/team/patricia-chavarria.png",
      socials: [
        { platform: "linkedin", url: "https://www.linkedin.com" },
        { platform: "instagram", url: "https://www.instagram.com" },
        { platform: "facebook", url: "https://www.facebook.com" },
        { platform: "email", url: "mailto:contacto@totalliving.mx" },
      ],
    },
    {
      id: "director-comercial",
      name: "Equipo Comercial",
      role: "Dirección Comercial",
      department: "Ventas",
      bio: "Coordina el portafolio activo, negociaciones y el acompañamiento de punta a punta en operaciones de venta y renta.",
      socials: [
        { platform: "linkedin", url: "https://www.linkedin.com" },
        { platform: "instagram", url: "https://www.instagram.com" },
        { platform: "whatsapp", url: "https://wa.me/524421000000" },
      ],
    },
    {
      id: "director-marketing",
      name: "Equipo Marketing",
      role: "Dirección de Marketing",
      department: "Marketing",
      bio: "Posicionamiento de marca, contenido, campañas digitales y presentación premium de cada propiedad.",
      socials: [
        { platform: "instagram", url: "https://www.instagram.com" },
        { platform: "facebook", url: "https://www.facebook.com" },
        { platform: "linkedin", url: "https://www.linkedin.com" },
      ],
    },
    {
      id: "director-operaciones",
      name: "Equipo Operaciones",
      role: "Dirección de Operaciones",
      department: "Operaciones",
      bio: "Procesos, documentación, coordinación de visitas y seguimiento operativo para cierres seguros.",
      socials: [
        { platform: "linkedin", url: "https://www.linkedin.com" },
        { platform: "email", url: "mailto:contacto@totalliving.mx" },
        { platform: "whatsapp", url: "https://wa.me/524421000000" },
      ],
    },
    {
      id: "asesores-senior",
      name: "Asesores Senior",
      role: "Asesoría Especializada",
      department: "Ventas",
      bio: "Expertos por zona con profundo conocimiento de mercado, plusvalía y perfil de compradores.",
      socials: [
        { platform: "instagram", url: "https://www.instagram.com" },
        { platform: "whatsapp", url: "https://wa.me/524421000000" },
        { platform: "linkedin", url: "https://www.linkedin.com" },
      ],
    },
    {
      id: "asesores",
      name: "Asesores Total Living",
      role: "Asesores Inmobiliarios",
      department: "Ventas",
      bio: "Primer contacto, visitas, seguimiento y acompañamiento personalizado en cada etapa del proceso.",
      socials: [
        { platform: "whatsapp", url: "https://wa.me/524421000000" },
        { platform: "instagram", url: "https://www.instagram.com" },
        { platform: "email", url: "mailto:contacto@totalliving.mx" },
      ],
    },
  ],
  orgChart: {
    id: "director-general",
    name: "Alfredo Mendiola",
    role: "Director General · CEO",
    children: [
      {
        id: "directora-ejecutiva",
        name: "Patricia Chavarría",
        role: "Directora Ejecutiva",
      },
      {
        id: "director-comercial",
        name: "Dirección Comercial",
        role: "Ventas & Portafolio",
        children: [
          {
            id: "asesores-senior",
            name: "Asesores Senior",
            role: "Especialistas por zona",
          },
          {
            id: "asesores",
            name: "Asesores Inmobiliarios",
            role: "Atención y seguimiento",
          },
        ],
      },
      {
        id: "director-marketing",
        name: "Dirección de Marketing",
        role: "Marca & Contenido",
      },
      {
        id: "director-operaciones",
        name: "Dirección de Operaciones",
        role: "Procesos & Cierres",
      },
    ],
  },
  sectionNav: [
    { id: "filosofia", label: "Filosofía" },
    { id: "valores", label: "Valores" },
    { id: "mision-vision", label: "Misión & Visión" },
    { id: "equipo", label: "Equipo" },
  ],
};
