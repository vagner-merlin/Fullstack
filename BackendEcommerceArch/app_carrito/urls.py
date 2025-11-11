from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import CarritoViewSet

router = DefaultRouter()
router.register(r'carritos', CarritoViewSet, basename='carrito')

urlpatterns = [
    path('', include(router.urls)),
]