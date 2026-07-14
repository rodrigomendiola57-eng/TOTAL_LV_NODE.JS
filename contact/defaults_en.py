"""
Pack de textos en inglés para ContactPage.content_en.
Misma forma que los campos ES (snake_case). Vacío = fallback al español.
"""

CONTACT_PAGE_EN_DEFAULTS = {
    "hero_eyebrow": "Total Living · Contact",
    "hero_title": "Let's talk about your next investment",
    "hero_description": (
        "Tell us what you're looking for and a Total Living advisor will "
        "reply with clear options, strategy, and end-to-end support."
    ),
    "channels": [
        {
            "id": "whatsapp",
            "label": "WhatsApp",
            "value": "+52 442 327 1417",
            "href": "https://wa.me/524423271417",
            "hint": "Schedule visits and quick consultations",
        },
        {
            "id": "email",
            "label": "Email",
            "value": "contacto@totalliving.mx",
            "href": "mailto:contacto@totalliving.mx",
            "hint": "Reply during business hours",
        },
        {
            "id": "location",
            "label": "Location",
            "value": "Querétaro, Mexico",
            "href": "/zonas",
            "hint": "8 premium operating zones",
        },
    ],
    "form_title": "Send us your inquiry",
    "form_description": (
        "Complete the form in under a minute. Your browser may suggest "
        "saved name, email, and phone."
    ),
    "form_name_label": "Your name",
    "form_name_placeholder": "e.g. Ana Mendiola",
    "form_phone_label": "Phone",
    "form_phone_hint": "WhatsApp ok",
    "form_phone_placeholder": "442 123 4567",
    "form_email_label": "Email",
    "form_email_placeholder": "you@email.com",
    "form_message_label": "What are you looking for?",
    "form_message_placeholder": (
        "e.g. House for sale in Juriquilla, 3 bedrooms..."
    ),
    "form_quick_prompts_label": "Quick replies",
    "form_quick_prompts": [
        "I'm looking for a house to buy",
        "I'm looking for an apartment to rent",
        "I'm interested in a development",
        "I want investment advisory",
    ],
    "form_submit_label": "Send inquiry",
    "form_submitting_label": "Sending...",
    "form_success_title": "Inquiry sent",
    "form_success_message": (
        "We received your message. A Total Living advisor will review your "
        "request and contact you soon."
    ),
    "form_reset_label": "Send another inquiry",
    "reassurance_title": "Why it's easy",
    "reassurance_items": [
        "Personalized reply from an advisor",
        "No commitment on the first consultation",
        "Legal and strategic support",
    ],
    "reassurance_footer": "Typical reply during business hours",
    "property_banner_label": "Property of interest",
    "property_banner_cta": "View listing",
    "property_form_label": "Inquiry about",
    "seo_title": "Contact | Total Living",
    "seo_description": (
        "Contact us for real estate advisory in Querétaro. Send your "
        "inquiry and a Total Living advisor will reply with strategy "
        "and support."
    ),
}
