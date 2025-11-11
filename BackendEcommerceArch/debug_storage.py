"""
Debug: Verificar por qué Django no usa S3
"""
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_ecommerce.settings')

print("=" * 60)
print("🔍 DEBUG: CARGA DE CONFIGURACIÓN S3")
print("=" * 60)

# Cargar Django
import django
django.setup()

from django.conf import settings
from django.core.files.storage import default_storage

print("\n1️⃣ VALOR DE DEFAULT_FILE_STORAGE EN SETTINGS")
print(f"   {settings.DEFAULT_FILE_STORAGE}")

print("\n2️⃣ STORAGE BACKEND ACTUALMENTE EN USO")
print(f"   Clase: {default_storage.__class__}")
print(f"   Nombre: {default_storage.__class__.__name__}")
print(f"   Módulo: {default_storage.__class__.__module__}")

print("\n3️⃣ VERIFICAR SI STORAGES ESTÁ DISPONIBLE")
try:
    import storages
    print(f"   ✅ django-storages importado")
    from storages.backends.s3boto3 import S3Boto3Storage
    print(f"   ✅ S3Boto3Storage disponible")
except ImportError as e:
    print(f"   ❌ Error importando: {e}")

print("\n4️⃣ VERIFICAR VARIABLES AWS")
print(f"   AWS_STORAGE_BUCKET_NAME: {getattr(settings, 'AWS_STORAGE_BUCKET_NAME', 'NO DEFINIDO')}")
print(f"   AWS_ACCESS_KEY_ID: {getattr(settings, 'AWS_ACCESS_KEY_ID', 'NO DEFINIDO')[:10]}...")

print("\n5️⃣ INTENTAR CREAR STORAGE MANUALMENTE")
try:
    from storages.backends.s3boto3 import S3Boto3Storage
    s3_storage = S3Boto3Storage()
    print(f"   ✅ S3Boto3Storage se puede instanciar")
    print(f"   Bucket: {s3_storage.bucket_name}")
except Exception as e:
    print(f"   ❌ Error al crear S3Boto3Storage: {e}")

print("\n" + "=" * 60)
print("🔧 DIAGNÓSTICO")
print("=" * 60)

if default_storage.__class__.__name__ == 'FileSystemStorage':
    print("\n❌ PROBLEMA: Django está usando FileSystemStorage")
    print("\n🔍 Posibles causas:")
    print("   1. El servidor Django se inició ANTES de cambiar settings.py")
    print("   2. Hay un error al importar S3Boto3Storage")
    print("   3. DEFAULT_FILE_STORAGE no se está aplicando correctamente")
    
    print("\n💡 SOLUCIONES:")
    print("   1. DETÉN completamente el servidor Django (Ctrl+C)")
    print("   2. Verifica que no haya procesos Python corriendo:")
    print("      Get-Process python (en PowerShell)")
    print("   3. Reinicia: python manage.py runserver")
    print("   4. Ejecuta este script nuevamente")
elif default_storage.__class__.__name__ == 'S3Boto3Storage':
    print("\n✅ Django está usando S3 correctamente")
