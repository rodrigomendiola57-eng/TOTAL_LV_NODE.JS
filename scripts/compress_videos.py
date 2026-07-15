import os
import sys
import subprocess

def install_dependencies():
    print("Verificando dependencias de compresión...")
    try:
        import imageio_ffmpeg
    except ImportError:
        print("Instalando imageio-ffmpeg en el entorno virtual...")
        subprocess.run([sys.executable, "-m", "pip", "install", "imageio-ffmpeg"], check=True)
        import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()

def compress_video(ffmpeg_exe, input_path, output_path, scale=None):
    print(f"\nComprimiendo {os.path.basename(input_path)}...")
    
    # Argumentos de FFmpeg:
    # -y: Sobrescribir el archivo de salida si existe.
    # -an: Elimina la pista de audio (indispensable para videos silent de fondo, ahorra mucho peso).
    # -vcodec libx264: Formato de video H.264 ampliamente compatible.
    # -crf 28: Compresión de calidad constante (28 es óptimo para web; menor tamaño sin pérdida visible).
    # -preset fast: Velocidad de procesamiento.
    cmd = [
        ffmpeg_exe,
        "-y",
        "-i", input_path,
        "-an",
        "-vcodec", "libx264",
        "-crf", "28",
        "-preset", "fast",
    ]
    
    if scale:
        cmd.extend(["-vf", f"scale={scale}:-2"])
        
    cmd.append(output_path)
    
    try:
        subprocess.run(cmd, check=True)
        orig_size = os.path.getsize(input_path) / (1024 * 1024)
        new_size = os.path.getsize(output_path) / (1024 * 1024)
        print(f"¡Éxito! Tamaño original: {orig_size:.2f} MB -> Comprimido: {new_size:.2f} MB")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error comprimiendo {input_path}: {e}")
        return False

def main():
    ffmpeg_exe = install_dependencies()
    
    # Carpeta public/videos
    videos_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "videos"))
    
    video_tasks = [
        ("asesoria-hero.mp4", 1920),
        ("hero-total-living.mp4", 1920),
        ("hero-total-living-mobile.mp4", 1080),
    ]
    
    for filename, max_width in video_tasks:
        filepath = os.path.join(videos_dir, filename)
        if not os.path.exists(filepath):
            print(f"Archivo no encontrado: {filepath}")
            continue
            
        temp_output = os.path.join(videos_dir, f"temp_{filename}")
        
        # Intentar compresión
        success = compress_video(ffmpeg_exe, filepath, temp_output, scale=max_width)
        
        if success and os.path.exists(temp_output) and os.path.getsize(temp_output) > 0:
            backup_path = filepath + ".bak"
            if os.path.exists(backup_path):
                os.remove(backup_path)
            os.rename(filepath, backup_path)
            os.rename(temp_output, filepath)
            print(f"Reemplazado original. Respaldo guardado en: {backup_path}")

if __name__ == "__main__":
    main()
