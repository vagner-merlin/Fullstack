from django.contrib.auth.models import User , Group , Permission
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class GroupSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

class PermissionSerializer(ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128)

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, write_only=True)
    first_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    
    def validate_username(self, value):
        """Validar que el username sea único"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya existe.")
        return value
    
    def validate_email(self, value):
        """Validar que el email sea único"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email ya está registrado.")
        return value
    
    def create(self, validated_data):
        """Crear un nuevo usuario cliente"""
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_staff=False,  # No será staff
            is_superuser=False,  # No será superuser
            is_active=True  # Usuario activo
        )
        return user

class UserGroupSerializer(serializers.Serializer):
    """Serializer para agregar/eliminar usuarios a grupos"""
    user_id = serializers.IntegerField()
    group_id = serializers.IntegerField()
    
    def validate_user_id(self, value):
        """Validar que el usuario exista"""
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError("Usuario no encontrado.")
        return value
    
    def validate_group_id(self, value):
        """Validar que el grupo exista"""
        if not Group.objects.filter(id=value).exists():
            raise serializers.ValidationError("Grupo no encontrado.")
        return value


