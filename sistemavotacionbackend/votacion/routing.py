from django.urls import re_path
from votacion import consumers

websocket_urlpatterns = [
    re_path(r'ws/mesa/(?P<mesa_id>\w+)/$', consumers.MesaConsumer.as_asgi()),
]
