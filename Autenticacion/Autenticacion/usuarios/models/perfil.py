from django.db import models
from django.contrib.auth.models import User
from usuarios.models.rol import Role

class PerfilUsuario(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.usuario.username} - {self.role.name}"
