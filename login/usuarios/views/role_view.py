from rest_framework import generics
from usuarios.models.rol import Role
from usuarios.serializers.user_serializer import RoleSerializer
from usuarios.permissions import IsSuperAdmin

class RoleListView(generics.ListAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsSuperAdmin]
