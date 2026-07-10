# Generated manually for omnichannel CRM

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("crm", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="lead",
            options={
                "ordering": ["-updated_at", "-created_at"],
                "verbose_name": "Prospecto",
                "verbose_name_plural": "Prospectos",
            },
        ),
        migrations.AddField(
            model_name="lead",
            name="assigned_agent",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="leads",
                to="crm.agent",
                verbose_name="Asesor asignado",
            ),
        ),
        migrations.AddField(
            model_name="lead",
            name="channel",
            field=models.CharField(
                choices=[
                    ("Web", "Web"),
                    ("WhatsApp", "WhatsApp"),
                    ("Instagram", "Instagram"),
                    ("Facebook", "Facebook"),
                ],
                default="Web",
                max_length=20,
                verbose_name="Canal",
            ),
        ),
        migrations.AddField(
            model_name="lead",
            name="external_contact_id",
            field=models.CharField(
                blank=True,
                db_index=True,
                max_length=255,
                verbose_name="ID externo del contacto",
            ),
        ),
        migrations.AddField(
            model_name="lead",
            name="last_message_preview",
            field=models.CharField(blank=True, max_length=280, verbose_name="Último mensaje"),
        ),
        migrations.AddField(
            model_name="lead",
            name="unread_count",
            field=models.PositiveIntegerField(default=0, verbose_name="No leídos"),
        ),
        migrations.AddField(
            model_name="lead",
            name="updated_at",
            field=models.DateTimeField(auto_now=True, verbose_name="Actualizado el"),
        ),
        migrations.AlterField(
            model_name="lead",
            name="email",
            field=models.EmailField(blank=True, max_length=254, verbose_name="Correo electrónico"),
        ),
        migrations.AlterField(
            model_name="lead",
            name="phone",
            field=models.CharField(blank=True, max_length=20, verbose_name="Teléfono"),
        ),
        migrations.CreateModel(
            name="LeadMessage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "direction",
                    models.CharField(
                        choices=[("inbound", "Entrante"), ("outbound", "Saliente")],
                        max_length=10,
                        verbose_name="Dirección",
                    ),
                ),
                ("content", models.TextField(verbose_name="Contenido")),
                (
                    "channel",
                    models.CharField(
                        choices=[
                            ("Web", "Web"),
                            ("WhatsApp", "WhatsApp"),
                            ("Instagram", "Instagram"),
                            ("Facebook", "Facebook"),
                        ],
                        max_length=20,
                        verbose_name="Canal",
                    ),
                ),
                (
                    "external_id",
                    models.CharField(blank=True, db_index=True, max_length=255, verbose_name="ID externo del mensaje"),
                ),
                (
                    "delivery_status",
                    models.CharField(
                        choices=[
                            ("pending", "Pendiente"),
                            ("sent", "Enviado"),
                            ("delivered", "Entregado"),
                            ("failed", "Fallido"),
                        ],
                        default="sent",
                        max_length=12,
                        verbose_name="Estado de entrega",
                    ),
                ),
                ("metadata", models.JSONField(blank=True, default=dict, verbose_name="Metadatos")),
                ("sent_at", models.DateTimeField(default=django.utils.timezone.now, verbose_name="Enviado el")),
                ("read_at", models.DateTimeField(blank=True, null=True, verbose_name="Leído el")),
                (
                    "lead",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="messages",
                        to="crm.lead",
                        verbose_name="Prospecto",
                    ),
                ),
            ],
            options={
                "verbose_name": "Mensaje",
                "verbose_name_plural": "Mensajes",
                "ordering": ["sent_at"],
            },
        ),
    ]
