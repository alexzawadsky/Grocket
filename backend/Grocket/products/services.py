from typing import List, Optional

from django.core.exceptions import PermissionDenied, ValidationError
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _

from images.services import ImageService
from products.models import Category, Favourite, Image, Product, Promotion
from users.services import UserService

users_services = UserService()
images_services = ImageService()


class ProductService:
    error_messages = {
        'product_create_required_fields_not_in_input_data': (
            _('Unable create product: Invalid input data.')
        ),
        'product_image_create_required_fields_not_in_input_data': (
            _('Unable create product image: Invalid input data.')
        )
    }

    # PROMOTIONS
    def get_promotions(self, **kwargs) -> QuerySet[Promotion]:
        return Promotion.objects.filter(**kwargs)

    def get_product_promotions(
        self, product_id: int, **kwargs
    ) -> QuerySet[Promotion]:
        """Отдает все промошины по товару."""
        product = self.get_in_all_product_or_404(id=product_id)
        return product.promotions.filter(**kwargs)

    def promote_product(
        self, product_id: int, user_id: int, promotions_ids: List[int]
    ) -> Product:
        """
        Продвигает товар по заданным планам продвижения.
        -Нельзя продвинуть проданные или находящиеся в архиве товары.
        """
        product = self.get_in_all_product_or_404(id=product_id)
        user = users_services.get_user_or_404(id=user_id)
        if product.is_sold or product.is_archived or product.user != user:
            raise PermissionDenied()
        promotions = self.get_promotions(id__in=promotions_ids)
        product.promotions.set(promotions)
        product.full_clean()
        product.save()
        return product

    # CATEGORIES
    def get_ancestors_by_category(
        self, category_id: int, **kwargs
    ) -> QuerySet[Promotion]:
        """Вернет всех родителей категории."""
        ancestors = self.get_category_or_404(
            id=category_id
        ).get_ancestors(**kwargs)
        return ancestors

    def get_categories(self, **kwargs) -> QuerySet[Category]:
        return Category.objects.filter(**kwargs)

    def get_category_or_404(self, **kwargs) -> Category:
        return get_object_or_404(Category, **kwargs)

    # FAVOURITES
    def get_favourites(self, **kwargs) -> Favourite:
        return Favourite.objects.filter(**kwargs)

    # PRODUCTS
    def sell_product(self, user_id: int,  product_id: int) -> Product:
        """
        Продать товар. Не сработет если:
        -Пользователь не является автором товара.
        -Товар находится в архиве.
        """
        product = self.get_in_all_product_or_404(id=product_id)
        user = users_services.get_user_or_404(id=user_id)
        if product.user != user or product.is_archived:
            raise PermissionDenied()
        product.is_sold = True
        product.full_clean()
        product.save()
        return Product

    def unsell_product(self, user_id: int,  product_id: int) -> Product:
        """
        Убирает товар из проданного. Не сработет если:
        -Товар заархивирован.
        -Пользователь не является автором товара.
        """
        product = self.get_in_all_product_or_404(id=product_id)
        user = users_services.get_user_or_404(id=user_id)
        if product.user != user or product.is_archived:
            raise PermissionDenied()
        product.is_sold = False
        product.full_clean()
        product.save()
        return Product

    def archive_product(self, user_id: int,  product_id: int) -> Product:
        """
        Архивировать товар. Не сработет если:
        -Пользователь не является автором товара.
        -Товар продан.
        """
        product = self.get_in_all_product_or_404(id=product_id)
        user = users_services.get_user_or_404(id=user_id)
        if product.user != user or product.is_sold:
            raise PermissionDenied()
        product.is_archived = True
        product.full_clean()
        product.save()
        return Product

    def unarchive_product(self, user_id: int,  product_id: int) -> Product:
        """
        Убирает товар из архива. Не сработет если:
        -Товар продан.
        -Пользователь не является автором товара.
        """
        product = self.get_in_all_product_or_404(id=product_id)
        user = users_services.get_user_or_404(id=user_id)
        if product.user != user or product.is_sold:
            raise PermissionDenied()
        product.is_archived = False
        product.full_clean()
        product.save()
        return Product

    def favourite_product(self, user_id: int,  product_id: int) -> Product:
        """
        Добавить товар в избраанное. Нельзя выполнить действие если:
        -Товар находится в архиве или он продан.
        -Этот пользователь уже добавил этот товар в избранное.
        """
        if Favourite.objects.filter(
            user__id=user_id, product__id=product_id
        ).exists():
            raise PermissionDenied()

        product = self.get_in_all_product_or_404(id=product_id)
        if product.is_archived or product.is_sold:
            raise PermissionDenied()

        user = users_services.get_user_or_404(id=user_id)
        favourite = Favourite(
            user=user,
            product=product
        )
        favourite.full_clean()
        favourite.save()

    def unfavourite_product(self, user_id: int,  product_id: int) -> None:
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

    def get_is_favourited(self, user_id: int, product_id: int) -> bool:
        return Favourite.objects.filter(
            user__id=user_id, product__id=product_id
        ).exists()

    def get_in_all_product_or_404(self, **kwargs) -> Product:
        """Опасный метод, тк может отдать товар в архиве или проданный."""
        return get_object_or_404(Product, **kwargs)

    def get_product_or_404(
        self, user_id: Optional[int] = None, **kwargs
    ) -> Product:
        """
        Может отдать проданный товар.
        Передайте id запрашивающего пользователя
        для получения архивированного товара.
        """
        product = get_object_or_404(Product, **kwargs)
        if product.is_archived:
            if user_id is None:
                raise PermissionDenied()
            user = users_services.get_user_or_404(id=user_id)
            if product.user.id != user.id:
                raise PermissionDenied()
        return product

    def get_safe_products(self, **kwargs) -> QuerySet[Product]:
        """
        Возращает все товары, кроме:
        -Проданные или в архиве
        """
        kwargs['is_sold'] = False
        kwargs['is_archived'] = False
        return Product.objects.filter(**kwargs)

    def get_sold_products(
        self, user_id: int, **kwargs
    ) -> QuerySet[Product]:
        """
        Возвращает только проданные товары
        -user_id - id пользователя, который запрашивает данные
        """
        user = users_services.get_user_or_404(id=user_id)
        kwargs['is_sold'] = True
        kwargs['is_archived'] = False
        kwargs['user'] = user
        return Product.objects.filter(**kwargs)

    def get_archived_products(
        self, user_id: int, **kwargs
    ) -> QuerySet[Product]:
        """
        Возвращает только те товары, которые находятся в архиве
        -user_id - id пользователя, который запрашивает данные
        """
        user = users_services.get_user_or_404(id=user_id)
        kwargs['is_sold'] = False
        kwargs['is_archived'] = True
        kwargs['user'] = user
        return Product.objects.filter(**kwargs)

    def delete_product(self, user_id: int, product_id: int) -> None:
        """
        Удаление товара.
        Перед удалением проверяет,
        принадлежит ли этот товар этому пользователю.
        """
        product = self.get_product_or_404(id=product_id)
        user = users_services.get_user_or_404(id=user_id)
        if product.user != user:
            raise PermissionDenied()
        product.delete()

    def add_images_to_product(
        self, product_id: int, images: list
    ) -> Product:
        """
        Добавляет картинкии путем создания объектов модели,
        связывающей товар и картинку:
        -При возникновении ошибки все созданные картинки удаляются
        """
        product = self.get_product_or_404(id=product_id)

        created_images = []
        try:
            for image in images:
                created_image = self.create_product_image(
                    image=image['image'],
                    is_main=image['is_main'],
                    product=product
                )
                created_images.append(created_images)
        except Exception as error:
            product.delete()
            for created_image in created_images:
                created_image.delete()
            raise error

        return product

    def check_product_creation_logic(
        self, category_id: int, fields: dict, images: list
    ) -> None:
        """
        Проверка логики создания товара.
        Если хотя бы одно из событий нарушено, то вызывается ошибка.
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

        category = self.get_category_or_404(id=category_id)

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

    def create_product(self, **fields) -> Product:
        """
        Создание товара:
        -Проверяется логика создания
        -При возникновении ошибки созданные картинки и товар удаляются
        """
        try:
            user_id = fields.pop('user')
            category_id = fields.pop('category')
            images = fields.pop('images')
        except KeyError:
            raise (
                self.error_messages[
                    'product_create_required_fields_not_in_input_data'
                ]
            )

        self.check_product_creation_logic(
            category_id=category_id,
            images=images,
            fields=fields
        )

        category = self.get_category_or_404(id=category_id)
        user = users_services.get_user_or_404(id=user_id)

        product = Product(
            user=user,
            category=category,
            is_archived=False,
            is_sold=False,
            **fields
        )
        product.full_clean()
        product.save()

        try:
            self.add_images_to_product(
                product_id=product.id,
                images=images
            )
        except Exception as error:
            product.delete()
            raise error

        return product

    # PRODUCT_IMAGES
    def get_product_images(self, product_id: int, **kwargs) -> QuerySet[Image]:
        """Возвращает картинки товара."""
        product = self.get_in_all_product_or_404(id=product_id)
        return product.images.filter(**kwargs)

    def check_product_images_creation_logic(self, images: List[dict]):
        main = False
        for image in images:
            is_main = image['is_main']
            if is_main:
                if main:
                    raise ValidationError(
                        _('You cannot add more than one main photo.')
                    )
                main = True
        if not main:
            raise ValidationError(
                _('Add a main photo.')
            )

    def create_product_image(self, **fields) -> Image:
        """Создание картинки товара."""
        try:
            image = fields.pop('image')
        except KeyError:
            raise ValidationError(
                self.error_messages[
                    'product_image_create_required_fields_not_in_input_data'
                ]
            )

        prepared_image = images_services.prepair_img(image=image)
        image_with_watermark = images_services.add_watermark(
            image=prepared_image
        )

        image = Image(
            image=image_with_watermark,
            **fields
        )
        image.full_clean()
        image.save()
        return image
