import string
from typing import List

from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied, ValidationError
from django.shortcuts import get_object_or_404
from django.template.defaultfilters import slugify
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _

from ..models import Category, Product, ProductAddress, Promotion
from ._add_images_service import ProductImageCreateService
from ._favourite_service import ProductFavouriteService
from .base_services import BaseProductService

User = get_user_model()


class ProductService(BaseProductService):
    def delete(self, user_id: int) -> None:
        """
        Перед удалением проверяет,
        принадлежит ли этот товар этому пользователю.
        """
        product = self.product
        user = get_object_or_404(User, id=user_id)
        if product.user != user:
            raise PermissionDenied()
        product.delete()

    def promote(self, user_id: int, promotions_ids: List[int]) -> None:
        """
        Продвигает товар по заданным планам продвижения.
        -Нельзя продвинуть проданные или находящиеся в архиве товары.
        """
        product = self.product
        user = get_object_or_404(User, id=user_id)
        if product.is_sold or product.is_archived or product.user != user:
            raise PermissionDenied()
        promotions = Promotion.objects.filter(id__in=promotions_ids)
        product.promotions.set(promotions)
        product.full_clean()
        product.save()

    def sell(self, user_id: int, is_sold: bool) -> None:
        """
        Передать is_sold=True для того чтобы продать
        и False чтоб отменить продажу.
        Не сработет если:
        -Пользователь не является автором товара.
        -Товар находится в архиве.
        """
        product = self.product
        user = get_object_or_404(User, id=user_id)
        if product.user != user or product.is_archived:
            raise PermissionDenied()
        product.is_sold = is_sold
        product.full_clean()
        product.save()

    def archive(self, user_id: int, is_archived: bool) -> None:
        """
        Передать is_archived=True для того чтобы добавить в архив
        и False чтобы убрать из архива.
        Не сработет если:
        -Пользователь не является автором товара.
        -Товар продан.
        """
        product = self.product
        user = get_object_or_404(User, id=user_id)
        if product.user != user or product.is_sold:
            raise PermissionDenied()
        product.is_archived = is_archived
        product.full_clean()
        product.save()

    def favourite(self, user_id: int, is_favourited: bool) -> None:
        """
        Добавляет или убирает товар из избранного.
        is_favourited=True - добавить
        is_favourited=False - убрать
        """
        service = ProductFavouriteService(product_id=self.product_id)
        service.favourite(user_id=user_id, is_favourited=is_favourited)


class CreateProductService:
    error_messages = {
        "required_fields_not_in_input_data": (
            _("Unable create product: Invalid input data.")
        )
    }

    def _check_product_create_logic(
        self, category_id: int, images: list, fields: dict
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
            fields.get("is_archived"),
            fields.get("is_sold"),
            fields.get("promotions"),
        )
        category = get_object_or_404(Category, id=category_id)

        logic_is_bad_fields: bool = not all(field is None for field in bad_fields)
        logic_is_not_leaf_node: bool = not category.is_leaf_node()
        logic_is_not_images: bool = len(images) == 0

        if any([logic_is_bad_fields, logic_is_not_leaf_node, logic_is_not_images]):
            raise PermissionDenied()

    def _parse_fields(self, fields: dict) -> set:
        """
        Достает из словаря поля, нужные для обработки перед созданием.
        Вызывает ошибку валидации при отсутствии таковых.
        Возвращает словарь с удаленными полями для дальнейшей обработки
        и словарь с остальными полями.
        """
        try:
            user_id = fields.pop("user")
            category_id = fields.pop("category")
            images = fields.pop("images")
            address = fields.pop("address")
            fields["name"]
        except KeyError:
            raise ValidationError(
                self.error_messages["required_fields_not_in_input_data"]
            )

        removed_fields = {
            "user_id": user_id,
            "category_id": category_id,
            "images": images,
            "address": address,
        }

        return removed_fields, fields

    def _generate_slug(self, name: str) -> str:
        """
        Генерирует слаг по полю name товара. Если такой slug уже есть в бд,
        то в конец через `-` вставляются рандомный латинские буквы.
        """
        EXTRA_STRING_LENTH = 6
        MAX_SLUG_LENTH = 30

        short_name = name[:MAX_SLUG_LENTH] if len(name) > MAX_SLUG_LENTH else name
        only_name_slug = slug = slugify(short_name)
        while Product.objects.filter(slug=slug).exists():
            slug = (
                f"{only_name_slug}-"
                f"{get_random_string(length=EXTRA_STRING_LENTH, allowed_chars=string.ascii_letters)}"
            )
        return slug

    def _create_product_obj(
        self, user_id: int, category_id: int, validated_fields: dict
    ) -> set:
        """
        Поля is_sold и is_archived по умолчанию устанавливаются False.
        Принимает id объектов связанных моделей и
        словарь из остальных полей. Возвращает id созданного товара.
        """
        category = get_object_or_404(Category, id=category_id)
        user = get_object_or_404(User, id=user_id)
        slug = self._generate_slug(name=validated_fields.get("name"))

        product = Product(
            user=user,
            category=category,
            is_archived=False,
            is_sold=False,
            slug=slug,
            **validated_fields,
        )
        product.full_clean()
        product.save()

        return product.id, product.slug

    def _add_address_to_product(self, product_id: int, fields: dict) -> None:
        """Создаст объект адреса с продуктом по id."""
        product = get_object_or_404(Product, id=product_id)
        address = ProductAddress(product=product, **fields)
        address.full_clean()
        address.save()

    def create(self, **fields) -> str:
        """
        Проверяется логика создания товара.
        Добавляется адрес и картинки. Отдает slug товара.
        """
        removed_fields, validated_fields = self._parse_fields(fields)

        self._check_product_create_logic(
            category_id=removed_fields["category_id"],
            images=removed_fields["images"],
            fields=validated_fields,
        )

        product_id, product_slug = self._create_product_obj(
            category_id=removed_fields["category_id"],
            user_id=removed_fields["user_id"],
            validated_fields=validated_fields,
        )

        service = ProductImageCreateService(product_id=product_id)
        service.add_images_to_product(images=removed_fields["images"])
        self._add_address_to_product(
            product_id=product_id, fields=removed_fields["address"]
        )

        return product_slug
