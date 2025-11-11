from rest_framework import serializers
from .models import (
    Producto, Categoria, ProductoCategoria, reseña, 
    Imagen_Producto, item_pedido, item_compras
)
from app_Cliente.serializers import ClienteSerializer
from app_compras.serializers import CompraSerializer

class CategoriaSerializer(serializers.ModelSerializer):
    """Serializer para categorías con subcategorías"""
    subcategorias = serializers.SerializerMethodField()
    
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion', 'activo', 'id_padre', 'fecha_creacion', 'subcategorias']
    
    def get_subcategorias(self, obj):
        """Obtener subcategorías hijas"""
        subcategorias = obj.subcategorias.filter(activo=True)
        return CategoriaBasicaSerializer(subcategorias, many=True).data

class CategoriaBasicaSerializer(serializers.ModelSerializer):
    """Serializer básico para categorías (evitar recursión infinita)"""
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion', 'activo']

class ImagenProductoSerializer(serializers.ModelSerializer):
    """Serializer para imágenes de productos"""
    class Meta:
        model = Imagen_Producto
        fields = ['id', 'Producto_url', 'texto', 'es_principal', 'Producto_categoria']

class ProductoBasicoSerializer(serializers.ModelSerializer):
    """Serializer básico para productos"""
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'activo', 'fecha_creacion', 'peso']

class ProductoCategoriaSerializer(serializers.ModelSerializer):
    """Serializer completo para variantes de productos"""
    producto_info = ProductoBasicoSerializer(source='producto', read_only=True)
    categoria_info = CategoriaBasicaSerializer(source='categoria', read_only=True)
    imagenes = serializers.SerializerMethodField()
    imagen_principal = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductoCategoria
        fields = [
            'id', 'producto', 'categoria', 'color', 'talla', 'capacidad',
            'precio_variante', 'precio_unitario', 'stock', 'fecha_creacion',
            'producto_info', 'categoria_info', 'imagenes', 'imagen_principal'
        ]
    
    def get_imagenes(self, obj):
        """Obtener todas las imágenes del producto"""
        imagenes = Imagen_Producto.objects.filter(Producto_categoria=obj)
        return ImagenProductoSerializer(imagenes, many=True).data
    
    def get_imagen_principal(self, obj):
        """Obtener la imagen principal del producto"""
        imagen_principal = Imagen_Producto.objects.filter(
            Producto_categoria=obj, 
            es_principal=True
        ).first()
        if imagen_principal:
            return ImagenProductoSerializer(imagen_principal).data
        return None

class ProductoCategoriaCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear/actualizar variantes de productos"""
    class Meta:
        model = ProductoCategoria
        fields = [
            'producto', 'categoria', 'color', 'talla', 'capacidad',
            'precio_variante', 'precio_unitario', 'stock'
        ]
    
    def validate_precio_variante(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio variante no puede ser negativo")
        return value
    
    def validate_precio_unitario(self, value):
        if value <= 0:
            raise serializers.ValidationError("El precio unitario debe ser mayor a 0")
        return value
    
    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock no puede ser negativo")
        return value

class ReseñaSerializer(serializers.ModelSerializer):
    """Serializer para reseñas de productos"""
    cliente_info = ClienteSerializer(source='Cliente', read_only=True)
    
    class Meta:
        model = reseña
        fields = [
            'id', 'calificacion', 'comentario', 'fecha_reseña',
            'Producto_categoria', 'Cliente', 'cliente_info'
        ]
        read_only_fields = ['fecha_reseña']
    
    def validate_calificacion(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La calificación debe estar entre 1 y 5")
        return value

class ReseñaCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear reseñas"""
    class Meta:
        model = reseña
        fields = ['calificacion', 'comentario', 'Producto_categoria', 'Cliente']
    
    def validate_calificacion(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La calificación debe estar entre 1 y 5")
        return value

class ProductoCompletoSerializer(serializers.ModelSerializer):
    """Serializer completo para productos con todas sus variantes"""
    variantes = serializers.SerializerMethodField()
    categorias = serializers.SerializerMethodField()
    
    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'activo', 'fecha_creacion', 
            'peso', 'variantes', 'categorias'
        ]
    
    def get_variantes(self, obj):
        """Obtener todas las variantes del producto"""
        variantes = ProductoCategoria.objects.filter(producto=obj)
        return ProductoCategoriaSerializer(variantes, many=True).data
    
    def get_categorias(self, obj):
        """Obtener todas las categorías del producto"""
        categorias = Categoria.objects.filter(
            productocategoria__producto=obj
        ).distinct()
        return CategoriaBasicaSerializer(categorias, many=True).data

class ItemPedidoSerializer(serializers.ModelSerializer):
    """Serializer para items de pedido"""
    producto_info = ProductoCategoriaSerializer(source='Producto_variante', read_only=True)
    
    class Meta:
        model = item_pedido
        fields = ['id', 'Producto_variante', 'pedido', 'cantidad', 'producto_info']
    
    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")
        return value

class ItemComprasSerializer(serializers.ModelSerializer):
    """Serializer para items de compras"""
    producto_info = ProductoCategoriaSerializer(source='producto_variante', read_only=True)
    compra_info = CompraSerializer(source='compra', read_only=True)
    
    class Meta:
        model = item_compras
        fields = ['id', 'producto_variante', 'compra', 'cantidad', 'producto_info', 'compra_info']
    
    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")
        return value
