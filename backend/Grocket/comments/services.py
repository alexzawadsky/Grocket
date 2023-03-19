from comments.models import Comment, CommentImage, CommentReply, Status
from django.core.exceptions import PermissionDenied, ValidationError
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from products.services import ProductService
from users.services import UserService
from images.services import ImageService

images_services = ImageService()
users_services = UserService()
products_services = ProductService()


class CommentService:
    """Сервисы для работы с комментариями."""

    error_messages = {
        'reply_create_required_fields_not_in_input_data': (
            _('Unable to reply to comment: Invalid input data.')
        ),
        'comment_create_required_fields_not_in_input_data': (
            _('Unable to create comment: Invalid input data.')
        ),
        'comment_image_create_required_fields_not_in_input_data': (
            _('Unable to create comment image: Invalid input data.')
        )
    }

    # STATUSES
    def get_statuses(self, **kwargs):
        return Status.objects.filter(**kwargs)

    def get_status_or_404(self, **kwargs) -> Status:
        return get_object_or_404(Status, **kwargs)

    # COMMENTS
    def get_comment_or_404(self, **kwargs) -> Comment:
        return get_object_or_404(Comment, **kwargs)

    def get_comments(self, **kwargs) -> QuerySet[Comment]:
        return Comment.objects.filter(**kwargs)

    def delete_comment(self, comment_id: int):
        self.get_comment_or_404(id=comment_id).delete()

    def create_comment(self, **fields) -> Comment:
        """
        Создать комментарий нельзя если:
        -Комментируемый товар находится в архиве
        -Вы пытаетесь добавить второй комментарий на тот же товар
        -Вы пытаетесь прокомментировать свой товар
        """
        try:
            product_id = fields.pop('product')
            user_id = fields.pop('user')
            status_id = fields.pop('status')
            images = fields.pop('images')
        except KeyError:
            raise ValidationError(
                self.error_messages[
                    'comment_create_required_fields_not_in_input_data'
                ]
            )

        user = users_services.get_user_or_404(id=user_id)
        product = products_services.get_product_or_404(id=product_id)
        status = self.get_status_or_404(id=status_id)

        # Логика создания комментария
        is_your_product: bool = product.user == user
        is_product_archived: bool = product.is_archived
        is_exists: bool = self.get_comments(
            user=user, product=product
        ).exists()

        if any([is_exists, is_product_archived, is_your_product]):
            raise PermissionDenied()

        # Создание комментария
        seller = product.user

        comment = Comment(
            seller=seller,
            user=user,
            product=product,
            status=status,
            **fields
        )
        comment.full_clean()
        comment.save()

        # Создание картинок
        created_images = []
        try:
            for image in images:
                created_image = self.create_comment_image(
                    image=image,
                    comment=comment
                )
                created_images.append(created_images)
        except Exception as error:
            comment.delete()
            for created_image in created_images:
                created_image.delete()
            raise error

        return comment

    # REPLIES
    def get_replies_to_comment(
        self, comment_id: int
    ) -> QuerySet[CommentReply]:
        """Отдает все ответы на комментарий по id."""

        return self.get_comment_or_404(id=comment_id).comment_replies

    def get_reply_or_404(self, **kwargs) -> CommentReply:
        return get_object_or_404(CommentReply, **kwargs)

    def delete_reply(self, reply_id: int) -> None:
        self.get_reply_or_404(id=reply_id).delete()

    def reply_to_comment(self, **fields) -> CommentReply:
        """
        Ответить на комментарий нельзя если:
        -Вы отвечаете на свой комментарий
        -Вы не являетесь продавцом, которому адресован комментарий
        -Уже есть ответ на этот комментарий
        """
        try:
            comment_id = fields.pop('comment')
            user_id = fields.pop('user')
        except KeyError:
            raise ValidationError(
                self.error_messages[
                    'reply_create_required_fields_not_in_input_data'
                ]
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
        reply = CommentReply(
            user=user,
            comment=comment,
            **fields
        )
        reply.full_clean()
        reply.save()

        return reply

    # COMMENT_IMAGES
    def get_comment_images(self, comment_id: int) -> CommentImage:
        return self.get_comment_or_404(id=comment_id).comment_images

    def create_comment_image(self, **fields) -> CommentImage:
        try:
            image = fields.pop('image')
        except KeyError:
            raise ValidationError(
                self.error_messages[
                    'comment_image_create_required_fields_not_in_input_data'
                ]
            )

        prepared_image = images_services.prepair_img(image=image)
        image_with_watermark = images_services.add_watermark(
            image=prepared_image
        )

        image = CommentImage(
            image=image_with_watermark,
            **fields
        )
        image.full_clean()
        image.save()
        return image
