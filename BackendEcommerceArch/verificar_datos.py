#!/usr/bin/env python
"""
Script para verificar datos en la base de datos
"""
import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_ecommerce.settings')
django.setup()

from app_productos.models import Producto, ProductoCategoria, Imagen_Producto, Categoria

def verificar_datos():
    print("🔍 Verificando datos en la base de datos...")
    
    # 1. Verificar productos
    total_productos = Producto.objects.count()
    productos_activos = Producto.objects.filter(activo=True).count()
    print(f"\n📦 PRODUCTOS:")
    print(f"   Total: {total_productos}")
    print(f"   Activos: {productos_activos}")
    
    # Mostrar productos activos
    productos = Producto.objects.filter(activo=True)[:5]
    for producto in productos:
        print(f"   - {producto.nombre} (ID: {producto.id})")
    
    # 2. Verificar variantes (ProductoCategoria)
    total_variantes = ProductoCategoria.objects.count()
    print(f"\n🎨 VARIANTES (ProductoCategoria):")
    print(f"   Total: {total_variantes}")
    
    variantes = ProductoCategoria.objects.all()[:5]
    for variante in variantes:
        print(f"   - Producto: {variante.producto.nombre}")
        print(f"     Color: {variante.color}, Talla: {variante.talla}")
        print(f"     Precio: ${variante.precio_unitario}")
        print(f"     Stock: {variante.stock}")
    
    # 3. Verificar imágenes
    total_imagenes = Imagen_Producto.objects.count()
    print(f"\n📸 IMÁGENES:")
    print(f"   Total: {total_imagenes}")
    
    imagenes = Imagen_Producto.objects.all()[:5]
    for imagen in imagenes:
        print(f"   - Producto: {imagen.Producto_categoria.producto.nombre}")
        print(f"     Variante: {imagen.Producto_categoria.color} - {imagen.Producto_categoria.talla}")
        print(f"     Imagen: {imagen.imagen}")
        print(f"     Principal: {imagen.es_principal}")
        if imagen.imagen:
            print(f"     URL: {imagen.imagen.url}")
        print()
    
    # 4. Verificar productos con variantes e imágenes
    print("🔗 PRODUCTOS CON VARIANTES E IMÁGENES:")
    productos_con_datos = []
    
    for producto in Producto.objects.filter(activo=True):
        variantes = ProductoCategoria.objects.filter(producto=producto)
        if variantes.exists():
            for variante in variantes:
                imagenes = Imagen_Producto.objects.filter(Producto_categoria=variante)
                if imagenes.exists():
                    productos_con_datos.append({
                        'producto': producto.nombre,
                        'variante': f"{variante.color} - {variante.talla}",
                        'imagenes': imagenes.count(),
                        'precio': variante.precio_unitario
                    })
    
    print(f"   Productos completos (con variantes e imágenes): {len(productos_con_datos)}")
    for item in productos_con_datos[:3]:
        print(f"   - {item['producto']} ({item['variante']})")
        print(f"     Precio: ${item['precio']}, Imágenes: {item['imagenes']}")
    
    # 5. Verificar categorías
    total_categorias = Categoria.objects.count()
    categorias_activas = Categoria.objects.filter(activo=True).count()
    print(f"\n📂 CATEGORÍAS:")
    print(f"   Total: {total_categorias}")
    print(f"   Activas: {categorias_activas}")

if __name__ == "__main__":
    verificar_datos()