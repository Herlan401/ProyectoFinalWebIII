# sistemavotacionbackend/routing.py
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import votacion.routing

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(
            votacion.routing.websocket_urlpatterns
        )
    ),
})
