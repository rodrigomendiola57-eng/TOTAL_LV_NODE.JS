import os
import sys
import django

# Agregar la raíz del proyecto a sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Configurar Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "totalliving_backend.settings")
django.setup()

from zones.models import ZonesPage, Zone
from site_content.models import HomePage, HomeAboutSlide, HomeCityHighlight, HomeJournalPost
from properties.models import Property, PropertyPhoto
from developments.models import DevelopmentsPage, Development, DevelopmentGalleryImage, DevelopmentUnitModel, DevelopmentModelImage, DevelopmentFloorPlan
from crm.models import Agent
from about.models import AboutPage, TeamMember
from asesoria.models import AsesoriaPage

def collect_referenced_files():
    referenced = set()
    
    # 1. ZonesPage
    for obj in ZonesPage.objects.all():
        if obj.hero_image:
            referenced.add(obj.hero_image.name)
            
    # 2. Zone
    for obj in Zone.objects.all():
        if obj.image:
            referenced.add(obj.image.name)
            
    # 3. HomePage
    for obj in HomePage.objects.all():
        if obj.hero_background:
            referenced.add(obj.hero_background.name)
        if obj.hero_video:
            referenced.add(obj.hero_video.name)
            
    # 4. HomeAboutSlide
    for obj in HomeAboutSlide.objects.all():
        if obj.image:
            referenced.add(obj.image.name)
        if obj.image_mobile:
            referenced.add(obj.image_mobile.name)
            
    # 5. HomeCityHighlight
    for obj in HomeCityHighlight.objects.all():
        if obj.image_desktop:
            referenced.add(obj.image_desktop.name)
        if obj.image_mobile:
            referenced.add(obj.image_mobile.name)
            
    # 6. HomeJournalPost
    for obj in HomeJournalPost.objects.all():
        if obj.image:
            referenced.add(obj.image.name)
        if obj.video:
            referenced.add(obj.video.name)
            
    # 7. Property
    for obj in Property.objects.all():
        if obj.technical_sheet:
            referenced.add(obj.technical_sheet.name)
            
    # 8. PropertyPhoto
    for obj in PropertyPhoto.objects.all():
        if obj.image:
            referenced.add(obj.image.name)
            
    # 9. DevelopmentsPage
    for obj in DevelopmentsPage.objects.all():
        if obj.hero_image:
            referenced.add(obj.hero_image.name)
            
    # 10. Development
    for obj in Development.objects.all():
        if obj.cover_image:
            referenced.add(obj.cover_image.name)
            
    # 11. DevelopmentGalleryImage
    for obj in DevelopmentGalleryImage.objects.all():
        if obj.image:
            referenced.add(obj.image.name)
            
    # 12. DevelopmentUnitModel
    for obj in DevelopmentUnitModel.objects.all():
        if obj.cover_image:
            referenced.add(obj.cover_image.name)
            
    # 13. DevelopmentModelImage
    for obj in DevelopmentModelImage.objects.all():
        if obj.image:
            referenced.add(obj.image.name)
            
    # 14. DevelopmentFloorPlan
    for obj in DevelopmentFloorPlan.objects.all():
        if obj.image:
            referenced.add(obj.image.name)
            
    # 15. Agent
    for obj in Agent.objects.all():
        if obj.profile_photo:
            referenced.add(obj.profile_photo.name)
            
    # 16. AboutPage
    for obj in AboutPage.objects.all():
        if obj.mission_image:
            referenced.add(obj.mission_image.name)
        if obj.vision_image:
            referenced.add(obj.vision_image.name)
            
    # 17. TeamMember
    for obj in TeamMember.objects.all():
        if obj.photo:
            referenced.add(obj.photo.name)
            
    # 18. AsesoriaPage
    for obj in AsesoriaPage.objects.all():
        if obj.hero_image:
            referenced.add(obj.hero_image.name)
            
    # Normalizar rutas
    normalized = {p.replace("\\", "/").strip().lower() for p in referenced if p}
    return normalized

def scan_media_dir():
    media_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "media"))
    disk_files = {}
    
    if not os.path.exists(media_dir):
        return disk_files
        
    for root, dirs, files in os.walk(media_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, media_dir).replace("\\", "/").strip().lower()
            disk_files[rel_path] = {
                "full_path": full_path,
                "size": os.path.getsize(full_path)
            }
            
    return disk_files

def main():
    print("--- AUDITORÍA DE ARCHIVOS HUÉRFANOS ('BASURA DE FOTOS') ---")
    referenced = collect_referenced_files()
    disk_files = scan_media_dir()
    
    print(f"Archivos únicos en la Base de Datos: {len(referenced)}")
    print(f"Archivos físicos en carpeta media/: {len(disk_files)}")
    
    orphaned = []
    total_orphaned_size = 0
    
    for rel_path, info in disk_files.items():
        if rel_path not in referenced:
            # Algunas veces django guarda con el prefijo 'media/' en db, probamos removerlo
            clean_path = rel_path.replace("media/", "", 1) if rel_path.startswith("media/") else rel_path
            if clean_path not in referenced:
                orphaned.append((rel_path, info["size"]))
                total_orphaned_size += info["size"]
            
    print(f"Archivos huérfanos ('basura'): {len(orphaned)}")
    if orphaned:
        # Ordenar por tamaño descendente
        orphaned.sort(key=lambda x: x[1], reverse=True)
        print("\nArchivos huérfanos más pesados:")
        for path, size in orphaned[:40]:
            size_mb = size / (1024 * 1024)
            print(f" - {path} ({size_mb:.3f} MB)")
        if len(orphaned) > 40:
            print(f" ... y otros {len(orphaned) - 40} archivos.")
            
        print(f"\nPeso total de la basura de fotos: {total_orphaned_size / (1024 * 1024):.3f} MB")
    else:
        print("¡Felicidades! No se encontró ninguna foto huérfana en la carpeta media.")

if __name__ == "__main__":
    main()
