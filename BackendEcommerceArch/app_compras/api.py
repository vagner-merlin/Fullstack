from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Proveedor, compra
from .serializers import ProveedorSerializer, CompraSerializer

class ProveedorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar proveedores
    Permite operaciones CRUD completas
    """
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        """Listar todos los proveedores"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'count': queryset.count(),
            'proveedores': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """Crear un nuevo proveedor"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            proveedor = serializer.save()
            return Response({
                'success': True,
                'message': 'Proveedor creado exitosamente',
                'proveedor': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Datos inválidos',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        """Obtener un proveedor específico"""
        proveedor = self.get_object()
        serializer = self.get_serializer(proveedor)
        return Response({
            'success': True,
            'proveedor': serializer.data
        })
    
    def update(self, request, *args, **kwargs):
        """Actualizar un proveedor completamente"""
        proveedor = self.get_object()
        serializer = self.get_serializer(proveedor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Proveedor actualizado exitosamente',
                'proveedor': serializer.data
            })
        
        return Response({
            'success': False,
            'message': 'Datos inválidos',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Eliminar un proveedor"""
        proveedor = self.get_object()
        proveedor.delete()
        return Response({
            'success': True,
            'message': 'Proveedor eliminado exitosamente'
        }, status=status.HTTP_204_NO_CONTENT)

class CompraViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar compras
    Permite operaciones CRUD completas
    """
    queryset = compra.objects.all()
    serializer_class = CompraSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        """Listar todas las compras"""
        queryset = self.get_queryset().order_by('-fecha_compra')  # Más recientes primero
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'count': queryset.count(),
            'compras': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """Crear una nueva compra"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            nueva_compra = serializer.save()
            return Response({
                'success': True,
                'message': 'Compra registrada exitosamente',
                'compra': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Datos inválidos',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        """Obtener una compra específica"""
        compra_obj = self.get_object()
        serializer = self.get_serializer(compra_obj)
        return Response({
            'success': True,
            'compra': serializer.data
        })
    
    def update(self, request, *args, **kwargs):
        """Actualizar una compra"""
        compra_obj = self.get_object()
        serializer = self.get_serializer(compra_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Compra actualizada exitosamente',
                'compra': serializer.data
            })
        
        return Response({
            'success': False,
            'message': 'Datos inválidos',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Eliminar una compra"""
        compra_obj = self.get_object()
        compra_obj.delete()
        return Response({
            'success': True,
            'message': 'Compra eliminada exitosamente'
        }, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def por_estado(self, request):
        """Filtrar compras por estado"""
        estado = request.query_params.get('estado', 'confirmado')
        compras_filtradas = self.queryset.filter(estado=estado)
        serializer = self.get_serializer(compras_filtradas, many=True)
        return Response({
            'success': True,
            'estado': estado,
            'count': compras_filtradas.count(),
            'compras': serializer.data
        })