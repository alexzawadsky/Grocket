from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from products.models import Product

from .models import Chat
from .notifications import send_notification
from .serializers import ChatListSerializer

User = get_user_model()


def send_to_websocket(
    request, chat: Chat, users_ids: tuple, action: str = "chats__new"
) -> None:
    context = {"request": request}
    data = ChatListSerializer(context=context, instance=chat, read_only=True).data
    for id in users_ids:
        async_to_sync(send_notification)(
            user_id=id, notification_data=data, action=action
        )


class BaseChatService:
    def __init__(self, chat_id: int) -> None:
        self.chat_id: int = chat_id
        self.chat: Chat = self._get_chat_or_404(chat_id=chat_id)

    def _get_chat_or_404(self, chat_id: int) -> Chat:
        return get_object_or_404(Chat, id=chat_id)


class ChatService(BaseChatService):
    def delete(self, user_id: int) -> None:
        chat = self.chat
        user = get_object_or_404(User, id=user_id)
        if chat.user_from != user and chat.user_to != user:
            raise PermissionDenied()
        chat.delete()

        for id in (chat.user_from.id, chat.user_to.id):
            async_to_sync(send_notification)(
                user_id=id, notification_data={"id": chat.id}, action="chats__delete"
            )


class CreateChatService:
    def _check_creation_logic(
        self, product_id: int, user_from_id: int, user_to_id: int
    ) -> None:
        """
        Проверит что товар доступен для покупки (не продан, не архивирован, существует)
        и юзеры не одинаковые.
        """
        product = get_object_or_404(Product, id=product_id)
        if product.is_sold or product.is_archived or user_from_id == user_to_id:
            raise PermissionDenied()

    def get_or_create_by_product(
        self, product_id: int, user_id: int, request, **fields
    ) -> int:
        """Вернет чат с таким же user_to, user_from и товаром или создаст если нет."""
        product = get_object_or_404(Product, id=product_id)
        user_from = User.objects.get(id=user_id)
        user_to = product.user

        self._check_creation_logic(
            product_id=product_id, user_from_id=user_from.id, user_to_id=user_to.id
        )

        chat = Chat.objects.get_or_create(
            user_from=user_from, user_to=user_to, product=product, **fields
        )[0]

        send_to_websocket(request=request, chat=chat, users_ids=(chat.user_from.id,))

        return chat.id
