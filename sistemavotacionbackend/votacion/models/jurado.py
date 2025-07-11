from django.db import models

class Jurado(models.Model):
    usuario = models.CharField(max_length=255)  # puede ser ForeignKey a usuario si existiera
    mesa_id = models.IntegerField()  # ID referencia desde .NET

    def __str__(self):
        return f"Jurado {self.usuario} en mesa {self.mesa_id}"
