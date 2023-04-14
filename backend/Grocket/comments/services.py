from django.core.exceptions import PermissionDenied, ValidationError
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _

from comments.models import Comment, CommentImage, CommentReply, Status
from images.services import ImageService
from users.services import UserService

images_services = ImageService()
users_services = UserService()


class CommentService:
    """Сервисы для работы с комментариями."""

    error_messages = {
        "reply_create_required_fields_not_in_input_data": (
            _("Unable to reply to comment: Invalid input data.")
        ),
        "comment_create_required_fields_not_in_input_data": (
            _("Unable to create comment: Invalid input data.")
        ),
        "comment_image_create_required_fields_not_in_input_data": (
            _("Unable to create comment image: Invalid input data.")
        ),
    }

    # STATUSES
    def get_statuses(self, **kwargs) -> QuerySet[Status]:
        return Status.objects.filter(**kwargs)

    def get_status_or_404(self, **kwargs) -> Status:
        return get_object_or_404(Status, **kwargs)

    # COMMENTS
    def get_comment_or_404(self, **kwargs) -> Comment:
        return get_object_or_404(Comment, **kwargs)

    def get_comments(self, **kwargs) -> QuerySet[Comment]:
        return Comment.objects.filter(**kwargs)

    # REPLIES
    def get_replies_to_comment(self, comment_id: int) -> QuerySet[CommentReply]:
        """Отдает все ответы на комментарий по id."""

        return self.get_comment_or_404(id=comment_id).comment_replies

    def get_reply_or_404(self, **kwargs) -> CommentReply:
        return get_object_or_404(CommentReply, **kwargs)

    def delete_reply(self, user_id: int, reply_id: int) -> None:
        """
        Удаление ответа на комментарий.
        Перед удалением проверяет,
        принадлежит ли этот ответ этому пользователю.
        """
        reply = self.get_reply_or_404(id=reply_id)
        user = users_services.get_user_or_404(id=user_id)
        if reply.user != user:
            raise PermissionDenied()
        reply.delete()

    def reply_to_comment(self, **fields) -> CommentReply:
        """
        Ответить на комментарий нельзя если:
        -Вы отвечаете на свой комментарий
        -Вы не являетесь продавцом, которому адресован комментарий
        -Уже есть ответ на этот комментарий
        """
        try:
            comment_id = fields.pop("comment")
            user_id = fields.pop("user")
        except KeyError:
            raise ValidationError(
                self.error_messages["reply_create_required_fields_not_in_input_data"]
            )

        comment = self.get_comment_or_404(id=comment_id)
        user = users_services.get_user_or_404(id=user_id)

        # Логика ответа на комментарий
        is_same_user: bool = user == comment.user
        is_not_seller: bool = user != comment.seller
        is_reply_exist: bool = comment.comment_replies.exists()

        if any([is_same_user, is_not_seller, is_reply_exist]):
            raise PermissionDenied()

        # Создание ответа на комментарий
        reply = CommentReply(user=user, comment=comment, **fields)
        reply.full_clean()
        reply.save()

        return reply

    # COMMENT_IMAGES
    def get_comment_images(self, comment_id: int) -> CommentImage:
        return self.get_comment_or_404(id=comment_id).comment_images
