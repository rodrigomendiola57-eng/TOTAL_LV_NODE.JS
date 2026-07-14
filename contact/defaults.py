"""
Defaults del singleton ContactPage.
Espejo de CONTACT_PAGE_DEFAULT en src/lib/data/contact-page.ts
(channels / quick_prompts / reassurance en camelCase anidado).
"""

CONTACT_PAGE_DEFAULTS = {
    "hero_eyebrow": "Total Living · Contacto",
    "hero_title": "Hablemos de tu próxima inversión",
    "hero_description": (
        "Cuéntanos qué buscas y un asesor Total Living te responderá "
        "con opciones claras, estrategia y acompañamiento de principio a fin."
    ),
    "channels": [
        {
            "id": "whatsapp",
            "label": "WhatsApp",
            "value": "+52 442 327 1417",
            "href": "https://wa.me/524423271417",
            "hint": "Agenda visitas y consultas rápidas",
        },
        {
            "id": "email",
            "label": "Correo",
            "value": "contacto@totalliving.mx",
            "href": "mailto:contacto@totalliving.mx",
            "hint": "Respuesta en horario laboral",
        },
        {
            "id": "location",
            "label": "Ubicación",
            "value": "Querétaro, México",
            "href": "/zonas",
            "hint": "8 zonas premium de operación",
        },
    ],
    "form_title": "Envíanos tu consulta",
    "form_description": (
        "Completa el formulario en menos de un minuto. Tu navegador puede "
        "sugerirte nombre, correo y teléfono guardados."
    ),
    "form_name_label": "Tu nombre",
    "form_name_placeholder": "Ej. Ana Mendiola",
    "form_phone_label": "Teléfono",
    "form_phone_hint": "WhatsApp ok",
    "form_phone_placeholder": "442 123 4567",
    "form_email_label": "Correo",
    "form_email_placeholder": "tu@correo.com",
    "form_message_label": "¿Qué estás buscando?",
    "form_message_placeholder": (
        "Ej. Casa en venta en Juriquilla, 3 recámaras..."
    ),
    "form_quick_prompts_label": "Respuestas rápidas",
    "form_quick_prompts": [
        "Busco casa en venta",
        "Busco departamento en renta",
        "Me interesa un desarrollo",
        "Quiero asesoría para invertir",
    ],
    "form_submit_label": "Enviar consulta",
    "form_submitting_label": "Enviando...",
    "form_success_title": "Consulta enviada",
    "form_success_message": (
        "Ya recibimos tu mensaje. Un asesor Total Living revisará tu "
        "solicitud y te contactará pronto."
    ),
    "form_reset_label": "Enviar otra consulta",
    "reassurance_title": "Por qué es fácil",
    "reassurance_items": [
        "Respuesta personalizada por un asesor",
        "Sin compromiso en la primera consulta",
        "Acompañamiento legal y estratégico",
    ],
    "reassurance_footer": "Respuesta habitual en horario laboral",
    "property_banner_label": "Propiedad de interés",
    "property_banner_cta": "Ver ficha",
    "property_form_label": "Consulta sobre",
    "seo_title": "Contacto | Total Living",
    "seo_description": (
        "Contáctanos para asesoría inmobiliaria en Querétaro. Envía tu "
        "consulta y un asesor Total Living te responderá con estrategia "
        "y acompañamiento."
    ),
    "is_published": True,
}
