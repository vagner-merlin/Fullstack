from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import (
    ProductoViewSet, CategoriaViewSet, ProductoCategoriaViewSet,
    ReseñaViewSet, ImagenProductoViewSet, ItemPedidoViewSet, ItemComprasViewSet,
    InventarioViewSet
)
from .upload_api import ImageUploadAPIView, ImageDisplayAPIView, ImageStatsAPIView

router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'variantes', ProductoCategoriaViewSet, basename='producto-categoria')
router.register(r'reseñas', ReseñaViewSet, basename='reseña')
router.register(r'imagenes', ImagenProductoViewSet, basename='imagen-producto')
router.register(r'items-pedido', ItemPedidoViewSet, basename='item-pedido')
router.register(r'items-compras', ItemComprasViewSet, basename='item-compras')
router.register(r'inventario', InventarioViewSet, basename='inventario')

urlpatterns = [
    path('', include(router.urls)),
    path('upload-imagen/', ImageUploadAPIView.as_view(), name='upload-imagen'),
    path('mostrar-imagenes/', ImageDisplayAPIView.as_view(), name='mostrar-imagenes'),
    path('estadisticas-imagenes/', ImageStatsAPIView.as_view(), name='estadisticas-imagenes'),
]
