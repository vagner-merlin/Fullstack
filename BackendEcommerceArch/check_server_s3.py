"""
Probar la API del servidor Django en ejecución
"""
import urllib.request
import json

API_URL = "http://127.0.0.1:8000"

print("=" * 60)
print("🌐 PROBANDO API DEL SERVIDOR DJANGO EN EJECUCIÓN")
print("=" * 60)

print("\n1️⃣ VERIFICANDO QUE EL SERVIDOR ESTÁ CORRIENDO")
try:
    response = urllib.request.urlopen(f"{API_URL}/api/productos/productos/", timeout=5)
    print(f"   ✅ Servidor Django está corriendo")
    print(f"   Status: {response.status}")
except Exception as e:
    print(f"   ❌ No se puede conectar al servidor Django")
    print(f"   Error: {e}")
    print("\n   🔧 SOLUCIÓN: Ejecuta 'python manage.py runserver' primero")
    exit(1)

print("\n2️⃣ CONSULTANDO CONFIGURACIÓN S3 DEL SERVIDOR")
try:
    response = urllib.request.urlopen(f"{API_URL}/api/productos/upload-imagen/")
    
    data = json.loads(response.read().decode('utf-8'))
    print(f"   Status: {response.status}")
    print(f"\n   📊 CONFIGURACIÓN DEL SERVIDOR:")
    print(f"   Storage Backend: {data.get('storage_backend', 'N/A')}")
    print(f"   Storage Module: {data.get('storage_module', 'N/A')}")
    print(f"   Bucket Name: {data.get('bucket_name', 'N/A')}")
    print(f"   Media URL: {data.get('media_url', 'N/A')}")
    print(f"   S3 Region: {data.get('s3_region', 'N/A')}")
    
    print("\n" + "=" * 60)
    if data.get('storage_backend') == 'S3Boto3Storage':
        print("✅ EL SERVIDOR DJANGO ESTÁ USANDO S3")
        print("=" * 60)
    else:
        print("❌ EL SERVIDOR DJANGO NO ESTÁ USANDO S3")
        print("=" * 60)
        print(f"\n   Backend actual: {data.get('storage_backend')}")
        print("\n   🔧 SOLUCIÓN:")
        print("   1. El servidor Django tiene configuración antigua en memoria")
        print("   2. DETÉN completamente el servidor (Ctrl+C)")
        print("   3. Verifica que settings.py tiene al FINAL:")
        print("      DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'")
        print("   4. Reinicia: python manage.py runserver")
        print("   5. Ejecuta este script nuevamente")
        
except urllib.error.HTTPError as e:
    if e.code == 401:
        print("   ⚠️  El endpoint requiere autenticación")
        print("   No se puede verificar sin token, pero esto indica que el servidor funciona")
    else:
        print(f"   ❌ Error HTTP: {e.code} - {e.reason}")
except Exception as e:
    print(f"   ❌ Error al consultar API: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
