from typing import Optional

from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.db.models.query import QuerySet
from django.shortcuts import get_object_or_404

from products.models import Product

User = get_user_model()


def _get_all_products(user_id: Optional[int] = None, **fields) -> QuerySet:
    """
    Может отдать проданные товары! Чтоб получить товары в архиве
    передайте id пользователя, который их запрашивает.
    Не может отдать одновременно и проданные товары и в архиве.
    При получении положительного значения одного из этих флагов
    второй устанавливается False.
    """
    if fields.get('is_archived'):
        if user_id is not None:
            user = get_object_or_404(User, id=user_id)
            fields['user'] = user
            fields['is_sold'] = False
        else:
            raise PermissionDenied()
    else:
        fields['is_archived'] = False
    return Product.objects.filter(**fields).values_list(named=True)


def _get_safe_products(**fields) -> QuerySet:
    """
    Безопасно вызывать для получения всех товар без особых меток:
    is_sold, is_archived
    """
    fields['is_sold'] = False
    fields['is_archived'] = False
    return Product.objects.filter(**fields).values_list(named=True)


def _get_products_for_comments(
    user_id: Optional[int] = None, seller_id: Optional[int] = None, **fields
) -> QuerySet:
    """
    Для работы надо передать id запрашивающего юзера и id продавца товара.
    Отдает товары, на которые можно оставить комментарий:
    -Проданные, активные.
    -На которые этот юзер еще не оставлял комментарий.
    """
    if user_id is None or seller_id is None:
        raise PermissionDenied()

    user = get_object_or_404(User, id=user_id)
    seller = get_object_or_404(User, id=seller_id)

    if user == seller:
        raise PermissionDenied()

    fields['is_archived'] = False

    comments_products_ids = list(
        user.user_comments.select_related('products').values_list(flat=True)
    )
    products = seller.products.filter(
        **fields
    ).exclude(id__in=comments_products_ids)

    return products


def get_products(
    for_comments: bool, safe: bool,
    user_id: Optional[int], seller_id: Optional[int], **fields
) -> QuerySet:
    if safe:
        return _get_safe_products(**fields)
    if for_comments:
        return _get_products_for_comments(
            user_id=user_id, seller_id=seller_id, **fields
        )
    return _get_all_products(user_id=user_id, **fields)
