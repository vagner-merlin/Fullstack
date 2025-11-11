from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Pedido
from .serializers import PedidoSerializer, PedidoCreateSerializer
from app_Cliente.models import Cliente

class PedidoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar pedidos
    Permite operaciones CRUD completas
    """
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        """Usar diferentes serializers según la acción"""
        if self.action in ['create', 'update', 'partial_update']:
            return PedidoCreateSerializer
        return PedidoSerializer
    
    def get_queryset(self):
        """Filtrar pedidos según parámetros opcionales"""
        queryset = Pedido.objects.select_related('cliente', 'direccion_envio').order_by('-fecha_pedido')
        
        # Filtro por cliente si se proporciona
        cliente_id = self.request.query_params.get('cliente', None)
        if cliente_id:
            queryset = queryset.filter(cliente_id=cliente_id)
        
        # Filtro por estado si se proporciona
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado__icontains=estado)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        """Listar todos los pedidos con información completa"""
        queryset = self.get_queryset()
        serializer = PedidoSerializer(queryset, many=True)
        
        return Response({
            'success': True,
            'count': queryset.count(),
            'pedidos': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """Crear un nuevo pedido"""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            pedido = serializer.save()
            
            # Usar el serializer completo para la respuesta
            response_serializer = PedidoSerializer(pedido)
            
            return Response({
                'success': True,
                'message': 'Pedido creado exitosamente',
                'pedido': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Datos inválidos',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        """Obtener un pedido específico"""
        pedido = self.get_object()
        serializer = PedidoSerializer(pedido)
        
        return Response({
            'success': True,
            'pedido': serializer.data
        })
    
    def update(self, request, *args, **kwargs):
        """Actualizar un pedido completamente"""
        pedido = self.get_object()
        serializer = self.get_serializer(pedido, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            
            # Usar el serializer completo para la respuesta
            response_serializer = PedidoSerializer(pedido)
            
            return Response({
                'success': True,
                'message': 'Pedido actualizado exitosamente',
                'pedido': response_serializer.data
            })
        
        return Response({
            'success': False,
            'message': 'Datos inválidos',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, *args, **kwargs):
        """Actualización parcial de un pedido (PATCH)"""
        pedido = self.get_object()
        serializer = self.get_serializer(pedido, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            # Usar el serializer completo para la respuesta
            response_serializer = PedidoSerializer(pedido)
            
            return Response({
                'success': True,
                'message': 'Pedido actualizado exitosamente',
                'pedido': response_serializer.data
            })
        
        return Response({
            'success': False,
            'message': 'Datos inválidos',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Eliminar un pedido"""
        pedido = self.get_object()
        pedido.delete()
        
        return Response({
            'success': True,
            'message': 'Pedido eliminado exitosamente'
        }, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def por_estado(self, request):
        """Filtrar pedidos por estado específico"""
        estado = request.query_params.get('estado', 'pendiente')
        pedidos_filtrados = self.queryset.filter(estado__icontains=estado).order_by('-fecha_pedido')
        
        serializer = PedidoSerializer(pedidos_filtrados, many=True)
        
        return Response({
            'success': True,
            'estado': estado,
            'count': pedidos_filtrados.count(),
            'pedidos': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def por_cliente(self, request):
        """Obtener pedidos de un cliente específico"""
        cliente_id = request.query_params.get('cliente_id')
        
        if not cliente_id:
            return Response({
                'success': False,
                'message': 'cliente_id es requerido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cliente = Cliente.objects.get(id=cliente_id)
            pedidos_cliente = self.queryset.filter(cliente=cliente).order_by('-fecha_pedido')
            
            serializer = PedidoSerializer(pedidos_cliente, many=True)
            
            return Response({
                'success': True,
                'cliente': {
                    'id': cliente.id,
                    'telefono': cliente.telefono,
                    'fecha_creacion': cliente.fecha_creacion
                },
                'count': pedidos_cliente.count(),
                'pedidos': serializer.data
            })
            
        except Cliente.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Cliente no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['patch'])
    def cambiar_estado(self, request, pk=None):
        """Cambiar solo el estado de un pedido"""
        pedido = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        if not nuevo_estado:
            return Response({
                'success': False,
                'message': 'El campo estado es requerido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar estado
        estados_permitidos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']
        if nuevo_estado.lower() not in estados_permitidos:
            return Response({
                'success': False,
                'message': f'Estado no válido. Estados permitidos: {", ".join(estados_permitidos)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        pedido.estado = nuevo_estado.lower()
        pedido.save()
        
        serializer = PedidoSerializer(pedido)
        
        return Response({
            'success': True,
            'message': f'Estado cambiado a "{nuevo_estado}"',
            'pedido': serializer.data
        })
