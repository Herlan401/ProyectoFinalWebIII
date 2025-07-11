from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
import requests

# SERIALIZER
class ElectorSerializer(serializers.Serializer):
    ci = serializers.CharField()
    nombre_completo = serializers.CharField()
    direccion = serializers.CharField(allow_null=True, required=False)

# VIEWSET
class ElectorViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        ci = request.query_params.get('search')  # aquí va "search" porque estás usando `?search=...`
        if not ci:
            return Response({"error": "Debe proporcionar un CI en el parámetro 'search'."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Cambia la URL si es necesario
            url = f"http://localhost:8000/padron/verificar/{ci}/"
            response = requests.get(url)

            if response.status_code == 200:
                return Response(response.json(), status=200)
            else:
                return Response({"error": "Elector no encontrado en padrón."}, status=response.status_code)
        except Exception as e:
            return Response({"error": f"Error al conectar con padrón: {str(e)}"}, status=500)