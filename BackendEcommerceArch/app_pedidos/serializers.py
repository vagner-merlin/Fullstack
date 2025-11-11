from rest_framework import serializers
from .models import Pedido
from app_Cliente.serializers import ClienteSerializer, Direccion_EnvioSerializer
from app_Cliente.models import Cliente, Direccion_Envio

class PedidoSerializer(serializers.ModelSerializer):
    """Serializer completo para el modelo Pedido usando serializers existentes"""
    cliente_info = ClienteSerializer(source='cliente', read_only=True)
    direccion_info = Direccion_EnvioSerializer(source='direccion_envio', read_only=True)
    
    class Meta:
        model = Pedido
        fields = [
            'id', 'cliente', 'direccion_envio', 'fecha_pedido', 
            'monto_total', 'estado', 'cliente_info', 'direccion_info'
        ]
        read_only_fields = ['fecha_pedido']  # La fecha se asigna automáticamente
    
    def validate_monto_total(self, value):
        """Validar que el monto sea positivo"""
        if value <= 0:
            raise serializers.ValidationError("El monto total debe ser mayor a 0")
        return value
    
    def validate_estado(self, value):
        """Validar estados permitidos"""
        estados_permitidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']
        if value.lower() not in estados_permitidos:
            raise serializers.ValidationError(
                f"Estado no válido. Estados permitidos: {', '.join(estados_permitidos)}"
            )
        return value.lower()
    
    def validate(self, data):
        """Validar que la dirección pertenezca al cliente"""
        cliente = data.get('cliente')
        direccion_envio = data.get('direccion_envio')
        
        if cliente and direccion_envio:
            if direccion_envio.Cliente != cliente:
                raise serializers.ValidationError(
                    "La dirección de envío debe pertenecer al cliente seleccionado"
                )
        
        return data

class PedidoCreateSerializer(serializers.ModelSerializer):
    """Serializer simplificado para crear/actualizar pedidos"""
    
    class Meta:
        model = Pedido
        fields = ['cliente', 'direccion_envio', 'monto_total', 'estado']
    
    def validate_monto_total(self, value):
        if value <= 0:
            raise serializers.ValidationError("El monto total debe ser mayor a 0")
        return value
    
    def validate_estado(self, value):
        estados_permitidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']
        if value.lower() not in estados_permitidos:
            raise serializers.ValidationError(
                f"Estado no válido. Estados permitidos: {', '.join(estados_permitidos)}"
            )
        return value.lower()
    
    def validate(self, data):
        cliente = data.get('cliente')
        direccion_envio = data.get('direccion_envio')
        
        if cliente and direccion_envio:
            if direccion_envio.Cliente != cliente:
                raise serializers.ValidationError(
                    "La dirección de envío debe pertenecer al cliente seleccionado"
                )
        
        return data
