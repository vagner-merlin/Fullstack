from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework import serializers
from .models import Cliente, Metodo_Pago, Direccion_Envio
from django.contrib.auth.models import User


class UserDetailSerializer(ModelSerializer):
    """Serializer para información detallada del usuario"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'date_joined', 'last_login']
        read_only_fields = ['id', 'date_joined', 'last_login']


class ClienteSerializer(ModelSerializer):
    """Serializer básico para Cliente"""
    class Meta:
        model = Cliente
        fields = '__all__'


class ClienteDetailSerializer(ModelSerializer):
    """Serializer completo con información del usuario"""
    usuario_info = UserDetailSerializer(source='usuario', read_only=True)
    usuario_email = SerializerMethodField()
    usuario_nombre_completo = SerializerMethodField()
    usuario_activo = SerializerMethodField()
    
    class Meta:
        model = Cliente
        fields = [
            'id', 'telefono', 'fecha_creacion', 'fecha_nacimiento',
            'usuario', 'usuario_info', 'usuario_email', 
            'usuario_nombre_completo', 'usuario_activo'
        ]
    
    def get_usuario_email(self, obj):
        return obj.usuario.email if obj.usuario else None
    
    def get_usuario_nombre_completo(self, obj):
        if obj.usuario:
            return f"{obj.usuario.first_name} {obj.usuario.last_name}".strip() or obj.usuario.username
        return None
    
    def get_usuario_activo(self, obj):
        return obj.usuario.is_active if obj.usuario else False


class Metodo_PagoSerializer(ModelSerializer):
    class Meta:
        model = Metodo_Pago
        fields = '__all__'

class Direccion_EnvioSerializer(ModelSerializer):
    class Meta:
        model = Direccion_Envio
        fields = '__all__'

