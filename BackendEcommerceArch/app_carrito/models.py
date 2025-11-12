from django.db import models
from app_Cliente.models import Cliente
from app_productos.models import ProductoCategoria
# Create your models here.


class Carrito(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)

class ItemCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, related_name='items', on_delete=models.CASCADE)
    producto_variante = models.ForeignKey(ProductoCategoria, on_delete=models.CASCADE , null=True, blank=True)
    cantidad = models.PositiveIntegerField(default=1)

