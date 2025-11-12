from rest_framework import serializers
from .models import (
    Producto, Categoria, ProductoCategoria, reseña, 
    Imagen_Producto, item_pedido, item_compras, Inventario
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
    imagen_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Imagen_Producto
        fields = ['id', 'imagen', 'imagen_url', 'texto', 'es_principal', 'Producto_categoria']
    
    def get_imagen_url(self, obj):
        """Obtener URL completa de la imagen en S3"""
        if obj.imagen:
            return obj.imagen.url
        return None

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
        print(f"🎨 Serializando variantes para {obj.nombre}: {variantes.count()} variantes")
        
        serialized_data = ProductoCategoriaSerializer(variantes, many=True).data
        
        # Debug de imágenes
        for i, variante_data in enumerate(serialized_data):
            imagenes = variante_data.get('imagenes', [])
            print(f"   Variante {i+1}: {len(imagenes)} imágenes")
            for j, img in enumerate(imagenes):
                print(f"     Imagen {j+1}: {img.get('imagen_url', 'Sin URL')}")
        
        return serialized_data
    
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

class InventarioSerializer(serializers.ModelSerializer):
    """Serializer para inventario de productos"""
    producto_info = ProductoBasicoSerializer(source='Producto_id', read_only=True)
    
    class Meta:
        model = Inventario
        fields = [
            'id', 'cantidad_entradas', 'stock_minimo', 'stock_maximo',
            'ubicacion_almacen', 'ultima_actualizacion', 'Producto_id', 'producto_info'
        ]
        read_only_fields = ['ultima_actualizacion']
    
    def validate_cantidad_entradas(self, value):
        if value < 0:
            raise serializers.ValidationError("La cantidad de entradas no puede ser negativa")
        return value
    
    def validate_stock_minimo(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock mínimo no puede ser negativo")
        return value
    
    def validate_stock_maximo(self, value):
        if value < 0:
            raise serializers.ValidationError("El stock máximo no puede ser negativo")
        return value
    
    def validate(self, data):
        """Validar que el stock mínimo sea menor que el stock máximo"""
        stock_minimo = data.get('stock_minimo')
        stock_maximo = data.get('stock_maximo')
        
        if stock_minimo and stock_maximo and stock_minimo > stock_maximo:
            raise serializers.ValidationError({
                'stock_minimo': 'El stock mínimo no puede ser mayor que el stock máximo'
            })
        
        return data
