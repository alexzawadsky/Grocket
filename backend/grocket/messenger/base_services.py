from django.shortcuts import get_object_or_404

from .models import Chat, Message


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
