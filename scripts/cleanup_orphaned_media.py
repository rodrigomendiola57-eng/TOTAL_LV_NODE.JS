import os
import sys
import shutil
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

def scan_media_dir(backup_dir_name):
    media_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "media"))
    disk_files = {}
    
    if not os.path.exists(media_dir):
        return disk_files
        
    for root, dirs, files in os.walk(media_dir):
        # Omitir la carpeta de respaldo para evitar escaneo circular
        if backup_dir_name in root:
            continue
            
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, media_dir).replace("\\", "/").strip().lower()
            disk_files[rel_path] = {
                "full_path": full_path,
                "size": os.path.getsize(full_path)
            }
            
    return disk_files

def main():
    print("--- INICIANDO LIMPIEZA SEGURA DE ARCHIVOS HUÉRFANOS ---")
    
    backup_folder_name = "media_basura_respaldo"
    media_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "media"))
    backup_dir = os.path.join(media_dir, backup_folder_name)
    
    referenced = collect_referenced_files()
    disk_files = scan_media_dir(backup_folder_name)
    
    # 1. Procesar fotos huérfanas
    orphaned_files = []
    for rel_path, info in disk_files.items():
        # Algunas veces django guarda con el prefijo 'media/' en db, probamos removerlo
        clean_path = rel_path.replace("media/", "", 1) if rel_path.startswith("media/") else rel_path
        if rel_path not in referenced and clean_path not in referenced:
            orphaned_files.append((rel_path, info["full_path"], info["size"]))
            
    print(f"Archivos activos en DB a proteger: {len(referenced)}")
    print(f"Archivos huérfanos a limpiar: {len(orphaned_files)}")
    
    moved_count = 0
    moved_size = 0
    
    for rel_path, full_path, size in orphaned_files:
        # Destino manteniendo la estructura
        dest_path = os.path.join(backup_dir, rel_path)
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        
        try:
            shutil.move(full_path, dest_path)
            moved_count += 1
            moved_size += size
        except Exception as e:
            print(f"No se pudo mover {rel_path}: {e}")
            
    print(f"¡Éxito! Se movieron {moved_count} fotos a la carpeta de respaldo.")
    print(f"Espacio liberado en media/: {moved_size / (1024 * 1024):.2f} MB")
    
    # 2. Procesar respaldos de videos (.bak)
    videos_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "videos"))
    moved_videos_size = 0
    moved_videos_count = 0
    
    if os.path.exists(videos_dir):
        video_backup_dir = os.path.join(backup_dir, "public_videos_backups")
        for file in os.listdir(videos_dir):
            if file.endswith(".bak"):
                video_full_path = os.path.join(videos_dir, file)
                video_dest_path = os.path.join(video_backup_dir, file)
                os.makedirs(video_backup_dir, exist_ok=True)
                
                try:
                    video_size = os.path.getsize(video_full_path)
                    shutil.move(video_full_path, video_dest_path)
                    moved_videos_count += 1
                    moved_videos_size += video_size
                except Exception as e:
                    print(f"No se pudo mover el video de respaldo {file}: {e}")
                    
    if moved_videos_count > 0:
        print(f"Se movieron {moved_videos_count} videos de respaldo (.bak).")
        print(f"Espacio liberado en public/videos/: {moved_videos_size / (1024 * 1024):.2f} MB")
        
    total_saved = (moved_size + moved_videos_size) / (1024 * 1024)
    print(f"\nRESUMEN FINAL:")
    print(f"- Total de archivos reubicados: {moved_count + moved_videos_count}")
    print(f"- Carpeta de respaldo creada en: {backup_dir}")
    print(f"- Ahorro total de espacio en las carpetas activas: {total_saved:.2f} MB")
    print("\n*Nota: La base de datos NO ha sido modificada. Todos los registros y fotos de tus propiedades activas siguen intactos.")

if __name__ == "__main__":
    main()
