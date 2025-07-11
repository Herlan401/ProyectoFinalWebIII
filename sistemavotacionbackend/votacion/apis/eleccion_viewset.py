from rest_framework import serializers, viewsets
from votacion.models.eleccion import Eleccion


# SERIALIZER
class EleccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Eleccion
        fields = ['id', 'id_remoto', 'nombre', 'fecha']


# VIEWSET
class EleccionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EleccionSerializer
    queryset = Eleccion.objects.all()
