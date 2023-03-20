from django.shortcuts import get_object_or_404
from products.models import Product, Category, Image
from django.db.models import QuerySet
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import PermissionDenied, ValidationError
from users.services import UserService
from images.services import ImageService

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

    # CATEGORIES
    def get_category_or_404(self, **kwargs) -> Category:
        return get_object_or_404(Category, **kwargs)

    # PRODUCTS
    def get_product_or_404(self, **kwargs) -> Product:
        return get_object_or_404(Product, **kwargs)

    def get_products(self, **kwargs) -> QuerySet[Product]:
        return Product.objects.filter(**kwargs)

    def add_images_to_product(
        self, product_id: int, images: list
    ) -> Product:
        """
        Добавляет картинкии путем создания объектов модели,
        связывающей товар и картинки:
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
