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

class CreateGroupSerializer(serializers.Serializer):
    """Serializer para crear grupos en auth_group"""
    name = serializers.CharField(max_length=150)
    
    def validate_name(self, value):
        """Validar que el nombre del grupo sea único"""
        if Group.objects.filter(name=value).exists():
            raise serializers.ValidationError("Ya existe un grupo con este nombre.")
        return value
    
    def create(self, validated_data):
        """Crear un nuevo grupo"""
        group = Group.objects.create(name=validated_data['name'])
        return group

class CreateEmployeeSerializer(serializers.Serializer):
    """Serializer para crear usuarios empleados/vendedores"""
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, write_only=True)
    first_name = serializers.CharField(max_length=30, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    group_id = serializers.IntegerField(required=True)
    is_staff = serializers.BooleanField(default=False, required=False)
    
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
    
    def validate_group_id(self, value):
        """Validar que el grupo exista"""
        if not Group.objects.filter(id=value).exists():
            raise serializers.ValidationError("Grupo no encontrado.")
        return value
    
    def create(self, validated_data):
        """Crear un nuevo usuario empleado y asignarlo a un grupo"""
        group_id = validated_data.pop('group_id')
        
        # Crear usuario
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_staff=validated_data.get('is_staff', False),
            is_superuser=False,
            is_active=True
        )
        
        # Asignar al grupo
        group = Group.objects.get(id=group_id)
        user.groups.add(group)
        user.save()
        
        return user

class EmployeeDetailSerializer(serializers.ModelSerializer):
    """Serializer detallado para mostrar empleados con sus grupos"""
    groups = GroupSerializer(many=True, read_only=True)
    group_names = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'is_active', 'is_staff', 'date_joined', 'last_login', 
                 'groups', 'group_names']
    
    def get_group_names(self, obj):
        """Retorna lista de nombres de grupos"""
        return [group.name for group in obj.groups.all()]



