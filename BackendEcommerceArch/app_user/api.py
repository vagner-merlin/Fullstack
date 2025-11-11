from .serializers import UserSerializer , GroupSerializer , PermissionSerializer, LoginSerializer, RegisterSerializer, UserGroupSerializer
from django.contrib.auth.models import User, Group, Permission
from rest_framework import viewsets , permissions, status
from rest_framework.decorators import api_view, permission_classes
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