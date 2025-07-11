from django.db import models
from .papeleta import Papeleta
from .candidato import Candidato

class Voto(models.Model):
    papeleta = models.OneToOneField(Papeleta, on_delete=models.CASCADE)
    candidato = models.ForeignKey(Candidato, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Voto para {self.candidato.nombre} - {self.fecha}"
