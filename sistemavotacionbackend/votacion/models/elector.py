from django.db import models

class Elector(models.Model):
    ci = models.CharField(max_length=20, unique=True)
    nombre_completo = models.CharField(max_length=255)
    direccion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.ci} - {self.nombre_completo}"
