"""
Vista API dedicada para subida de imágenes a S3
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from app_productos.models import Imagen_Producto, ProductoCategoria
from app_productos.serializers import ImagenProductoSerializer
import os

class ImageUploadAPIView(APIView):
    """
    API específica para subir imágenes directamente a S3
    """
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        """
        Subir imagen a S3
        
        Parámetros esperados:
        - imagen: archivo de imagen
        - Producto_categoria: ID de la variante del producto
        - texto: descripción de la imagen (opcional)
        - es_principal: si es la imagen principal (opcional, default: false)
        """
        try:
            # Validar que se envió un archivo
            if 'imagen' not in request.FILES:
                return Response({
                    'success': False,
                    'error': 'No se envió ningún archivo'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            imagen_file = request.FILES['imagen']
            
            # Validar que se envió el ID de producto_categoria
            producto_categoria_id = request.data.get('Producto_categoria')
            if not producto_categoria_id:
                return Response({
                    'success': False,
                    'error': 'Se requiere el ID de Producto_categoria'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validar que existe el producto_categoria
            try:
                producto_categoria = ProductoCategoria.objects.get(id=producto_categoria_id)
            except ProductoCategoria.DoesNotExist:
                return Response({
                    'success': False,
                    'error': f'No existe producto_categoria con ID {producto_categoria_id}'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Obtener datos opcionales
            texto = request.data.get('texto', '')
            es_principal = request.data.get('es_principal', 'false').lower() == 'true'
            
            # Si es principal, desmarcar otras imágenes principales
            if es_principal:
                Imagen_Producto.objects.filter(
                    Producto_categoria=producto_categoria,
                    es_principal=True
                ).update(es_principal=False)
            
            # Crear registro de imagen (esto automáticamente sube a S3)
            imagen_producto = Imagen_Producto.objects.create(
                imagen=imagen_file,
                texto=texto,
                es_principal=es_principal,
                Producto_categoria=producto_categoria
            )
            
            # Serializar respuesta
            serializer = ImagenProductoSerializer(imagen_producto)
            
            # Información de debug
            debug_info = {
                'storage_backend': default_storage.__class__.__name__,
                'archivo_guardado_en': imagen_producto.imagen.name,
                'url_completa': imagen_producto.imagen.url,
            }
            
            return Response({
                'success': True,
                'message': 'Imagen subida exitosamente a S3',
                'imagen': serializer.data,
                'debug': debug_info
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Error al subir imagen: {str(e)}',
                'tipo_error': type(e).__name__
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get(self, request, *args, **kwargs):
        """
        Obtener información sobre la configuración de S3
        """
        from django.conf import settings
        
        return Response({
            'storage_backend': default_storage.__class__.__name__,
            'storage_module': default_storage.__class__.__module__,
            'bucket_name': getattr(settings, 'AWS_STORAGE_BUCKET_NAME', 'No configurado'),
            'media_url': getattr(settings, 'MEDIA_URL', 'No configurado'),
            's3_region': getattr(settings, 'AWS_S3_REGION_NAME', 'No configurado'),
        })
