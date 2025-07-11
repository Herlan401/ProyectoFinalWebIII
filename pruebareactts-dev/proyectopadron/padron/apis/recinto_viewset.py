from rest_framework import serializers, viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from padron.models import Recinto


# SERIALIZER
class RecintoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recinto
        fields = ['id', 'nombre', 'direccion', 'latitud', 'longitud']


# VIEWSET PRINCIPAL
class RecintoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RecintoSerializer
    queryset = Recinto.objects.all()
