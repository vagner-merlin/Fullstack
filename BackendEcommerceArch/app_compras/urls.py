from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import ProveedorViewSet, CompraViewSet

router = DefaultRouter()
router.register(r'proveedores', ProveedorViewSet, basename='proveedor')
router.register(r'compras', CompraViewSet, basename='compra')

urlpatterns = [
    path('', include(router.urls)),
]