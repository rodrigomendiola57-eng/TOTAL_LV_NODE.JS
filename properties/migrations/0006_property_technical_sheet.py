from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("properties", "0005_amenities"),
    ]

    operations = [
        migrations.AddField(
            model_name="property",
            name="technical_sheet",
            field=models.FileField(
                blank=True,
                null=True,
                upload_to="properties/technical-sheets/%Y/%m/",
                verbose_name="Ficha técnica (PDF)",
            ),
        ),
    ]
