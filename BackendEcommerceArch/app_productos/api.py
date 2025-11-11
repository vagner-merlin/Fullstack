from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Avg
from .models import (
    Producto, Categoria, ProductoCategoria, reseña, 
    Imagen_Producto, item_pedido, item_compras
)
from .serializers import (
    ProductoBasicoSerializer, ProductoCompletoSerializer,
    CategoriaSerializer, ProductoCategoriaSerializer, ProductoCategoriaCreateSerializer,
    ReseñaSerializer, ReseñaCreateSerializer, ImagenProductoSerializer,
    ItemPedidoSerializer, ItemComprasSerializer
)

class ProductoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para productos - PÚBLICO (sin autenticación para ver catálogo)
    """
    queryset = Producto.objects.filter(activo=True)
    serializer_class = ProductoCompletoSerializer
    permission_classes = [permissions.AllowAny]  # Público para ver catálogo
    
    def get_queryset(self):
        """Filtrar productos con parámetros opcionales"""
        queryset = Producto.objects.filter(activo=True)
        
        # Filtro por nombre
        nombre = self.request.query_params.get('nombre', None)
        if nombre:
            queryset = queryset.filter(nombre__icontains=nombre)
        
        # Filtro por categoría
        categoria = self.request.query_params.get('categoria', None)
        if categoria:
            queryset = queryset.filter(productocategoria__categoria_id=categoria).distinct()
        
        return queryset.order_by('-fecha_creacion')
    
    def list(self, request, *args, **kwargs):
        """Listar productos del catálogo"""
        queryset = self.get_queryset()
        serializer = ProductoBasicoSerializer(queryset, many=True)  # Vista básica para listado
        
        return Response({
            'success': True,
            'count': queryset.count(),
            'productos': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        """Obtener producto completo con todas sus variantes"""
        producto = self.get_object()
        serializer = self.get_serializer(producto)
        
        return Response({
            'success': True,
            'producto': serializer.data
        })
    
    def get_permissions(self):
        """Permisos dinámicos: solo lectura pública, escritura autenticada"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'])
    def destacados(self, request):
        """Productos destacados (los más recientes o con mejor rating)"""
        productos_destacados = self.queryset.order_by('-fecha_creacion')[:6]
        serializer = ProductoBasicoSerializer(productos_destacados, many=True)
        
        return Response({
            'success': True,
            'count': productos_destacados.count(),
            'productos_destacados': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def variantes(self, request, pk=None):
        """Obtener todas las variantes de un producto específico"""
        producto = self.get_object()
        variantes = ProductoCategoria.objects.filter(producto=producto)
        serializer = ProductoCategoriaSerializer(variantes, many=True)
        
        return Response({
            'success': True,
            'producto': producto.nombre,
            'count': variantes.count(),
            'variantes': serializer.data
        })

class CategoriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para categorías - PÚBLICO para navegación
    """
    queryset = Categoria.objects.filter(activo=True)
    serializer_class = CategoriaSerializer
    
    def get_permissions(self):
        """Permisos dinámicos: solo lectura pública, escritura autenticada"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        
        return [permission() for permission in permission_classes]
    
    def list(self, request, *args, **kwargs):
        """Listar categorías principales (sin padre)"""
        categorias_principales = self.queryset.filter(id_padre__isnull=True)
        serializer = self.get_serializer(categorias_principales, many=True)
        
        return Response({
            'success': True,
            'count': categorias_principales.count(),
            'categorias': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def productos(self, request, pk=None):
        """Obtener productos de una categoría específica"""
        categoria = self.get_object()
        productos = Producto.objects.filter(
            productocategoria__categoria=categoria,
            activo=True
        ).distinct()
        
        serializer = ProductoBasicoSerializer(productos, many=True)
        
        return Response({
            'success': True,
            'categoria': categoria.nombre,
            'count': productos.count(),
            'productos': serializer.data
        })

class ProductoCategoriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para variantes de productos - PÚBLICO para ver, AUTENTICADO para modificar
    """
    queryset = ProductoCategoria.objects.all()
    serializer_class = ProductoCategoriaSerializer
    
    def get_serializer_class(self):
        """Usar diferentes serializers según la acción"""
        if self.action in ['create', 'update', 'partial_update']:
            return ProductoCategoriaCreateSerializer
        return ProductoCategoriaSerializer
    
    def get_permissions(self):
        """Permisos dinámicos"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filtrar variantes con parámetros"""
        queryset = ProductoCategoria.objects.select_related('producto', 'categoria')
        
        # Filtro por producto
        producto_id = self.request.query_params.get('producto', None)
        if producto_id:
            queryset = queryset.filter(producto_id=producto_id)
        
        # Filtro por categoría
        categoria_id = self.request.query_params.get('categoria', None)
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)
        
        # Filtro por disponibilidad
        disponible = self.request.query_params.get('disponible', None)
        if disponible == 'true':
            queryset = queryset.filter(stock__gt=0)
        
        return queryset.order_by('-fecha_creacion')
    
    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        """Variantes con stock disponible"""
        variantes_disponibles = self.queryset.filter(stock__gt=0)
        serializer = self.get_serializer(variantes_disponibles, many=True)
        
        return Response({
            'success': True,
            'count': variantes_disponibles.count(),
            'variantes': serializer.data
        })

class ReseñaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para reseñas - PÚBLICO para leer, AUTENTICADO para crear
    """
    queryset = reseña.objects.all()
    serializer_class = ReseñaSerializer
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ReseñaCreateSerializer
        return ReseñaSerializer
    
    def get_permissions(self):
        """Solo lectura pública, escritura autenticada"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filtrar reseñas por producto"""
        queryset = reseña.objects.select_related('Cliente', 'Producto_categoria')
        
        producto_variante = self.request.query_params.get('producto_variante', None)
        if producto_variante:
            queryset = queryset.filter(Producto_categoria_id=producto_variante)
        
        return queryset.order_by('-fecha_reseña')
    
    @action(detail=False, methods=['get'])
    def por_producto(self, request):
        """Reseñas de una variante específica con estadísticas"""
        producto_variante_id = request.query_params.get('producto_variante_id')
        
        if not producto_variante_id:
            return Response({
                'success': False,
                'message': 'producto_variante_id es requerido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        reseñas_producto = self.queryset.filter(Producto_categoria_id=producto_variante_id)
        serializer = self.get_serializer(reseñas_producto, many=True)
        
        # Calcular estadísticas
        promedio = reseñas_producto.aggregate(Avg('calificacion'))['calificacion__avg'] or 0
        
        return Response({
            'success': True,
            'producto_variante_id': producto_variante_id,
            'total_reseñas': reseñas_producto.count(),
            'calificacion_promedio': round(promedio, 2),
            'reseñas': serializer.data
        })

class ImagenProductoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para imágenes de productos - PÚBLICO para ver, AUTENTICADO para modificar
    """
    queryset = Imagen_Producto.objects.all()
    serializer_class = ImagenProductoSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filtrar imágenes por producto variante"""
        queryset = Imagen_Producto.objects.all()
        
        producto_categoria = self.request.query_params.get('producto_categoria', None)
        if producto_categoria:
            queryset = queryset.filter(Producto_categoria_id=producto_categoria)
        
        return queryset.order_by('-es_principal', 'id')

class ItemPedidoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para items de pedido - AUTENTICADO
    """
    queryset = item_pedido.objects.all()
    serializer_class = ItemPedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

class ItemComprasViewSet(viewsets.ModelViewSet):
    """
    ViewSet para items de compras - AUTENTICADO
    """
    queryset = item_compras.objects.all()
    serializer_class = ItemComprasSerializer
    permission_classes = [permissions.IsAuthenticated]
