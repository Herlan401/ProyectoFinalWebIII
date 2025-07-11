from django.db import models

class Candidato(models.Model):
    id_remoto = models.IntegerField(unique=True)  # ID del sistema .NET
    nombre = models.CharField(max_length=255)
    partido = models.CharField(max_length=255)
    cargo = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.nombre} - {self.partido}"
