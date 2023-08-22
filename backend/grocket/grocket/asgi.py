import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from messenger.routing import websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "grocket.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(websocket_urlpatterns)
})
