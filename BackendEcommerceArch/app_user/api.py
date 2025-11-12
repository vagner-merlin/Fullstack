from .serializers import (
    UserSerializer, GroupSerializer, PermissionSerializer, 
    LoginSerializer, RegisterSerializer, UserGroupSerializer,
    CreateGroupSerializer, CreateEmployeeSerializer, EmployeeDetailSerializer
)
from django.contrib.auth.models import User, Group, Permission
from rest_framework import viewsets , permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """Lista todos los grupos con información de usuarios"""
        groups = self.get_queryset()
        data = []
        for group in groups:
            data.append({
                'id': group.id,
                'name': group.name,
                'users_count': group.user_set.count(),
                'permissions_count': group.permissions.count()
            })
        
        return Response({
            'success': True,
            'count': len(data),
            'groups': data
        })
    
    def create(self, request):
        """Crear un nuevo grupo"""
        serializer = CreateGroupSerializer(data=request.data)
        if serializer.is_valid():
            group = serializer.save()
            return Response({
                'success': True,
                'message': 'Grupo creado exitosamente',
                'group': {
                    'id': group.id,
                    'name': group.name
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Datos inválidos',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """Eliminar un grupo"""
        try:
            group = self.get_object()
            group_name = group.name
            group.delete()
            
            return Response({
                'success': True,
                'message': f'Grupo "{group_name}" eliminado exitosamente'
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error al eliminar grupo: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    API para login de usuarios usando email y password
    Retorna token y ID del usuario
    """
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            # Buscar usuario por email
            user = User.objects.get(email=email)
            
            # Autenticar usuario
            user_auth = authenticate(username=user.username, password=password)
            
            if user_auth is not None:
                # Crear o obtener token
                token, created = Token.objects.get_or_create(user=user)
                
                return Response({
                    'success': True,
                    'message': 'Login exitoso',
                    'token': token.key,
                    'user_id': user.id,
                    'email': user.email,
                    'username': user.username
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'message': 'Credenciales inválidas'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Usuario no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
    
    return Response({
        'success': False,
        'message': 'Datos inválidos',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    API para logout de usuarios
    Elimina el token del usuario autenticado
    """
    try:
        # Obtener y eliminar el token del usuario
        token = Token.objects.get(user=request.user)
        token.delete()
        
        return Response({
            'success': True,
            'message': 'Logout exitoso'
        }, status=status.HTTP_200_OK)
        
    except Token.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Token no encontrado'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    API para registrar nuevos usuarios clientes
    Crea un usuario normal (no superuser) y retorna token
    Automáticamente lo agrega al grupo "Clientes" (id=3)
    """
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            # Crear el usuario usando el serializer
            user = serializer.save()
            
            # Crear token automáticamente
            token, created = Token.objects.get_or_create(user=user)
            
            # Agregar automáticamente al grupo "Clientes" (id=3)
            group_id = None
            group_name = None
            try:
                cliente_group = Group.objects.get(id=3)
                # Agregar usuario al grupo
                user.groups.add(cliente_group)
                # Guardar explícitamente la relación
                user.save()
                # Verificar que se guardó correctamente
                if cliente_group in user.groups.all():
                    group_id = cliente_group.id
                    group_name = cliente_group.name
                    print(f"✅ Usuario {user.username} agregado exitosamente al grupo {group_name}")
                else:
                    print(f"⚠️ ADVERTENCIA: No se pudo verificar que el usuario {user.username} fue agregado al grupo")
            except Group.DoesNotExist:
                # Si no existe el grupo con id=3, intentar crearlo
                print("⚠️ ADVERTENCIA: Grupo 'cliente' (id=3) no existe en la base de datos")
                cliente_group = Group.objects.create(id=3, name='cliente')
                user.groups.add(cliente_group)
                user.save()
                group_id = cliente_group.id
                group_name = cliente_group.name
                print(f"✅ Grupo 'cliente' creado y usuario {user.username} agregado")
            except Exception as group_error:
                print(f"❌ ERROR al agregar usuario al grupo: {str(group_error)}")
            
            return Response({
                'success': True,
                'message': 'Usuario registrado exitosamente',
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'group_id': group_id,
                'group_name': group_name
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"❌ ERROR al crear el usuario: {str(e)}")
            return Response({
                'success': False,
                'message': 'Error al crear el usuario',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'success': False,
        'message': 'Datos inválidos',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_user_to_group(request):
    """
    API para agregar un usuario a un grupo
    Crea la relación en auth_user_groups
    """
    serializer = UserGroupSerializer(data=request.data)
    
    if serializer.is_valid():
        user_id = serializer.validated_data['user_id']
        group_id = serializer.validated_data['group_id']
        
        try:
            user = User.objects.get(id=user_id)
            group = Group.objects.get(id=group_id)
            
            # Verificar si el usuario ya está en el grupo
            if group in user.groups.all():
                return Response({
                    'success': False,
                    'message': 'El usuario ya pertenece a este grupo'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Agregar usuario al grupo
            user.groups.add(group)
            
            return Response({
                'success': True,
                'message': 'Usuario agregado al grupo exitosamente',
                'user_id': user.id,
                'username': user.username,
                'group_id': group.id,
                'group_name': group.name
            }, status=status.HTTP_201_CREATED)
            
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Usuario no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
            
        except Group.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Grupo no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
    
    return Response({
        'success': False,
        'message': 'Datos inválidos',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_user_from_group(request):
    """
    API para eliminar un usuario de un grupo
    Elimina la relación en auth_user_groups
    """
    serializer = UserGroupSerializer(data=request.data)
    
    if serializer.is_valid():
        user_id = serializer.validated_data['user_id']
        group_id = serializer.validated_data['group_id']
        
        try:
            user = User.objects.get(id=user_id)
            group = Group.objects.get(id=group_id)
            
            # Verificar si el usuario está en el grupo
            if group not in user.groups.all():
                return Response({
                    'success': False,
                    'message': 'El usuario no pertenece a este grupo'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Remover usuario del grupo
            user.groups.remove(group)
            
            return Response({
                'success': True,
                'message': 'Usuario removido del grupo exitosamente',
                'user_id': user.id,
                'username': user.username,
                'group_id': group.id,
                'group_name': group.name
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Usuario no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
            
        except Group.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Grupo no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
    
    return Response({
        'success': False,
        'message': 'Datos inválidos',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_employee(request):
    """
    API para crear usuarios empleados/vendedores
    Crea un usuario y lo asigna a un grupo específico
    """
    serializer = CreateEmployeeSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            user = serializer.save()
            
            # Obtener información del grupo
            group = user.groups.first()
            
            return Response({
                'success': True,
                'message': 'Empleado creado exitosamente',
                'employee': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_staff': user.is_staff,
                    'is_active': user.is_active,
                    'group_id': group.id if group else None,
                    'group_name': group.name if group else None
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error al crear empleado: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'success': False,
        'message': 'Datos inválidos',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_employees(request):
    """
    API para listar todos los empleados (usuarios no clientes)
    Excluye usuarios del grupo "cliente" (id=3)
    """
    try:
        # Obtener grupo de clientes
        cliente_group = Group.objects.filter(id=3).first()
        
        if cliente_group:
            # Excluir usuarios del grupo clientes
            employees = User.objects.exclude(groups=cliente_group).exclude(is_superuser=True)
        else:
            # Si no existe el grupo clientes, mostrar todos menos superusers
            employees = User.objects.filter(is_superuser=False)
        
        serializer = EmployeeDetailSerializer(employees, many=True)
        
        return Response({
            'success': True,
            'count': employees.count(),
            'employees': serializer.data
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error al listar empleados: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_employee(request, user_id):
    """
    API para eliminar un empleado
    """
    try:
        user = User.objects.get(id=user_id)
        
        # No permitir eliminar superusers
        if user.is_superuser:
            return Response({
                'success': False,
                'message': 'No se puede eliminar un superusuario'
            }, status=status.HTTP_403_FORBIDDEN)
        
        username = user.username
        user.delete()
        
        return Response({
            'success': True,
            'message': f'Empleado "{username}" eliminado exitosamente'
        })
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Empleado no encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error al eliminar empleado: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_employee_active(request, user_id):
    """
    API para activar/desactivar un empleado
    """
    try:
        user = User.objects.get(id=user_id)
        
        # No permitir desactivar superusers
        if user.is_superuser:
            return Response({
                'success': False,
                'message': 'No se puede modificar un superusuario'
            }, status=status.HTTP_403_FORBIDDEN)
        
        user.is_active = not user.is_active
        user.save()
        
        serializer = EmployeeDetailSerializer(user)
        
        return Response({
            'success': True,
            'message': f'Empleado {"activado" if user.is_active else "desactivado"} exitosamente',
            'employee': serializer.data
        })
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Empleado no encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error al modificar empleado: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
