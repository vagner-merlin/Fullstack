from rest_framework import serializers
from .models import Proveedor, compra

class ProveedorSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Proveedor"""
    
    class Meta:
        model = Proveedor
        fields = ['id', 'nombre', 'nombre_contacto', 'telefono', 'email', 'direccion']
    
    def validate_email(self, value):
        """Validar formato de email"""
        if not value:
            raise serializers.ValidationError("El email es obligatorio")
        return value
    
    def validate_telefono(self, value):
        """Validar que el teléfono no esté vacío"""
        if not value.strip():
            raise serializers.ValidationError("El teléfono es obligatorio")
        return value

class CompraSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Compra"""
    
    class Meta:
        model = compra
        fields = ['id', 'fecha_compra', 'monto_total', 'estado']
        read_only_fields = ['fecha_compra']  # La fecha se asigna automáticamente
    
    def validate_monto_total(self, value):
        """Validar que el monto sea positivo"""
        if value <= 0:
            raise serializers.ValidationError("El monto total debe ser mayor a 0")
        return value