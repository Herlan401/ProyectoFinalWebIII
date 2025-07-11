from django.db import models

class Recinto(models.Model):
    nombre = models.CharField(max_length=255)
    direccion = models.TextField()
    latitud = models.DecimalField(max_digits=9, decimal_places=6)
    longitud = models.DecimalField(max_digits=9, decimal_places=6)

    def __str__(self):
        return self.nombre
