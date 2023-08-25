from typing import Optional

from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from .models import Chat, Message
from .notifications import send_notification
from .serializers import MessageListSerializer

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

    def _send_to_socket(self, message: Message, chat: Chat) -> None:
        """Отправит на вебсокет обоим юзерам состоящим в чате полную информацию о новом сообщении."""
        data = MessageListSerializer(instance=message, read_only=True).data
        for id in (chat.user_from.id, chat.user_to.id):
            async_to_sync(send_notification)(
                user_id=id,
                notification_data=data,
                action="messages__new",
            )

    def create(self, user_id: int, chat_id: int, **fields) -> None:
        self._check_creation_logic(
            user_id=user_id, chat_id=chat_id, answer_to=fields["answer_to"]
        )

        user = User.objects.get(id=user_id)
        chat = Chat.objects.get(id=chat_id)

        answer_to = fields["answer_to"]
        if answer_to is not None:
            answer_to = Message.objects.get(id=fields["answer_to"])

        fields = self._clear_fields(fields=fields)

        message = Message.objects.create(
            author=user,
            chat=chat,
            is_edited=False,
            is_seen=False,
            answer_to=answer_to,
            **fields
        )

        self._send_to_socket(message=message, chat=chat)
