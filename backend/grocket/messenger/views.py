from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from .chat_services import ChatService, CreateChatService
from .message_services import MessageCreateService, MessageService
from .mixins import ChatMixin, MessageMixin
from .selectors import get_messages_by_chat, get_my_chats


class MessageViewSet(MessageMixin):
    def list(self, request, pk):
        user_id = self.request.user.id
        messages = get_messages_by_chat(user_id=user_id, chat_id=pk)
        return super().list(request, messages)

    def create(self, request, pk):
        user_id = self.request.user.id
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = MessageCreateService()
        service.create(
            request=request, user_id=user_id, chat_id=pk, **serializer.validated_data
        )
        return Response(status=status.HTTP_201_CREATED)

    def destroy(self, request, pk):
        user_id = self.request.user.id
        service = MessageService(message_id=pk)
        service.delete(user_id=user_id)
        return Response(status=status.HTTP_200_OK)


class ChatViewSet(ChatMixin):
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
            product_id=pk, user_id=user_id, request=request
        )
        return Response({"id": chat_id}, status=status.HTTP_200_OK)
