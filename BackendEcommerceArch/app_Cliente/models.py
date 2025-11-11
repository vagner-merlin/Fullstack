from django.db import models
from django.contrib.auth.models import User

ENUM_CHOICES = [
    ('tarjeta_credito', 'tarjeta_credito'),
    ('qr', 'qr'),
    ('efectivo', 'efectivo'),
]

# Create your models here.
class Cliente(models.Model):
    telefono = models.CharField(max_length=15)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_nacimiento = models.DateField()
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)



class Metodo_Pago(models.Model):
    forma_pago = models.CharField(max_length=50, choices=ENUM_CHOICES, default='efectivo')
    detalles_pago = models.CharField(max_length=200 , null=True, blank=True)
    Cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE , null=True)


class Direccion_Envio(models.Model):
    calle = models.CharField(max_length=100)
    ciudad = models.CharField(max_length=50)
    estado = models.CharField(max_length=50)
    codigo_postal = models.CharField(max_length=10)
    Pais = models.CharField(max_length=50)
    Cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE , null=True)


