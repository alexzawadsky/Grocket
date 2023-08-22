from rest_framework import permissions
from rest_framework.mixins import DestroyModelMixin

from ..mixins import BaseMixin
from ..paginators import PageLimitPagination
from .serializers import ChatListSerializer, MessageListSerializer


class ChatMixin(DestroyModelMixin, BaseMixin):
    def get_permissions(self):
        if self.action in ("destroy", "get_my_chats", "get_chat_by_product"):
            self.permission_classes = (permissions.IsAuthenticated,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ("get_my_chats",):
            return ChatListSerializer


class MessageMixin(DestroyModelMixin, BaseMixin):
    pagination_class = PageLimitPagination

    def get_permissions(self):
        if self.action in ("list", "create", "destroy"):
            self.permission_classes = (permissions.IsAuthenticated,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ("list",):
            return MessageListSerializer
