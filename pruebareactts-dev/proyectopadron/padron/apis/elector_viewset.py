from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from padron.models import Elector, Recinto


# SERIALIZER
class ElectorSerializer(serializers.ModelSerializer):
    recinto = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Elector
        fields = [
            'id', 'uuid', 'ci', 'nombre_completo', 'direccion',
            'foto_ci_anverso', 'foto_ci_reverso', 'foto_votante', 'recinto'
        ]
        read_only_fields = ['uuid', 'recinto']


# VIEWSET PRINCIPAL
class ElectorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ElectorSerializer
    queryset = Elector.objects.all()

    def perform_create(self, serializer):
        recinto_id = self.request.data.get('recinto_id')
        if recinto_id:
            try:
                recinto = Recinto.objects.get(id=recinto_id)
            except Recinto.DoesNotExist:
                raise serializers.ValidationError({'error': 'Recinto no encontrado'})
            serializer.save(recinto=recinto)
        else:
            serializer.save()

    @action(detail=True, methods=['post'], url_path='asignar-a-recinto')
    def asignar_a_recinto(self, request, pk=None):
        elector = self.get_object()
        recinto_id = request.data.get('recinto_id')
        if not recinto_id:
            return Response({'error': 'recinto_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            recinto = Recinto.objects.get(id=recinto_id)
        except Recinto.DoesNotExist:
            return Response({'error': 'Recinto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        elector.recinto = recinto
        elector.save()
        return Response(self.get_serializer(elector).data)
