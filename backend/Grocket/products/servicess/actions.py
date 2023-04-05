from typing import List, Optional
from django.db.models.query import QuerySet
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from address.models import Address
from products.models import Product, Promotion

from . import (create_product_service, favourite_product_service,
               get_products_service)

User = get_user_model()


def create_product(**fields) -> None:
    """Создаст товар и добавит к нему картинки."""
    create_product_service.create_product(**fields)


def favourite_product(
    user_id: int,  product_id: int, is_favourited: bool
) -> None:
    """
    Добавляет или убирает товар из избранного.
    is_favourited=True - добавить
    is_favourited=False - убрать
    """
    favourite_product_service.favourite_product(
        user_id=user_id, product_id=product_id, is_favourited=is_favourited
    )


def get_products(
    is_favourited: bool = False,
    for_comments: bool = False,
    safe: bool = False,
    user_id: Optional[int] = None,
    seller_id: Optional[int] = None,
    **fields
) -> QuerySet:
    """
    При safe=True отдаст товары без меток is_sold и is_archived.
    При safe=False может отдасть проданные товары и товары в архиве.
    Для получения товара в архиве передайте id запрашивающего юзера.

    for_comments=True требует и user_id и seller_id.
    Отдаст товары, которые можно прокоментировать.

    is_favourited=True вернет все понравовившиеся юзеру товары.
    Передать user_id.
    """
    return get_products_service.get_products(
        safe=safe, user_id=user_id, seller_id=seller_id,
        for_comments=for_comments, is_favourited=is_favourited, **fields
    )


def get_product_address_or_404(product_id: int) -> Address:
    product = get_object_or_404(Product, id=product_id)
    return product.address


def get_product_or_404(user_id: Optional[int] = None, **fields) -> Product:
    """
    Может отдать проданный товар! Передайте id запрашивающего пользователя
    для получения архивированного товара.
    """
    product = get_object_or_404(Product, **fields)
    if product.is_archived:
        if user_id is None:
            raise PermissionDenied()
        user = get_object_or_404(User, id=user_id)
        if product.user.id != user.id:
            raise PermissionDenied()
    return product


def delete_product(user_id: int, product_id: int) -> None:
    """
    Перед удалением проверяет,
    принадлежит ли этот товар этому пользователю.
    """
    product = get_object_or_404(Product, id=product_id)
    user = get_object_or_404(User, id=user_id)
    if product.user != user:
        raise PermissionDenied()
    product.delete()


def promote_product(
    product_id: int, user_id: int, promotions_ids: List[int]
) -> None:
    """
    Продвигает товар по заданным планам продвижения.
    -Нельзя продвинуть проданные или находящиеся в архиве товары.
    """
    product = get_object_or_404(Product, id=product_id)
    user = get_object_or_404(User, id=user_id)
    if product.is_sold or product.is_archived or product.user != user:
        raise PermissionDenied()
    promotions = Promotion.objects.filter(id__in=promotions_ids)
    product.promotions.set(promotions)
    product.full_clean()
    product.save()


def sell_product(user_id: int,  product_id: int, is_sold: bool) -> None:
    """
    Передать is_sold=True для того чтобы продать и False чтоб отменить продажу.
    Не сработет если:
    -Пользователь не является автором товара.
    -Товар находится в архиве.
    """
    product = get_object_or_404(Product, id=product_id)
    user = get_object_or_404(User, id=user_id)
    if product.user != user or product.is_archived:
        raise PermissionDenied()
    product.is_sold = is_sold
    product.full_clean()
    product.save()


def archive_product(user_id: int,  product_id: int, is_archived: bool) -> None:
    """
    Передать is_archived=True для того чтобы добавить в архив
    и False чтобы убрать из архива.
    Не сработет если:
    -Пользователь не является автором товара.
    -Товар продан.
    """
    product = get_object_or_404(Product, id=product_id)
    user = get_object_or_404(User, id=user_id)
    if product.user != user or product.is_sold:
        raise PermissionDenied()
    product.is_archived = is_archived
    product.full_clean()
    product.save()
