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


class ImageDisplayAPIView(APIView):
    """
    API específica para obtener y mostrar imágenes almacenadas en S3
    """
    permission_classes = [permissions.AllowAny]  # Público para ver imágenes
    
    def get(self, request, *args, **kwargs):
        """
        Obtener imágenes de productos con filtros opcionales
        
        Parámetros de consulta opcionales:
        - producto_categoria: ID de la variante del producto
        - producto: ID del producto
        - categoria: ID de la categoría
        - principal: 'true' para solo imágenes principales
        - imagen_id: ID específico de la imagen
        """
        try:
            # Obtener parámetros de filtro
            producto_categoria_id = request.query_params.get('producto_categoria')
            producto_id = request.query_params.get('producto')
            categoria_id = request.query_params.get('categoria')
            solo_principal = request.query_params.get('principal', 'false').lower() == 'true'
            imagen_id = request.query_params.get('imagen_id')
            
            # Base queryset
            queryset = Imagen_Producto.objects.select_related(
                'Producto_categoria',
                'Producto_categoria__producto',
                'Producto_categoria__categoria'
            )
            
            # Aplicar filtros
            if imagen_id:
                # Si se solicita una imagen específica
                try:
                    imagen = queryset.get(id=imagen_id)
                    return self._format_single_image_response(imagen)
                except Imagen_Producto.DoesNotExist:
                    return Response({
                        'success': False,
                        'error': f'No se encontró imagen con ID {imagen_id}'
                    }, status=status.HTTP_404_NOT_FOUND)
            
            # Filtros múltiples
            if producto_categoria_id:
                queryset = queryset.filter(Producto_categoria_id=producto_categoria_id)
            
            if producto_id:
                queryset = queryset.filter(Producto_categoria__producto_id=producto_id)
            
            if categoria_id:
                queryset = queryset.filter(Producto_categoria__categoria_id=categoria_id)
            
            if solo_principal:
                queryset = queryset.filter(es_principal=True)
            
            # Ordenar por imagen principal primero
            queryset = queryset.order_by('-es_principal', 'id')
            
            # Serializar y formatear respuesta
            imagenes_data = []
            for imagen in queryset:
                imagen_info = self._format_image_data(imagen)
                imagenes_data.append(imagen_info)
            
            print(f"🖼️ API Display: Devolviendo {len(imagenes_data)} imágenes")
            
            return Response({
                'success': True,
                'count': len(imagenes_data),
                'imagenes': imagenes_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Error al obtener imágenes: {str(e)}',
                'tipo_error': type(e).__name__
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _format_single_image_response(self, imagen):
        """Formatear respuesta para una imagen específica"""
        imagen_data = self._format_image_data(imagen)
        
        return Response({
            'success': True,
            'imagen': imagen_data
        }, status=status.HTTP_200_OK)
    
    def _format_image_data(self, imagen):
        """Formatear datos de una imagen con toda la información necesaria"""
        try:
            producto_categoria = imagen.Producto_categoria
            producto = producto_categoria.producto
            categoria = producto_categoria.categoria
            
            return {
                'id': imagen.id,
                'imagen_url': imagen.imagen.url if imagen.imagen else None,
                'imagen_name': imagen.imagen.name if imagen.imagen else None,
                'texto': imagen.texto,
                'es_principal': imagen.es_principal,
                'producto_categoria_id': producto_categoria.id,
                
                # Información del producto
                'producto_info': {
                    'id': producto.id,
                    'nombre': producto.nombre,
                    'descripcion': producto.descripcion,
                    'activo': producto.activo,
                    'peso': float(producto.peso) if producto.peso else None
                },
                
                # Información de la categoría
                'categoria_info': {
                    'id': categoria.id,
                    'nombre': categoria.nombre,
                    'descripcion': categoria.descripcion
                },
                
                # Información de la variante
                'variante_info': {
                    'color': producto_categoria.color,
                    'talla': producto_categoria.talla,
                    'capacidad': producto_categoria.capacidad,
                    'precio_variante': float(producto_categoria.precio_variante),
                    'precio_unitario': float(producto_categoria.precio_unitario),
                    'stock': producto_categoria.stock,
                    'fecha_creacion': producto_categoria.fecha_creacion.isoformat() if producto_categoria.fecha_creacion else None
                },
                
                # Información de S3
                's3_info': {
                    'storage_backend': default_storage.__class__.__name__,
                    'file_size': imagen.imagen.size if imagen.imagen else None,
                    'content_type': self._get_content_type(imagen.imagen.name) if imagen.imagen else None
                }
            }
        except Exception as e:
            print(f"⚠️ Error formateando imagen {imagen.id}: {str(e)}")
            return {
                'id': imagen.id,
                'error': f'Error al formatear imagen: {str(e)}',
                'imagen_url': imagen.imagen.url if imagen.imagen else None,
                'texto': imagen.texto,
                'es_principal': imagen.es_principal,
                'producto_categoria_id': imagen.Producto_categoria_id
            }
    
    def _get_content_type(self, filename):
        """Determinar el tipo de contenido basado en la extensión del archivo"""
        if not filename:
            return None
        
        extension = filename.lower().split('.')[-1]
        content_types = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'bmp': 'image/bmp'
        }
        
        return content_types.get(extension, 'image/jpeg')


class ImageStatsAPIView(APIView):
    """
    API para obtener estadísticas de imágenes
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, *args, **kwargs):
        """
        Obtener estadísticas de las imágenes almacenadas
        """
        try:
            # Contar imágenes
            total_imagenes = Imagen_Producto.objects.count()
            imagenes_principales = Imagen_Producto.objects.filter(es_principal=True).count()
            imagenes_secundarias = total_imagenes - imagenes_principales
            
            # Imágenes por producto
            productos_con_imagenes = Imagen_Producto.objects.values(
                'Producto_categoria__producto_id'
            ).distinct().count()
            
            # Imágenes por categoría
            categorias_con_imagenes = Imagen_Producto.objects.values(
                'Producto_categoria__categoria_id'
            ).distinct().count()
            
            return Response({
                'success': True,
                'estadisticas': {
                    'total_imagenes': total_imagenes,
                    'imagenes_principales': imagenes_principales,
                    'imagenes_secundarias': imagenes_secundarias,
                    'productos_con_imagenes': productos_con_imagenes,
                    'categorias_con_imagenes': categorias_con_imagenes,
                    'storage_backend': default_storage.__class__.__name__
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Error al obtener estadísticas: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
