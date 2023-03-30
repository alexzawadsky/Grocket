from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from products.models import Product, Favourite

User = get_user_model()


def _favourite(user_id: int,  product_id: int) -> None:
    """
    Добавить товар в избранное. Нельзя выполнить действие если:
    -Вы пытаетесь добавить свой же товар в избранное.
    -Товар находится в архиве или он продан.
    -Этот пользователь уже добавил этот товар в избранное.
    """
    if Favourite.objects.filter(
        user__id=user_id, product__id=product_id
    ).exists():
        raise PermissionDenied()

    product = get_object_or_404(Product, id=product_id)
    if product.is_archived or product.is_sold:
        raise PermissionDenied()

    user = get_object_or_404(User, id=user_id)
    if product.user == user:
        raise PermissionDenied()

    favourite = Favourite(
        user=user,
        product=product
    )
    favourite.full_clean()
    favourite.save()


def _unfavourite(user_id: int,  product_id: int) -> None:
    """
    Удалить товар из избранного. Нельзя выполнить действие если:
    -Этот пользователь еще не добавил этот товар в избранное.
    """
    if not Favourite.objects.filter(
        user__id=user_id, product__id=product_id
    ).exists():
        raise PermissionDenied()
    favourite = get_object_or_404(
        Favourite, user__id=user_id, product__id=product_id
    )
    favourite.delete()


def favourite_product(
    user_id: int,  product_id: int, is_favourited: bool
) -> None:
    if is_favourited:
        _favourite(user_id=user_id,  product_id=product_id)
    else:
        _unfavourite(user_id=user_id,  product_id=product_id)
