from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from padron.models import Elector


# SERIALIZER
class VerificacionElectorSerializer(serializers.ModelSerializer):
    recinto = serializers.SerializerMethodField()

    class Meta:
        model = Elector
        fields = ['uuid', 'ci', 'nombre_completo','direccion', 'recinto']

    def get_recinto(self, obj):
        if obj.recinto:
            return {
                'nombre': obj.recinto.nombre,
                'latitud': obj.recinto.latitud,
                'longitud': obj.recinto.longitud
            }
        return None


# VISTA PÚBLICA
@api_view(['GET'])
@permission_classes([AllowAny])
def verificar_padron(request, ci):
    try:
        elector = Elector.objects.get(ci=ci)
        serializer = VerificacionElectorSerializer(elector)
        return Response(serializer.data)
    except Elector.DoesNotExist:
        return Response({"error": "Elector no encontrado"}, status=status.HTTP_404_NOT_FOUND)
