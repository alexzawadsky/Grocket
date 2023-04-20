from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from products.models import Favourite

from .base_services import BaseProductService

User = get_user_model()


class ProductFavouriteService(BaseProductService):
    """Отвечает за добавление товара в избранное и удаление из него."""

    def _favourite(self, user_id: int) -> None:
        """
        Добавить товар в избранное. Нельзя выполнить действие если:
        -Вы пытаетесь добавить свой же товар в избранное.
        -Товар находится в архиве или он продан.
        -Этот пользователь уже добавил этот товар в избранное.
        """
        if Favourite.objects.filter(
            user__id=user_id, product__id=self.product_id
        ).exists():
            raise PermissionDenied()

        product = self.product

        if product.is_archived or product.is_sold:
            raise PermissionDenied()

        user = get_object_or_404(User, id=user_id)
        if product.user == user:
            raise PermissionDenied()

        favourite = Favourite(user=user, product=product)
        favourite.full_clean()
        favourite.save()

    def _unfavourite(self, user_id: int) -> None:
        """
        Удалить товар из избранного. Нельзя выполнить действие если:
        -Этот пользователь еще не добавил этот товар в избранное.
        """
        if not Favourite.objects.filter(
            user__id=user_id, product__id=self.product_id
        ).exists():
            raise PermissionDenied()
        favourite = get_object_or_404(
            Favourite, user__id=user_id, product__id=self.product_id
        )
        favourite.delete()

    def favourite(self, user_id: int, is_favourited: bool) -> None:
        """
        is_favourited=True - добавит в избранное
        is_favourited=False - удалит из избранного
        """
        if is_favourited:
            self._favourite(user_id=user_id)
        else:
            self._unfavourite(user_id=user_id)
