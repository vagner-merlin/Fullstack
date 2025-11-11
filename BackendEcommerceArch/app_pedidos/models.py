from django.db import models
from app_Cliente.models import Cliente , Direccion_Envio
# Create your models here.

class Pedido(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    direccion_envio = models.ForeignKey(Direccion_Envio, on_delete=models.CASCADE)
    fecha_pedido = models.DateField(auto_now_add=True)
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=50)
    
