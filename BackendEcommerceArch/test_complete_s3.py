"""
Script completo para probar la integración S3 + Django + Frontend
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_ecommerce.settings')
django.setup()

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from app_productos.models import Imagen_Producto, ProductoCategoria
from io import BytesIO
from PIL import Image

def test_s3_integration():
    print("=" * 60)
    print("🧪 PRUEBA COMPLETA DE INTEGRACIÓN S3")
    print("=" * 60)
    
    # 1. Verificar configuración
    print("\n1️⃣ VERIFICANDO CONFIGURACIÓN")
    print(f"   Storage Backend: {default_storage.__class__.__name__}")
    print(f"   Bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
    print(f"   Región: {settings.AWS_S3_REGION_NAME}")
    
    # Verificar si es S3 (acepta ambos nombres: S3Boto3Storage o S3Storage)
    storage_name = default_storage.__class__.__name__
    if storage_name not in ['S3Boto3Storage', 'S3Storage']:
        print("   ❌ ERROR: Django no está usando S3")
        print("   🔧 SOLUCIÓN: Reinicia el servidor Django")
        return
    
    print("   ✅ Django configurado para usar S3")
    
    # 2. Verificar que hay variantes
    print("\n2️⃣ VERIFICANDO VARIANTES DE PRODUCTOS")
    variante = ProductoCategoria.objects.first()
    if not variante:
        print("   ❌ No hay variantes de productos")
        print("   🔧 Crea al menos una variante desde el frontend")
        return
    
    print(f"   ✅ Variante encontrada: ID {variante.id}")
    
    # 3. Crear imagen de prueba
    print("\n3️⃣ CREANDO IMAGEN DE PRUEBA")
    img = Image.new('RGB', (100, 100), color='red')
    img_io = BytesIO()
    img.save(img_io, 'JPEG')
    img_io.seek(0)
    
    # 4. Subir imagen a través del modelo
    print("\n4️⃣ SUBIENDO IMAGEN A S3")
    try:
        imagen_producto = Imagen_Producto.objects.create(
            imagen=ContentFile(img_io.read(), name='test-django-s3.jpg'),
            texto='Test S3 Integration',
            es_principal=False,
            Producto_categoria=variante
        )
        
        print(f"   ✅ Imagen creada con ID: {imagen_producto.id}")
        print(f"   📁 Ruta en S3: {imagen_producto.imagen.name}")
        print(f"   🌐 URL: {imagen_producto.imagen.url}")
        
        # 5. Verificar que está en S3
        print("\n5️⃣ VERIFICANDO EN S3")
        if 's3.amazonaws.com' in imagen_producto.imagen.url or 'byvagner' in imagen_producto.imagen.url:
            print("   ✅ La imagen está en S3")
            print(f"   🔗 URL completa: {imagen_producto.imagen.url}")
        else:
            print("   ❌ La imagen NO está en S3")
            print(f"   URL incorrecta: {imagen_producto.imagen.url}")
        
        # 6. Limpiar
        print("\n6️⃣ LIMPIANDO")
        imagen_producto.imagen.delete()  # Elimina de S3
        imagen_producto.delete()  # Elimina de BD
        print("   ✅ Imagen de prueba eliminada")
        
        print("\n" + "=" * 60)
        print("✅ INTEGRACIÓN S3 EXITOSA")
        print("=" * 60)
        print("\n📝 PRÓXIMOS PASOS:")
        print("1. Ve al frontend: http://localhost:5173/admin/images")
        print("2. Deberías ver el badge '☁️ S3 Activo'")
        print("3. Sube una imagen y verifica que aparece en S3")
        print("4. La URL debe contener: byvagner.s3.amazonaws.com")
        
    except Exception as e:
        print(f"\n   ❌ ERROR al subir imagen: {str(e)}")
        print(f"   Tipo: {type(e).__name__}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_s3_integration()
