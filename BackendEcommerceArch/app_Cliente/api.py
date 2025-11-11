from .serializers import ClienteSerializer , Metodo_PagoSerializer , Direccion_EnvioSerializer
from .models import Cliente , Metodo_Pago , Direccion_Envio
from rest_framework import viewsets, permissions

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [permissions.IsAuthenticated]


class Metodo_PagoViewSet(viewsets.ModelViewSet):
    queryset = Metodo_Pago.objects.all()
    serializer_class = Metodo_PagoSerializer
    permission_classes = [permissions.IsAuthenticated]


class Direccion_EnvioViewSet(viewsets.ModelViewSet):
    queryset = Direccion_Envio.objects.all()
    serializer_class = Direccion_EnvioSerializer
    permission_classes = [permissions.IsAuthenticated]


