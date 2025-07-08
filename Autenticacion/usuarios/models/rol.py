from django.db import models

class Role(models.Model):
    ROLE_CHOICES = [
        ('super_admin', 'Super Administrador'),
        ('admin_padron', 'Administrador del Padrón'),
        ('admin_elecciones', 'Administrador de Elecciones'),
        ('jurado', 'Jurado Electoral'),
    ]
    name = models.CharField(max_length=30, choices=ROLE_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()
