from rest_framework import serializers, viewsets
from votacion.models.candidato import Candidato


# SERIALIZER
class CandidatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidato
        fields = ['id', 'id_remoto', 'nombre', 'partido', 'cargo']


# VIEWSET
class CandidatoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CandidatoSerializer
    queryset = Candidato.objects.all()
