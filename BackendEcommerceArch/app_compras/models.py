from django.db import models

# Create your models here.

ENUM_CHOICES = [
    ('confirmado', 'confirmado'),
    ('cancelado', 'cancelado'),
]
class Proveedor(models.Model):
    nombre = models.CharField(max_length=100)
    nombre_contacto = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    email = models.EmailField()
    direccion = models.CharField(max_length=200)

class compra(models.Model):
    fecha_compra = models.DateField(auto_now_add=True)
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=50, choices=ENUM_CHOICES, default='confirmado')

