from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied, ValidationError
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from images.services import ImageService
from products.models import Product

from ..models import Comment, CommentImage, CommentReply, Status
from .base_services import BaseCommentReplyService, BaseCommentService

images_services = ImageService()
User = get_user_model()


error_messages = {
    "required_fields_not_in_input_data": (
        _("Unable create product: Invalid input data.")
    )
}


class CommentService(BaseCommentService):
    def delete(self, user_id: int) -> None:
        """Перед удалением проверяет, принадлежит ли этот комментарий этому пользователю."""
        comment = self.comment
        user = get_object_or_404(User, id=user_id)
        if comment.user != user:
            raise PermissionDenied()
        comment.delete()


class CommentReplyService(BaseCommentReplyService):
    def delete(self, user_id: int) -> None:
        """
        Удаление ответа на комментарий.
        Перед удалением проверяет,
        принадлежит ли этот ответ этому пользователю.
        """
        reply = self.reply
        user = get_object_or_404(User, id=user_id)
        if reply.user != user:
            raise PermissionDenied()
        reply.delete()


class CreateCommentReplyService:
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
            raise ValidationError(error_messages["required_fields_not_in_input_data"])

        comment = get_object_or_404(Comment, id=comment_id)
        user = get_object_or_404(User, id=user_id)

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


class CreateCommentService:
    def _create_comment_image(self, **fields) -> CommentImage:
        """Создает, обрабатывает и добавляет вотермарку на картинку."""
        try:
            image = fields.pop("image")
        except KeyError:
            raise ValidationError(error_messages["required_fields_not_in_input_data"])

        prepared_image = images_services.prepair_img(image=image)
        image_with_watermark = images_services.add_watermark(image=prepared_image)

        image = CommentImage(image=image_with_watermark, **fields)
        image.full_clean()
        image.save()
        return image

    def _add_images_to_comment(self, comment_id: int, images: list) -> Comment:
        """
        Добавляет картинкии путем создания объектов модели,
        связывающей комментарий и картинки
        """
        comment = get_object_or_404(Comment, id=comment_id)
        for image in images:
            self._create_comment_image(image=image, comment=comment)
        return comment

    def _check_comment_creation_logic(self, product_id: int, user_id: int) -> None:
        """
        Проверка логики создания комментария.
        Если хотя бы одно из событий нарушено, то вызывается ошибка.
        Создать комментарий нельзя если:
        -Комментируемый товар находится в архиве
        -Вы пытаетесь добавить второй комментарий на тот же товар
        -Вы пытаетесь прокомментировать свой товар
        """
        user = get_object_or_404(User, id=user_id)
        product = get_object_or_404(Product, id=product_id)

        logic_is_your_product: bool = product.user == user
        logic_is_product_archived: bool = product.is_archived
        logic_is_exists: bool = Comment.objects.filter(
            user=user, product=product
        ).exists()

        if any([logic_is_your_product, logic_is_product_archived, logic_is_exists]):
            raise PermissionDenied()

    def _parse_fields(self, fields: dict) -> set:
        """
        Достает из словаря поля, нужные для обработки перед созданием.
        Вызывает ошибку валидации при отсутствии таковых.
        Возвращает словарь с удаленными полями для дальнейшей обработки
        и словарь с остальными полями.
        """
        try:
            product_id = fields.pop("product")
            user_id = fields.pop("user")
            status_id = fields.pop("status")
        except KeyError:
            raise ValidationError(error_messages["required_fields_not_in_input_data"])

        removed_fields = {
            "product_id": product_id,
            "user_id": user_id,
            "status_id": status_id,
        }

        images = fields.get("images")
        if images is not None:
            fields.pop("images")
            removed_fields["images"] = images

        return removed_fields, fields

    def _create_comment_obj(
        self, user_id: int, product_id: int, status_id: int, validated_fields: dict
    ) -> int:
        """
        Принимает id объектов связанных моделей и
        словарь из остальных полей. Возвращает id созданного комментария.
        """
        user = get_object_or_404(User, id=user_id)
        product = get_object_or_404(Product, id=product_id)
        status = get_object_or_404(Status, id=status_id)

        seller = product.user
        comment = Comment(
            seller=seller, user=user, product=product, status=status, **validated_fields
        )
        comment.full_clean()
        comment.save()

        return comment.id

    def create(self, **fields) -> None:
        """
        Создание комментария:
        -Проверяется логика создания
        -Создаются картинки, если их добавили.
        """
        removed_fields, validated_fields = self._parse_fields(fields)

        self._check_comment_creation_logic(
            product_id=removed_fields["product_id"], user_id=removed_fields["user_id"]
        )

        comment_id = self._create_comment_obj(
            user_id=removed_fields["user_id"],
            product_id=removed_fields["product_id"],
            status_id=removed_fields["status_id"],
            validated_fields=validated_fields,
        )

        if removed_fields.get("images") is not None:
            self._add_images_to_comment(
                comment_id=comment_id, images=removed_fields["images"]
            )
