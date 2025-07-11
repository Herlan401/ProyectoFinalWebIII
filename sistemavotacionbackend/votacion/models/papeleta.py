from django.db import models

from . import Elector
from .eleccion import Eleccion

class Papeleta(models.Model):
    elector = models.ForeignKey(Elector, on_delete=models.CASCADE)
    eleccion = models.ForeignKey(Eleccion, on_delete=models.CASCADE)
    habilitada = models.BooleanField(default=False)
    usada = models.BooleanField(default=False)

    mesa_id = models.IntegerField(default=0)

    def __str__(self):
        return f"Papeleta Elección: {self.eleccion.nombre} - Habilitada: {self.habilitada}"
