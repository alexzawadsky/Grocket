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


def get_products(safe: bool, user_id: Optional[int], **fields) -> QuerySet:
    if safe:
        return _get_safe_products(**fields)
    return _get_all_products(user_id=user_id, **fields)
