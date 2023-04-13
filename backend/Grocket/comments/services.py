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

    def delete_comment(self, user_id: int, comment_id: int) -> None:
        """
        Удаление комментария.
        Перед удалением проверяет,
        принадлежит ли этот комментарий этому пользователю.
        """
        comment = self.get_comment_or_404(id=comment_id)
        user = users_services.get_user_or_404(id=user_id)
        if comment.user != user:
            raise PermissionDenied()
        comment.delete()

    def add_images_to_comment(self, comment_id: int, images: list) -> Comment:
        """
        Добавляет картинкии путем создания объектов модели,
        связывающей комментарий и картинки:
        -При возникновении ошибки все созданные картинки удаляются
        """
        comment = self.get_comment_or_404(id=comment_id)

        created_images = []
        try:
            for image in images:
                created_image = self.create_comment_image(image=image, comment=comment)
                created_images.append(created_images)
        except Exception as error:
            for created_image in created_images:
                created_image.delete()
            raise error

        return comment

    def check_comment_creation_logic(self, product_id: int, user_id: int) -> None:
        """
        Проверка логики создания комментария.
        Если хотя бы одно из событий нарушено, то вызывается ошибка.
        Создать комментарий нельзя если:
        -Комментируемый товар находится в архиве
        -Вы пытаетесь добавить второй комментарий на тот же товар
        -Вы пытаетесь прокомментировать свой товар
        """
        user = users_services.get_user_or_404(id=user_id)
        product = products_services.get_product_or_404(id=product_id)

        logic_is_your_product: bool = product.user == user
        logic_is_product_archived: bool = product.is_archived
        logic_is_exists: bool = self.get_comments(user=user, product=product).exists()

        if any([logic_is_your_product, logic_is_product_archived, logic_is_exists]):
            raise PermissionDenied()

    def create_comment(self, **fields) -> Comment:
        """
        Создание комментария:
        -Проверяется логика создания
        -При возникновении ошибки созданные картинки и комментарий удаляются
        """
        try:
            product_id = fields.pop("product")
            user_id = fields.pop("user")
            status_id = fields.pop("status")
            images = fields.pop("images")
        except KeyError:
            raise ValidationError(
                self.error_messages["comment_create_required_fields_not_in_input_data"]
            )

        self.check_comment_creation_logic(product_id=product_id, user_id=user_id)

        user = users_services.get_user_or_404(id=user_id)
        product = products_services.get_product_or_404(id=product_id)
        status = self.get_status_or_404(id=status_id)

        seller = product.user
        comment = Comment(
            seller=seller, user=user, product=product, status=status, **fields
        )
        comment.full_clean()
        comment.save()

        try:
            self.add_images_to_comment(comment_id=comment.id, images=images)
        except Exception as error:
            comment.delete()
            raise error

        return comment

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

    def create_comment_image(self, **fields) -> CommentImage:
        """Создание картинки комментария."""
        try:
            image = fields.pop("image")
        except KeyError:
            raise ValidationError(
                self.error_messages[
                    "comment_image_create_required_fields_not_in_input_data"
                ]
            )

        prepared_image = images_services.prepair_img(image=image)
        image_with_watermark = images_services.add_watermark(image=prepared_image)

        image = CommentImage(image=image_with_watermark, **fields)
        image.full_clean()
        image.save()
        return image
