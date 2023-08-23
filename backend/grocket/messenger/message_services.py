from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from typing import Optional
from .models import Chat, Message

User = get_user_model()


class BaseMessageService:
    def __init__(self, message_id: int) -> None:
        self.message_id: int = message_id
        self.message: Message = self._get_message_or_404(message_id=message_id)

    def _get_message_or_404(self, message_id: int) -> Message:
        return get_object_or_404(Message, id=message_id)


class MessageService(BaseMessageService):
    def delete(self, user_id: int) -> None:
        message = self.message
        if message.author.id != user_id:
            raise PermissionDenied()
        message.delete()


class MessageCreateService:
    def _check_creation_logic(
        self, user_id: int, chat_id: int, answer_to: Optional[int]
    ) -> None:
        """Нельзя создать если этот юзер не находится в этом чате
        или чата не существует
        или сообения для ответа не существует
        """
        if answer_to is not None:
            get_object_or_404(Message, id=answer_to)
        chat = get_object_or_404(Chat, id=chat_id)
        if chat.user_from.id != user_id and chat.user_to.id != user_id:
            raise PermissionDenied()

    def _clear_fields(self, fields: dict) -> dict:
        """Почистит от дублирующихся полей."""
        fields_to_remove = ("author", "chat", "is_edited", "is_seen", "answer_to")

        for field in fields_to_remove:
            fields.pop(field, None)

        return fields

    def create(self, user_id: int, chat_id: int, **fields) -> None:
        self._check_creation_logic(
            user_id=user_id, chat_id=chat_id, answer_to=fields["answer_to"]
        )

        user = User.objects.get(id=user_id)
        chat = Chat.objects.get(id=chat_id)

        if fields["answer_to"] is not None:
            answer_to = Message.objects.get(id=fields["answer_to"])
        else:
            answer_to = None

        fields = self._clear_fields(fields=fields)

        Message.objects.create(
            author=user,
            chat=chat,
            is_edited=False,
            is_seen=False,
            answer_to=answer_to,
            **fields
        )
