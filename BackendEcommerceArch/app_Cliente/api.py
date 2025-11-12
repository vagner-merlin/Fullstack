from .serializers import (
    ClienteSerializer, ClienteDetailSerializer, 
    Metodo_PagoSerializer, Direccion_EnvioSerializer,
    UserDetailSerializer
)
from .models import Cliente, Metodo_Pago, Direccion_Envio
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User


class ClienteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar clientes con sus usuarios
    """
    queryset = Cliente.objects.select_related('usuario').all()
    serializer_class = ClienteDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        """Usar serializer detallado para listar y retrieve"""
        if self.action in ['list', 'retrieve']:
            return ClienteDetailSerializer
        return ClienteSerializer
    
    def list(self, request, *args, **kwargs):
        """Listar todos los clientes con información de usuario"""
        queryset = self.get_queryset().order_by('-fecha_creacion')
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'success': True,
            'count': queryset.count(),
            'clientes': serializer.data
        })
    
    def retrieve(self, request, *args, **kwargs):
        """Obtener un cliente específico"""
        cliente = self.get_object()
        serializer = self.get_serializer(cliente)
        
        return Response({
            'success': True,
            'cliente': serializer.data
        })
    
    @action(detail=True, methods=['patch'])
    def toggle_active(self, request, pk=None):
        """
        Activar/Desactivar usuario del cliente
        Cambia el is_active del usuario asociado
        """
        try:
            cliente = self.get_object()
            usuario = cliente.usuario
            
            # Toggle is_active
            usuario.is_active = not usuario.is_active
            usuario.save()
            
            # Serializar respuesta
            serializer = self.get_serializer(cliente)
            
            return Response({
                'success': True,
                'message': f"Usuario {'activado' if usuario.is_active else 'desactivado'} correctamente",
                'cliente': serializer.data,
                'is_active': usuario.is_active
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Error al cambiar estado del usuario',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['patch'])
    def set_active(self, request, pk=None):
        """
        Establecer estado activo del usuario
        Body: { "is_active": true/false }
        """
        try:
            cliente = self.get_object()
            usuario = cliente.usuario
            
            is_active = request.data.get('is_active')
            
            if is_active is None:
                return Response({
                    'success': False,
                    'message': 'Se requiere el parámetro is_active'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            usuario.is_active = bool(is_active)
            usuario.save()
            
            serializer = self.get_serializer(cliente)
            
            return Response({
                'success': True,
                'message': f"Usuario {'activado' if usuario.is_active else 'desactivado'} correctamente",
                'cliente': serializer.data
            })
            
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Error al cambiar estado del usuario',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def destroy(self, request, *args, **kwargs):
        """
        Eliminar cliente y su usuario asociado (cascada)
        Al eliminar el usuario, se elimina el cliente por OneToOne cascade
        """
        try:
            cliente = self.get_object()
            usuario = cliente.usuario
            username = usuario.username
            email = usuario.email
            
            # Eliminar usuario (esto elimina el cliente en cascada)
            usuario.delete()
            
            return Response({
                'success': True,
                'message': f'Cliente y usuario eliminados correctamente',
                'deleted_user': {
                    'username': username,
                    'email': email
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Error al eliminar cliente',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def activos(self, request):
        """Obtener solo clientes con usuarios activos"""
        clientes_activos = self.queryset.filter(usuario__is_active=True)
        serializer = self.get_serializer(clientes_activos, many=True)
        
        return Response({
            'success': True,
            'count': clientes_activos.count(),
            'clientes': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def inactivos(self, request):
        """Obtener solo clientes con usuarios inactivos"""
        clientes_inactivos = self.queryset.filter(usuario__is_active=False)
        serializer = self.get_serializer(clientes_inactivos, many=True)
        
        return Response({
            'success': True,
            'count': clientes_inactivos.count(),
            'clientes': serializer.data
        })


class Metodo_PagoViewSet(viewsets.ModelViewSet):
    queryset = Metodo_Pago.objects.all()
    serializer_class = Metodo_PagoSerializer
    permission_classes = [permissions.IsAuthenticated]


class Direccion_EnvioViewSet(viewsets.ModelViewSet):
    queryset = Direccion_Envio.objects.all()
    serializer_class = Direccion_EnvioSerializer
    permission_classes = [permissions.IsAuthenticated]


