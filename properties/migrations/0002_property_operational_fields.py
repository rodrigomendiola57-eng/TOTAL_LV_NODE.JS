# Generated manually for Total Living Property model expansion

import django.contrib.gis.db.models.fields
from django.db import migrations, models


def migrate_legacy_property_fields(apps, schema_editor):
    Property = apps.get_model("properties", "Property")
    for property_obj in Property.objects.all():
        property_obj.address = property_obj.address_details or ""
        property_obj.city = "Querétaro"
        property_obj.state = "Querétaro"
        property_obj.postal_code = "76000"
        property_obj.zone = "Zona Juriquilla / Jurica"
        property_obj.property_type = "Otro"
        if property_obj.category == "Desarrollo":
            property_obj.operation_type = "Venta"
        else:
            property_obj.operation_type = property_obj.category
        property_obj.full_bathrooms = property_obj.bathrooms
        property_obj.build_area_m2 = property_obj.surface_area
        property_obj.description = ""
        property_obj.save()


class Migration(migrations.Migration):

    dependencies = [
        ("properties", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="property",
            name="address",
            field=models.CharField(default="", max_length=255, verbose_name="Dirección"),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="property",
            name="build_area_m2",
            field=models.DecimalField(
                decimal_places=2,
                default=0,
                max_digits=10,
                verbose_name="Superficie construida (m²)",
            ),
        ),
        migrations.AddField(
            model_name="property",
            name="build_year",
            field=models.PositiveIntegerField(
                blank=True, null=True, verbose_name="Año de construcción"
            ),
        ),
        migrations.AddField(
            model_name="property",
            name="city",
            field=models.CharField(default="Querétaro", max_length=120, verbose_name="Ciudad"),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="property",
            name="depth_measure_m",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=8,
                null=True,
                verbose_name="Fondo (m)",
            ),
        ),
        migrations.AddField(
            model_name="property",
            name="description",
            field=models.TextField(blank=True, verbose_name="Descripción"),
        ),
        migrations.AddField(
            model_name="property",
            name="environments",
            field=models.PositiveIntegerField(default=0, verbose_name="Ambientes"),
        ),
        migrations.AddField(
            model_name="property",
            name="front_measure_m",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=8,
                null=True,
                verbose_name="Frente (m)",
            ),
        ),
        migrations.AddField(
            model_name="property",
            name="full_bathrooms",
            field=models.PositiveIntegerField(default=0, verbose_name="Baños completos"),
        ),
        migrations.AddField(
            model_name="property",
            name="half_bathrooms",
            field=models.PositiveIntegerField(default=0, verbose_name="Medios baños"),
        ),
        migrations.AddField(
            model_name="property",
            name="land_area_m2",
            field=models.DecimalField(
                decimal_places=2,
                default=0,
                max_digits=10,
                verbose_name="Superficie de terreno (m²)",
            ),
        ),
        migrations.AddField(
            model_name="property",
            name="levels",
            field=models.PositiveIntegerField(default=1, verbose_name="Niveles"),
        ),
        migrations.AddField(
            model_name="property",
            name="maintenance_fee",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=12,
                null=True,
                verbose_name="Cuota de mantenimiento",
            ),
        ),
        migrations.AddField(
            model_name="property",
            name="maps_link",
            field=models.URLField(blank=True, verbose_name="Enlace de Google Maps"),
        ),
        migrations.AddField(
            model_name="property",
            name="operation_type",
            field=models.CharField(
                choices=[
                    ("Venta", "Venta"),
                    ("Renta", "Renta"),
                    ("Venta o Renta", "Venta o Renta"),
                ],
                default="Venta",
                max_length=20,
                verbose_name="Tipo de operación",
            ),
        ),
        migrations.AddField(
            model_name="property",
            name="parking_spaces",
            field=models.PositiveIntegerField(default=0, verbose_name="Estacionamientos"),
        ),
        migrations.AddField(
            model_name="property",
            name="postal_code",
            field=models.CharField(default="76000", max_length=10, verbose_name="Código postal"),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="property",
            name="property_type",
            field=models.CharField(
                choices=[
                    ("Casa", "Casa"),
                    ("Departamento", "Departamento"),
                    ("Terreno", "Terreno"),
                    ("Condominio", "Condominio"),
                    ("Casa en condominio", "Casa en condominio"),
                    ("Penthouse", "Penthouse"),
                    ("Local Comercial", "Local Comercial"),
                    ("Oficina", "Oficina"),
                    ("Consultorio", "Consultorio"),
                    ("Bodega", "Bodega"),
                    ("Nave industrial", "Nave industrial"),
                    ("Rancho", "Rancho"),
                    ("Otro", "Otro"),
                ],
                default="Otro",
                max_length=30,
                verbose_name="Tipo de propiedad",
            ),
        ),
        migrations.AddField(
            model_name="property",
            name="state",
            field=models.CharField(
                choices=[
                    ("Aguascalientes", "Aguascalientes"),
                    ("Baja California", "Baja California"),
                    ("Baja California Sur", "Baja California Sur"),
                    ("Campeche", "Campeche"),
                    ("Chiapas", "Chiapas"),
                    ("Chihuahua", "Chihuahua"),
                    ("Ciudad de México", "Ciudad de México"),
                    ("Coahuila", "Coahuila"),
                    ("Colima", "Colima"),
                    ("Durango", "Durango"),
                    ("Estado de México", "Estado de México"),
                    ("Guanajuato", "Guanajuato"),
                    ("Guerrero", "Guerrero"),
                    ("Hidalgo", "Hidalgo"),
                    ("Jalisco", "Jalisco"),
                    ("Michoacán", "Michoacán"),
                    ("Morelos", "Morelos"),
                    ("Nayarit", "Nayarit"),
                    ("Nuevo León", "Nuevo León"),
                    ("Oaxaca", "Oaxaca"),
                    ("Puebla", "Puebla"),
                    ("Querétaro", "Querétaro"),
                    ("Quintana Roo", "Quintana Roo"),
                    ("San Luis Potosí", "San Luis Potosí"),
                    ("Sinaloa", "Sinaloa"),
                    ("Sonora", "Sonora"),
                    ("Tabasco", "Tabasco"),
                    ("Tamaulipas", "Tamaulipas"),
                    ("Tlaxcala", "Tlaxcala"),
                    ("Veracruz", "Veracruz"),
                    ("Yucatán", "Yucatán"),
                    ("Zacatecas", "Zacatecas"),
                ],
                default="Querétaro",
                max_length=40,
                verbose_name="Estado",
            ),
        ),
        migrations.AddField(
            model_name="property",
            name="zone",
            field=models.CharField(
                choices=[
                    ("Zona Campanario / Altozano", "Zona Campanario / Altozano"),
                    (
                        "Zona Centro / Querétaro Tradicional",
                        "Zona Centro / Querétaro Tradicional",
                    ),
                    (
                        "Zona Centro Sur / Sur de Querétaro",
                        "Zona Centro Sur / Sur de Querétaro",
                    ),
                    ("Zona Ciudad del Sol / Poniente", "Zona Ciudad del Sol / Poniente"),
                    ("Zona Corregidora", "Zona Corregidora"),
                    (
                        "Zona El Refugio / Norte de El Marqués",
                        "Zona El Refugio / Norte de El Marqués",
                    ),
                    ("Zona Juriquilla / Jurica", "Zona Juriquilla / Jurica"),
                    ("Zona Zibatá / Zakia", "Zona Zibatá / Zakia"),
                ],
                default="Zona Juriquilla / Jurica",
                max_length=80,
                verbose_name="Zona de Querétaro",
            ),
        ),
        migrations.RunPython(migrate_legacy_property_fields, migrations.RunPython.noop),
        migrations.RemoveField(model_name="property", name="address_details"),
        migrations.RemoveField(model_name="property", name="bathrooms"),
        migrations.RemoveField(model_name="property", name="category"),
        migrations.RemoveField(model_name="property", name="surface_area"),
    ]
