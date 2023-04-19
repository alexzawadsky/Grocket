from typing import Optional

from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.db.models.query import QuerySet
from django.shortcuts import get_object_or_404

from core.utils import http_404_logger
from products.models import (Category, Favourite, Image, Product,
                             ProductAddress, Promotion)

User = get_user_model()


def get_categories(**fields) -> QuerySet[Category]:
    return Category.objects.filter(**fields).order_by("title")


def get_promotions(**fields) -> QuerySet[Promotion]:
    return Promotion.objects.filter(**fields)


@http_404_logger
def get_all_products(user_id: Optional[int] = None, **fields) -> QuerySet[Product]:
    """
    Может отдать проданные товары! Чтоб получить товары в архиве
    передайте id пользователя, который их запрашивает.
    Не может отдать одновременно и проданные товары и в архиве.
    При получении положительного значения одного из этих флагов
    второй устанавливается False.
    """
    if fields.get("is_archived"):
        if user_id is not None:
            user = get_object_or_404(User, id=user_id)
            fields["user"] = user
            fields["is_sold"] = False
        else:
            raise PermissionDenied()
    else:
        fields["is_archived"] = False
    return Product.objects.filter(**fields)


def get_safe_products(**fields) -> QuerySet:
    """
    Безопасно вызывать для получения всех товар без особых меток:
    is_sold, is_archived
    """
    fields["is_sold"] = False
    fields["is_archived"] = False
    return Product.objects.filter(**fields).values_list(named=True)


@http_404_logger
def get_products_for_comments(user_id: int, seller_id: int, **fields) -> QuerySet:
    """
    Для работы надо передать id запрашивающего юзера и id продавца товара.
    Отдает товары, на которые можно оставить комментарий:
    -Проданные, активные.
    -На которые этот юзер еще не оставлял комментарий.
    """
    user = get_object_or_404(User, id=user_id)
    seller = get_object_or_404(User, id=seller_id)

    if user == seller:
        raise PermissionDenied()

    fields["is_archived"] = False

    comments_products_ids = list(
        user.user_comments.select_related("products").values_list(flat=True)
    )
    products = seller.products.filter(**fields).exclude(id__in=comments_products_ids)

    return products


@http_404_logger
def get_favourited_products(user_id: int, **fields) -> QuerySet:
    """
    Вернет только понравовившиеся товары юзера с данным id.
    Не вернет товары в архиве.
    """
    user = get_object_or_404(User, id=user_id)

    fields["is_archived"] = False

    product_ids = user.favourites.values_list("product", flat=True)
    products = Product.objects.filter(id__in=list(product_ids), **fields)

    return products


@http_404_logger
def get_product_or_404(user_id: Optional[int] = None, **fields) -> Product:
    """
    Может отдать проданный товар!
    Передайте id запрашивающего пользователя
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


def get_product_images(product_id: int) -> QuerySet[Image]:
    return Image.objects.filter(product__id=product_id)


@http_404_logger
def get_product_promotions(product_id: int) -> QuerySet[Promotion]:
    product = get_object_or_404(Product, id=product_id)
    return product.promotions.all()


@http_404_logger
def get_product_category(product_id: int) -> Category:
    product = get_object_or_404(Product, id=product_id)
    return product.category


@http_404_logger
def get_product_address(product_id: int) -> ProductAddress:
    product = get_object_or_404(Product, id=product_id)
    return get_object_or_404(ProductAddress, product=product)


def get_is_favourited(product_id: int, user_id: int) -> bool:
    return Favourite.objects.filter(user__id=user_id, product__id=product_id).exists()


@http_404_logger
def get_ancestors_by_category(category_id: int) -> QuerySet[Category]:
    """Отдаст список родителей каотегории НЕ включая саму себя начиная с родительской."""
    category = get_object_or_404(Category, id=category_id)
    return category.get_ancestors(include_self=False, ascending=False)
