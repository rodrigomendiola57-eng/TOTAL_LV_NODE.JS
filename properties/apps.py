from django.apps import AppConfig


class PropertiesConfig(AppConfig):
    name = 'properties'

    def ready(self):
        from django.db.models import signals
        from django.db import models

        # Handler functions to auto-delete physical media files when database records are deleted/updated
        def auto_delete_files_on_delete(sender, instance, **kwargs):
            for field in instance._meta.fields:
                if isinstance(field, models.FileField):
                    file_field = getattr(instance, field.name)
                    if file_field and file_field.name:
                        try:
                            storage = file_field.storage
                            if storage.exists(file_field.name):
                                storage.delete(file_field.name)
                        except Exception:
                            pass

        def auto_delete_files_on_change(sender, instance, **kwargs):
            if not instance.pk:
                return
            try:
                old_instance = sender.objects.get(pk=instance.pk)
            except sender.DoesNotExist:
                return

            for field in instance._meta.fields:
                if isinstance(field, models.FileField):
                    old_file = getattr(old_instance, field.name)
                    new_file = getattr(instance, field.name)
                    
                    if old_file and old_file.name and old_file != new_file:
                        try:
                            storage = old_file.storage
                            if storage.exists(old_file.name):
                                storage.delete(old_file.name)
                        except Exception:
                            pass

        # Register signals dynamically for all models across all installed apps that have File/Image fields
        from django.apps import apps
        for model in apps.get_models():
            has_file_field = any(isinstance(f, models.FileField) for f in model._meta.fields)
            if has_file_field:
                signals.post_delete.connect(
                    auto_delete_files_on_delete, 
                    sender=model, 
                    dispatch_uid=f"{model._meta.label}_auto_delete_files"
                )
                signals.pre_save.connect(
                    auto_delete_files_on_change, 
                    sender=model, 
                    dispatch_uid=f"{model._meta.label}_auto_delete_files_on_change"
                )
