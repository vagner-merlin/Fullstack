from django.urls import path , include
from .api  import ClienteViewSet , Metodo_PagoViewSet , Direccion_EnvioViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('clientes', ClienteViewSet, basename='cliente')
router.register('metodos_pago', Metodo_PagoViewSet, basename='metodo_pago')
router.register('direcciones_envio', Direccion_EnvioViewSet, basename='direccion_envio')

urlpatterns = [
    path('', include(router.urls)),
]



