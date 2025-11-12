from rest_framework import serializers
from .models import Carrito, ItemCarrito
from app_productos.models import Producto, ProductoCategoria
from app_Cliente.models import Cliente

class ProductoBasicoSerializer(serializers.ModelSerializer):
    """Serializer básico para mostrar info del producto en el carrito"""
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'peso']

class ProductoCategoriaBasicoSerializer(serializers.ModelSerializer):
    """Serializer para mostrar variante del producto"""
    producto = ProductoBasicoSerializer(read_only=True)
    
    class Meta:
        model = ProductoCategoria
        fields = ['id', 'producto', 'color', 'talla', 'capacidad', 'precio_unitario', 'stock']

class ItemCarritoSerializer(serializers.ModelSerializer):
    """Serializer completo para items del carrito"""
    variante_info = ProductoCategoriaBasicoSerializer(source='producto_variante', read_only=True)
    subtotal = serializers.SerializerMethodField()
    imagen_principal = serializers.SerializerMethodField()
    
    class Meta:
        model = ItemCarrito
        fields = ['id', 'carrito', 'producto_variante', 'cantidad', 'variante_info', 'subtotal', 'imagen_principal']
        read_only_fields = ['carrito']
    
    def get_subtotal(self, obj):
        """Calcula el subtotal del item"""
        return obj.cantidad * obj.producto_variante.precio_unitario
    
    def get_imagen_principal(self, obj):
        """Obtiene la imagen principal de la variante"""
        from app_productos.models import Imagen_Producto
        try:
            imagen = Imagen_Producto.objects.filter(
                Producto_categoria=obj.producto_variante,
                es_principal=True
            ).first()
            if imagen:
                return imagen.imagen_url or imagen.imagen.url if imagen.imagen else None
            else:
                # Si no hay imagen principal, tomar la primera disponible
                imagen = Imagen_Producto.objects.filter(
                    Producto_categoria=obj.producto_variante
                ).first()
                return imagen.imagen_url or imagen.imagen.url if imagen and imagen.imagen else None
        except:
            return None
    
    def validate_cantidad(self, value):
        """Valida que la cantidad sea positiva"""
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")
        return value
    
    def validate_producto_variante(self, value):
        """Valida que el producto tenga stock disponible"""
        if not value.stock or value.stock <= 0:
            raise serializers.ValidationError("Producto sin stock disponible")
        return value

class CarritoSerializer(serializers.ModelSerializer):
    """Serializer completo del carrito con todos sus items"""
    items = ItemCarritoSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_precio = serializers.SerializerMethodField()
    
    class Meta:
        model = Carrito
        fields = ['id', 'cliente', 'fecha_creacion', 'fecha_modificacion', 'items', 'total_items', 'total_precio']
        read_only_fields = ['cliente', 'fecha_creacion', 'fecha_modificacion']
    
    def get_total_items(self, obj):
        """Cuenta total de items en el carrito"""
        return obj.items.count()
    
    def get_total_precio(self, obj):
        """Calcula el precio total del carrito"""
        total = 0
        for item in obj.items.all():
            total += item.cantidad * item.producto_variante.precio_unitario
        return total

class AgregarItemCarritoSerializer(serializers.Serializer):
    """Serializer para agregar items al carrito"""
    producto_variante_id = serializers.IntegerField()
    cantidad = serializers.IntegerField(default=1)
    
    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")
        return value
    
    def validate_producto_variante_id(self, value):
        try:
            producto = ProductoCategoria.objects.get(id=value)
            if not producto.stock or producto.stock <= 0:
                raise serializers.ValidationError("Producto sin stock disponible")
            return value
        except ProductoCategoria.DoesNotExist:
            raise serializers.ValidationError("Producto no encontrado")