export const CONTACT_PAGE = {
  hero: {
    eyebrow: "Total Living · Contacto",
    title: "Hablemos de tu próxima inversión",
    description:
      "Cuéntanos qué buscas y un asesor Total Living te responderá con opciones claras, estrategia y acompañamiento de principio a fin.",
  },
  channels: [
    {
      id: "email",
      label: "Correo",
      value: "contacto@totalliving.mx",
      href: "mailto:contacto@totalliving.mx",
      hint: "Respuesta en horario laboral",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: "+52 442 100 0000",
      href: "https://wa.me/524421000000",
      hint: "Agenda visitas y consultas rápidas",
    },
    {
      id: "location",
      label: "Ubicación",
      value: "Querétaro, México",
      href: "/zonas",
      hint: "8 zonas premium de operación",
    },
  ],
  form: {
    title: "Envíanos tu consulta",
    description:
      "Completa el formulario en menos de un minuto. Tu navegador puede sugerirte nombre, correo y teléfono guardados.",
  },
  reassurance: [
    "Respuesta personalizada por un asesor",
    "Sin compromiso en la primera consulta",
    "Acompañamiento legal y estratégico",
  ],
} as const;
