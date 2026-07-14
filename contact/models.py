"""
Modelo CMS de la página /contacto (singleton pk=1).
"""

from __future__ import annotations

from django.db import models


class ContactPage(models.Model):
    """Contenido editable de /contacto."""

    hero_eyebrow = models.CharField(max_length=120, blank=True)
    hero_title = models.CharField(max_length=200)
    hero_description = models.TextField(blank=True)

    # Canales: [{id, label, value, href, hint}, ...]
    channels = models.JSONField(default=list, blank=True)

    form_title = models.CharField(max_length=200, blank=True)
    form_description = models.TextField(blank=True)
    form_name_label = models.CharField(max_length=80, blank=True)
    form_name_placeholder = models.CharField(max_length=160, blank=True)
    form_phone_label = models.CharField(max_length=80, blank=True)
    form_phone_hint = models.CharField(max_length=80, blank=True)
    form_phone_placeholder = models.CharField(max_length=160, blank=True)
    form_email_label = models.CharField(max_length=80, blank=True)
    form_email_placeholder = models.CharField(max_length=160, blank=True)
    form_message_label = models.CharField(max_length=120, blank=True)
    form_message_placeholder = models.CharField(max_length=240, blank=True)
    form_quick_prompts_label = models.CharField(max_length=80, blank=True)
    # Lista de strings
    form_quick_prompts = models.JSONField(default=list, blank=True)
    form_submit_label = models.CharField(max_length=80, blank=True)
    form_submitting_label = models.CharField(max_length=80, blank=True)
    form_success_title = models.CharField(max_length=120, blank=True)
    form_success_message = models.TextField(blank=True)
    form_reset_label = models.CharField(max_length=80, blank=True)

    reassurance_title = models.CharField(max_length=120, blank=True)
    # Lista de strings
    reassurance_items = models.JSONField(default=list, blank=True)
    reassurance_footer = models.CharField(max_length=200, blank=True)

    property_banner_label = models.CharField(max_length=80, blank=True)
    property_banner_cta = models.CharField(max_length=80, blank=True)
    property_form_label = models.CharField(max_length=80, blank=True)

    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.TextField(blank=True)

    # Pack inglés: mismas claves snake_case que los campos ES.
    # String vacío / lista vacía / clave ausente → fallback al español.
    content_en = models.JSONField(default=dict, blank=True)

    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Página Contacto (textos)"
        verbose_name_plural = "Página Contacto (textos)"

    def __str__(self) -> str:
        return "Textos de Contacto"

    @classmethod
    def load(cls) -> ContactPage:
        obj, _ = cls.objects.get_or_create(pk=1, defaults=cls._default_field_values())
        return obj

    @classmethod
    def _default_field_values(cls) -> dict:
        from .defaults import CONTACT_PAGE_DEFAULTS
        from .defaults_en import CONTACT_PAGE_EN_DEFAULTS

        values = dict(CONTACT_PAGE_DEFAULTS)
        values["content_en"] = dict(CONTACT_PAGE_EN_DEFAULTS)
        return values
