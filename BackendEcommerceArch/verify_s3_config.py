"""
Script para verificar que Django está usando S3 correctamente
"""
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_ecommerce.settings')
django.setup()

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

def verify_s3_setup():
    print("=" * 60)
    print("🔍 VERIFICACIÓN DE CONFIGURACIÓN S3 EN DJANGO")
    print("=" * 60)
    
    # 1. Verificar configuración cargada
    print("\n📋 Configuración actual:")
    print(f"  DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
    print(f"  AWS_STORAGE_BUCKET_NAME: {settings.AWS_STORAGE_BUCKET_NAME}")
    print(f"  AWS_S3_REGION_NAME: {settings.AWS_S3_REGION_NAME}")
    print(f"  AWS_LOCATION: {settings.AWS_LOCATION}")
    print(f"  MEDIA_URL: {settings.MEDIA_URL}")
    
    # 2. Verificar el storage backend
    print(f"\n🔧 Storage Backend:")
    print(f"  Clase: {default_storage.__class__.__name__}")
    print(f"  Módulo: {default_storage.__class__.__module__}")
    
    # 3. Intentar subir archivo de prueba
    print("\n📤 Intentando subir archivo de prueba a S3...")
    try:
        test_content = ContentFile(b"Test Django S3 Integration")
        test_path = 'productos/test-django-integration.txt'
        
        saved_path = default_storage.save(test_path, test_content)
        print(f"✅ Archivo guardado en: {saved_path}")
        
        # Obtener URL
        file_url = default_storage.url(saved_path)
        print(f"🌐 URL del archivo: {file_url}")
        
        # Limpiar
        default_storage.delete(saved_path)
        print(f"🗑️  Archivo de prueba eliminado")
        
        print("\n" + "=" * 60)
        print("✅ CONFIGURACIÓN S3 CORRECTA - Django guardará en S3")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ ERROR al probar S3:")
        print(f"   {type(e).__name__}: {str(e)}")
        print("\n" + "=" * 60)
        print("⚠️  PROBLEMA CON S3 - Revisar configuración")
        print("=" * 60)

if __name__ == '__main__':
    verify_s3_setup()
