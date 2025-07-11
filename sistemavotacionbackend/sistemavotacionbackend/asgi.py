import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import votacion.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistemavotacionbackend.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            votacion.routing.websocket_urlpatterns
        )
    ),
})
