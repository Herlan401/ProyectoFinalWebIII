import requests
from rest_framework import serializers, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from votacion.models.papeleta import Papeleta
from votacion.models.elector import Elector
from votacion.models.eleccion import Eleccion

# 🔄 WebSocket
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


# SERIALIZER
class PapeletaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Papeleta
        fields = ['id', 'elector', 'eleccion', 'mesa', 'habilitada', 'usada', 'fecha_creacion']


# VIEWSET
class PapeletaViewSet(viewsets.ModelViewSet):
    serializer_class = PapeletaSerializer
    queryset = Papeleta.objects.all()

    @action(detail=False, methods=['post'], url_path='generar')
    def generar_papeleta(self, request):
        ci = request.data.get('ci')
        eleccion_id = request.data.get('eleccion_id')
        mesa_id = request.data.get('mesa_id')

        if not all([ci, eleccion_id, mesa_id]):
            return Response({'error': 'Faltan campos requeridos (ci, eleccion_id, mesa_id)'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Consulta externa al backend del padrón
        try:
            response = requests.get(f'http://localhost:8000/padron/verificar/{ci}/')
            if response.status_code != 200:
                return Response({'error': 'Elector no encontrado en padrón'}, status=status.HTTP_404_NOT_FOUND)

            data = response.json()
        except requests.RequestException:
            return Response({'error': 'No se pudo conectar al backend del padrón'},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Verificamos si ya existe localmente
        elector, created = Elector.objects.get_or_create(
            ci=data['ci'],
            defaults={
                'nombre_completo': data['nombre_completo'],
                'direccion': data.get('direccion', '')
            }
        )

        try:
            eleccion = Eleccion.objects.get(id=eleccion_id)
        except Eleccion.DoesNotExist:
            return Response({'error': 'Elección no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        papeleta = Papeleta.objects.create(
            elector=elector,
            eleccion=eleccion,
            mesa_id=mesa_id,
            habilitada=True,
            usada=False
        )

        return Response({
            'mensaje': 'Papeleta generada correctamente',
            'papeleta': {
                'id': papeleta.id,
                'elector': papeleta.elector.id,
                'eleccion': papeleta.eleccion.id,
                'habilitada': papeleta.habilitada,
                'usada': papeleta.usada,
            }
        }, status=status.HTTP_201_CREATED)