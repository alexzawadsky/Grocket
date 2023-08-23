from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from .selectors import get_messages_by_chat, get_my_chats
from .services import ChatService, CreateChatService

from .mixins import ChatMixin, MessageMixin


class MessageViewSet(MessageMixin):
    def list(self, request, pk):
        user_id = self.request.user.id
        messages = get_messages_by_chat(user_id=user_id, chat_id=pk)
        return super().list(request, messages)

    def create(self, request, pk):
        pass

    def destroy(self, request, pk):
        pass


class ChatViewSet(ChatMixin):
    pagination_class = None

    def destroy(self, request, pk):
        user_id = self.request.user.id
        service = ChatService(chat_id=pk)
        service.delete(user_id=user_id)
        return Response(status=status.HTTP_200_OK)

    @action(["get"], detail=False)
    def get_my_chats(self, request):
        user_id = self.request.user.id
        chats = get_my_chats(user_id=user_id)
        return self.list(request, queryset=chats, status=status.HTTP_200_OK)

    @action(["get"], detail=False)
    def get_chat_by_product(self, request, pk):
        user_id = self.request.user.id
        chat_id = CreateChatService().get_or_create_by_product(
            product_id=pk, user_id=user_id
        )
        return Response({"id": chat_id}, status=status.HTTP_200_OK)
