from rest_framework import generics
from django.contrib.auth.models import User
from usuarios.serializers.user_serializer import UserSerializer
from usuarios.permissions import IsSuperAdmin

class UsuarioListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSuperAdmin]

class UsuarioRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSuperAdmin]