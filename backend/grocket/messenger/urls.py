from django.urls import path

from .views import ChatViewSet, MessageViewSet

app_name = "messenger"


urlpatterns = [
    path(
        "chats/<int:pk>/messages/",
        MessageViewSet.as_view({"get": "list", "post": "create"}),
        name="messages",
    ),
    path(
        "messages/<int:pk>/",
        MessageViewSet.as_view({"delete": "destroy"}),
        name="message",
    ),
    path(
        "users/me/chats/",
        ChatViewSet.as_view({"get": "get_my_chats"}),
        name="get_my_chats",
    ),
    path(
        "products/<int:pk>/chat/",
        ChatViewSet.as_view({"get": "get_chat_by_product"}),
        name="get_chat_by_product",
    ),
    path(
        "chats/<int:pk>/",
        ChatViewSet.as_view({"delete": "destroy"}),
        name="get_my_chats",
    ),
]
