from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied, ValidationError
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _

from products.models import Category, Product, ProductAddress

from .add_images_to_product_service import add_images_to_product

User = get_user_model()

error_messages = {
    'required_fields_not_in_input_data': (
        _('Unable create product: Invalid input data.')
    )
}


def _check_product_create_logic(
    category_id: int, images: list, fields: dict
) -> None:
    """
    Проверка логики создания товара.
    Если хотя бы одно из событий положительно, то вызывается ошибка.
    Нельзя создать товар если:
    -Вы передаете поля: is_archived, is_sold, promotions
    -Категория не является конечной
    -Вы не передаете картинки
    """
    bad_fields = (
        fields.get('is_archived'),
        fields.get('is_sold'),
        fields.get('promotions')
    )
    category = get_object_or_404(Category, id=category_id)

    logic_is_bad_fields: bool = not all(
        field is None for field in bad_fields
    )
    logic_is_not_leaf_node: bool = not category.is_leaf_node()
    logic_is_not_images: bool = len(images) == 0

    if any([
        logic_is_bad_fields,
        logic_is_not_leaf_node,
        logic_is_not_images
    ]):
        raise PermissionDenied()


def _parse_fields(fields: dict) -> set:
    """
    Достает из словаря поля, нужные для обработки перед созданием.
    Вызывает ошибку валидации при отсутствии таковых.
    Возвращает словарь с удаленными полями для дальнейшей обработки
    и словарь с остальными полями.
    """
    try:
        user_id = fields.pop('user')
        category_id = fields.pop('category')
        images = fields.pop('images')
        address = fields.pop('address')
    except KeyError:
        raise ValidationError(
            error_messages[
                'required_fields_not_in_input_data'
            ]
        )

    removed_fields = {
        'user_id': user_id,
        'category_id': category_id,
        'images': images,
        'address': address
    }

    return removed_fields, fields


def _create_product_obj(
    user_id: int, category_id: int, validated_fields: dict
) -> int:
    """
    Поля is_sold и is_archived по умолчанию устанавливаются False.
    Принимает id объектов связанных моделей и
    словарь из остальных полей. Возвращает id созданного товара.
    """
    category = get_object_or_404(Category, id=category_id)
    user = get_object_or_404(User, id=user_id)

    product = Product(
        user=user,
        category=category,
        is_archived=False,
        is_sold=False,
        **validated_fields
    )
    product.full_clean()
    product.save()

    return product.id


def _add_address_to_product(product_id: int, fields: dict) -> None:
    product = get_object_or_404(Product, id=product_id)
    address = ProductAddress(product=product, **fields)
    address.full_clean()
    address.save()


def create_product(**fields) -> None:
    """
    Проверяется логика создания товара.
    При возникновении ошибки при создании картинок товар удаляется.
    """
    removed_fields, validated_fields = _parse_fields(fields)

    _check_product_create_logic(
        category_id=removed_fields['category_id'],
        images=removed_fields['images'],
        fields=validated_fields
    )

    product_id = _create_product_obj(
        category_id=removed_fields['category_id'],
        user_id=removed_fields['user_id'],
        validated_fields=validated_fields
    )

    try:
        add_images_to_product(
            product_id=product_id,
            images=removed_fields['images']
        )
        _add_address_to_product(
            product_id=product_id,
            fields=removed_fields['address']
        )
    except Exception as error:
        Product.objects.get(id=product_id).delete()
        raise error
