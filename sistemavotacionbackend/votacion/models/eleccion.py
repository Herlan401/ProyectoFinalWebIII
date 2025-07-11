from django.db import models

class Eleccion(models.Model):
    id_remoto = models.IntegerField(unique=True)  # ID del sistema .NET
    nombre = models.CharField(max_length=255)
    fecha = models.DateField()

    def __str__(self):
        return self.nombre
