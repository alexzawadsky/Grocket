from typing import Optional

from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.db.models import Count, Q
from django.db.models.query import QuerySet
from django.shortcuts import get_object_or_404

from .models import Chat, Message

User = get_user_model()


def get_messages_by_chat(user_id: int, chat_id: int, **fields) -> QuerySet[Message]:
    user = User.objects.get(id=user_id)
    chat = get_object_or_404(Chat, id=chat_id)
    if chat.user_from != user and chat.user_to != user:
        raise PermissionDenied()
    query = Q(chat__user_from=user) | Q(chat__user_to=user)
    return Message.objects.filter(query, chat=chat, **fields)


def get_my_chats(user_id: int, **fields) -> QuerySet[Chat]:
    """
    Отдаст все чаты в которые входит user и в которых есть хотябы одно сообщение
    вне зависимости от того user_from или user_to.
    """
    user = User.objects.get(id=user_id)
    query = Q(user_from=user) | Q(user_to=user)
    annotated_chats = Chat.objects.annotate(message_count=Count("messages"))
    return annotated_chats.filter(query, message_count__gt=0, **fields)


def get_answer_to_message_or_none(message_id: int) -> Optional[Message]:
    message = Message.objects.get(id=message_id)
    return message.answer_to


def get_unseen_messages_count_by_chat(chat_id: int, user_id: int, **fields) -> int:
    """Отдаст кол-во сообщений в данном чате написанных не от запрашивающего юзера и не прочитанных."""
    return (
        Message.objects.filter(chat__id=chat_id, is_seen=False, **fields)
        .exclude(author__id=user_id)
        .count()
    )
