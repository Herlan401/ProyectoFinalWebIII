from rest_framework import serializers, viewsets
from votacion.models.jurado import Jurado


# SERIALIZER
class JuradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jurado
        fields = ['id', 'usuario', 'mesa_id']


# VIEWSET
class JuradoViewSet(viewsets.ModelViewSet):
    serializer_class = JuradoSerializer
    queryset = Jurado.objects.all()
