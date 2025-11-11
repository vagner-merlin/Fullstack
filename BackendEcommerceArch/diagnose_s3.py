"""
Script para diagnosticar por qué Django no usa S3
"""
import os

print("=" * 60)
print("🔍 DIAGNÓSTICO DE CONFIGURACIÓN S3")
print("=" * 60)

# 1. Verificar archivo .env
print("\n1️⃣ VERIFICANDO ARCHIVO .ENV")
env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    print(f"   ✅ Archivo .env existe: {env_path}")
    with open(env_path, 'r') as f:
        lines = [line.strip() for line in f if line.strip() and not line.startswith('#')]
        print(f"   📋 Variables encontradas: {len(lines)}")
        for line in lines:
            if '=' in line:
                key = line.split('=')[0]
                print(f"      - {key}")
else:
    print(f"   ❌ Archivo .env NO encontrado en: {env_path}")

# 2. Cargar variables de entorno
print("\n2️⃣ CARGANDO VARIABLES DE ENTORNO")
try:
    from decouple import config
    print("   ✅ decouple importado correctamente")
    
    try:
        bucket = config('AWS_STORAGE_BUCKET_NAME')
        print(f"   ✅ AWS_STORAGE_BUCKET_NAME = {bucket}")
    except Exception as e:
        print(f"   ❌ Error al leer AWS_STORAGE_BUCKET_NAME: {e}")
    
    try:
        access_key = config('AWS_ACCESS_KEY_ID')
        print(f"   ✅ AWS_ACCESS_KEY_ID = {access_key[:10]}...")
    except Exception as e:
        print(f"   ❌ Error al leer AWS_ACCESS_KEY_ID: {e}")
        
except ImportError as e:
    print(f"   ❌ Error importando decouple: {e}")

# 3. Verificar Django settings
print("\n3️⃣ VERIFICANDO DJANGO SETTINGS")
try:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_ecommerce.settings')
    import django
    django.setup()
    
    from django.conf import settings
    from django.core.files.storage import default_storage
    
    print(f"   Storage Backend: {default_storage.__class__.__name__}")
    print(f"   Módulo: {default_storage.__class__.__module__}")
    
    print(f"\n   Configuración en settings.py:")
    print(f"   - DEFAULT_FILE_STORAGE: {getattr(settings, 'DEFAULT_FILE_STORAGE', 'NO DEFINIDO')}")
    print(f"   - AWS_STORAGE_BUCKET_NAME: {getattr(settings, 'AWS_STORAGE_BUCKET_NAME', 'NO DEFINIDO')}")
    print(f"   - AWS_S3_REGION_NAME: {getattr(settings, 'AWS_S3_REGION_NAME', 'NO DEFINIDO')}")
    print(f"   - MEDIA_URL: {getattr(settings, 'MEDIA_URL', 'NO DEFINIDO')}")
    
    if default_storage.__class__.__name__ == 'S3Boto3Storage':
        print("\n   ✅ Django está configurado correctamente para S3")
    else:
        print("\n   ❌ Django NO está usando S3")
        print("   🔧 Posibles causas:")
        print("      1. El servidor Django está corriendo con configuración antigua")
        print("      2. Hay un error al cargar variables de .env")
        print("      3. storages no está instalado correctamente")
        
except Exception as e:
    print(f"   ❌ Error al cargar Django: {e}")
    import traceback
    traceback.print_exc()

# 4. Verificar instalación de boto3 y storages
print("\n4️⃣ VERIFICANDO PAQUETES")
try:
    import boto3
    print(f"   ✅ boto3 instalado: versión {boto3.__version__}")
except ImportError:
    print("   ❌ boto3 NO instalado")

try:
    import storages
    print(f"   ✅ django-storages instalado")
except ImportError:
    print("   ❌ django-storages NO instalado")

print("\n" + "=" * 60)
print("🔧 SOLUCIÓN")
print("=" * 60)
print("\nSi el servidor Django está corriendo:")
print("1. Detén el servidor (Ctrl+C)")
print("2. Ejecuta: python manage.py runserver")
print("3. Vuelve a ejecutar: python test_complete_s3.py")
print("\nSi ves 'FileSystemStorage', el servidor NO está usando")
print("la configuración actualizada de .env")
print("=" * 60)
