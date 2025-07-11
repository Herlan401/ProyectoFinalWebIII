import uuid

from django.db import models

from padron.models.recinto import Recinto


class Elector(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    ci = models.CharField(max_length=20, unique=True)
    nombre_completo = models.CharField(max_length=255)
    direccion = models.TextField()
    foto_ci_anverso = models.ImageField(upload_to='cis/anverso/')
    foto_ci_reverso = models.ImageField(upload_to='cis/reverso/')
    foto_votante = models.ImageField(upload_to='votantes/')
    recinto = models.ForeignKey(Recinto, on_delete=models.SET_NULL, null=True)
    #prueba
    def __str__(self):
        return f"{self.nombre_completo} ({self.ci})"
