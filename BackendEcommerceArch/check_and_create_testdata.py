#!/usr/bin/env python
"""Script para verificar y crear datos de prueba en la BD"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_ecommerce.settings')
django.setup()

from app_productos.models import Producto, Categoria, ProductoCategoria, Imagen_Producto

print("=" * 60)
print("VERIFICACIÓN DE DATOS EN BASE DE DATOS")
print("=" * 60)

# Verificar productos
total_productos = Producto.objects.count()
activos_productos = Producto.objects.filter(activo=True).count()
print(f"\n📦 PRODUCTOS:")
print(f"   Total: {total_productos}")
print(f"   Activos: {activos_productos}")

if total_productos > 0:
    print("\n   Listado de productos:")
    for prod in Producto.objects.all()[:10]:
        variantes = ProductoCategoria.objects.filter(producto=prod).count()
        print(f"   - ID {prod.id}: {prod.nombre} ({variantes} variantes)")
else:
    print("\n   ⚠️ No hay productos en la base de datos")

# Verificar categorías
total_categorias = Categoria.objects.count()
print(f"\n📂 CATEGORÍAS: {total_categorias}")
if total_categorias > 0:
    for cat in Categoria.objects.all()[:10]:
        print(f"   - ID {cat.id}: {cat.nombre}")

# Verificar variantes
total_variantes = ProductoCategoria.objects.count()
print(f"\n🎨 VARIANTES: {total_variantes}")

if total_variantes > 0:
    print("\n   Últimas variantes creadas:")
    for var in ProductoCategoria.objects.order_by('-fecha_creacion')[:5]:
        imgs = Imagen_Producto.objects.filter(Producto_categoria=var).count()
        print(f"   - Prod #{var.producto.id} ({var.color}/{var.talla}): {var.stock} stock, {imgs} imágenes")

print("\n" + "=" * 60)

# Si no hay datos, crear algunos
if total_productos == 0:
    print("\n🔄 Creando datos de prueba...")
    
    # Crear categoría
    cat = Categoria.objects.create(
        nombre="Ropa",
        descripcion="Ropa en general",
        activo=True
    )
    print(f"✅ Categoría creada: {cat.nombre}")
    
    # Crear producto
    prod = Producto.objects.create(
        nombre="Camiseta Básica",
        descripcion="Una camiseta básica de alta calidad",
        activo=True,
        peso=0.2
    )
    print(f"✅ Producto creado: {prod.nombre} (ID: {prod.id})")
    
    # Crear variantes
    for i, color in enumerate(['Rojo', 'Azul', 'Verde'], 1):
        for j, talla in enumerate(['S', 'M', 'L'], 1):
            var = ProductoCategoria.objects.create(
                producto=prod,
                categoria=cat,
                color=color,
                talla=talla,
                precio_variante=15.00,
                precio_unitario=15.00,
                stock=10
            )
            print(f"   ✅ Variante: {color}/{talla}")
    
    print("\n✅ Datos de prueba creados exitosamente")
else:
    print("\n✅ Base de datos ya contiene datos")

print("\n" + "=" * 60)
