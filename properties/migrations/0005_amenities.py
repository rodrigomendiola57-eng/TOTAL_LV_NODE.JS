"""Catálogo de amenidades y relación N a N con propiedades."""

from __future__ import annotations

import django.db.models.deletion
from django.db import migrations, models


def seed_amenities(apps, schema_editor):
    from properties.amenities_data import iter_seed_rows

    Amenity = apps.get_model("properties", "Amenity")
    for row in iter_seed_rows():
        Amenity.objects.update_or_create(
            slug=row["slug"],
            defaults={
                "name": row["name"],
                "category": row["category"],
                "icon": row["icon"],
                "order": row["order"],
                "is_active": True,
            },
        )


def remove_amenities(apps, schema_editor):
    Amenity = apps.get_model("properties", "Amenity")
    Amenity.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("properties", "0004_easybroker_sync"),
    ]

    operations = [
        migrations.CreateModel(
            name="Amenity",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=80, unique=True, verbose_name="Nombre")),
                ("slug", models.SlugField(max_length=90, unique=True, verbose_name="Slug")),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("Seguridad", "Seguridad"),
                            ("Amenidades del desarrollo", "Amenidades del desarrollo"),
                            ("Interiores", "Interiores"),
                            ("Exteriores y áreas verdes", "Exteriores y áreas verdes"),
                            ("Servicios", "Servicios"),
                            ("Ubicación y vistas", "Ubicación y vistas"),
                        ],
                        default="Amenidades del desarrollo",
                        max_length=40,
                        verbose_name="Categoría",
                    ),
                ),
                (
                    "icon",
                    models.CharField(
                        blank=True,
                        help_text="Nombre del ícono (lucide) usado en el frontend.",
                        max_length=40,
                        verbose_name="Ícono",
                    ),
                ),
                ("order", models.PositiveIntegerField(default=0, verbose_name="Orden")),
                ("is_active", models.BooleanField(default=True, verbose_name="Activa")),
            ],
            options={
                "verbose_name": "Amenidad",
                "verbose_name_plural": "Amenidades",
                "ordering": ["category", "order", "name"],
            },
        ),
        migrations.AddField(
            model_name="property",
            name="amenities",
            field=models.ManyToManyField(
                blank=True,
                related_name="properties",
                to="properties.amenity",
                verbose_name="Amenidades",
            ),
        ),
        migrations.RunPython(seed_amenities, remove_amenities),
    ]
