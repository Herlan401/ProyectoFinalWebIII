from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated

from votacion.models.voto import Voto
from votacion.models.papeleta import Papeleta
from votacion.models.candidato import Candidato


# SERIALIZER
class VotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voto
        fields = ['id', 'papeleta', 'candidato', 'fecha']


# VIEWSET
class VotoViewSet(viewsets.ModelViewSet):
    serializer_class = VotoSerializer
    queryset = Voto.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        papeleta = serializer.validated_data.get('papeleta')
        if papeleta.usada:
            raise serializers.ValidationError("Esta papeleta ya fue usada.")
        papeleta.usada = True
        papeleta.save()
        serializer.save()
