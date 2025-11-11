from rest_framework.serializers import ModelSerializer
from .models import Cliente , Metodo_Pago , Direccion_Envio




class ClienteSerializer(ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'


class Metodo_PagoSerializer(ModelSerializer):
    class Meta:
        model = Metodo_Pago
        fields = '__all__'

class Direccion_EnvioSerializer(ModelSerializer):
    class Meta:
        model = Direccion_Envio
        fields = '__all__'

