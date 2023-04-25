from rest_framework import permissions
from rest_framework.mixins import CreateModelMixin, DestroyModelMixin

from ..mixins import BaseMixin
from .paginators import CommentPageLimitPagination
from .serializers import (
    CommentCreateSerializer,
    CommentReadOnlySerializer,
    CommentReplyCreateSerializer,
    StatusSerializer,
)


class CommentMixin(CreateModelMixin, DestroyModelMixin, BaseMixin):
    pagination_class = CommentPageLimitPagination

    def get_permissions(self):
        if self.action in (
            "user_comments",
            "statuses",
        ):
            self.permission_classes = (permissions.AllowAny,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in (
            "user_comments",
            "me_comments",
        ):
            return CommentReadOnlySerializer
        elif self.action in ("create",):
            return CommentCreateSerializer
        elif self.action in ("reply",):
            return CommentReplyCreateSerializer
        elif self.action in ("statuses",):
            return StatusSerializer

    def _get_response_message(self, method=None):
        return super()._get_response_message(app="comments", method=method)
