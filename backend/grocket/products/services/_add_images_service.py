from typing import List

from django.core.exceptions import ValidationError
from django.core.files import File
from django.utils.translation import gettext_lazy as _

from images.services import ImageService
from products.models import Image

from .base_services import BaseProductService

images_services = ImageService()


class ProductImageCreateService(BaseProductService):
    """Отвечает за добавление картинок в товар."""

    error_messages = {
        "required_fields_not_in_input_data": (
            _("Unable create product image: Invalid input data.")
        ),
        "more_than_one_main_photo": (_("You cannot add more than one main photo.")),
        "no_main_photo": (_("Add a main photo.")),
    }

    def _parse_fields(self, fields: dict) -> set:
        """
        Достает из словаря поля, нужные для обработки перед созданием.
        Вызывает ошибку валидации при отсутствии таковых.
        Возвращает словарь с удаленными полями для дальнейшей обработки
        и словарь с остальными полями.
        """
        try:
            image = fields.pop("image")
        except KeyError:
            raise ValidationError(
                self.error_messages["required_fields_not_in_input_data"]
            )
        removed_fields = {"image": image}
        return removed_fields, fields

    def _prepair_image(self, image: File) -> File:
        """Обрабатывает изображение и добавляет на него вотермарку."""
        prepared_image = images_services.prepair_img(image=image)
        prepared_image_with_watermark = images_services.add_watermark(
            image=prepared_image
        )
        return prepared_image_with_watermark

    def _create_product_image_obj(self, image: File, fields: dict) -> int:
        """
        Принимает id товара, обработанную картинку и дополнительные поля.
        Возвращает id созданной картинки.
        """
        product = self.product
        image = Image(product=product, image=image, **fields)
        image.full_clean()
        image.save()
        return image.id

    def _create_product_image(self, **fields) -> int:
        """
        Принимает словарь с полями картинки и id товара.
        Парсит поля картинки.
        Подготавливает изобрадение к загрузке в бд.
        Возвращает id созданной картинки.
        """
        removed_fields, validated_fields = self._parse_fields(fields)
        prepared_image = self._prepair_image(removed_fields["image"])

        return self._create_product_image_obj(
            image=prepared_image, fields=validated_fields
        )

    def _check_product_images_creation_logic(self, images: List[dict]) -> None:
        """Проверка списка добавляемых картинок перед созданием товара."""
        main = False
        for image in images:
            is_main = image["is_main"]
            if is_main:
                if main:
                    raise ValidationError(
                        self.error_messages["more_than_one_main_photo"]
                    )
                main = True
        if not main:
            raise ValidationError(self.error_messages["no_main_photo"])

    def add_images_to_product(self, images: List[dict]) -> None:
        """
        Принимает id товара и список словарей с полями картинок.
        Проверяет логику создания картинок.
        Поочереди создает картинки.
        """
        self._check_product_images_creation_logic(images=images)

        for image in images:
            self._create_product_image(**image)
