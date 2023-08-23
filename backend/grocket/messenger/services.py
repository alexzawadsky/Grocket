from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from products.models import Product

from django.shortcuts import get_object_or_404

from .models import Chat, Message

User = get_user_model()


class BaseMessageService:
    def __init__(self, message_id: int) -> None:
        self.message_id: int = message_id
        self.message: Message = self._get_message_or_404(message_id=message_id)

    def _get_message_or_404(self, message_id: int) -> Message:
        return get_object_or_404(Message, id=message_id)


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

    def get_or_create_by_product(self, product_id: int, user_id: int, **fields):
        """Вернет чат с таким же user_to, user_from и товаром или создаст если нет."""
        product = get_object_or_404(Product, id=product_id)
        user_from = User.objects.get(id=user_id)
        user_to = product.user

        self._check_creation_logic(
            product_id=product_id, user_from_id=user_from.id, user_to_id=user_to.id
        )

        chat_id = Chat.objects.get_or_create(
            user_from=user_from, user_to=user_to, product=product, **fields
        )[0].id
        return chat_id
