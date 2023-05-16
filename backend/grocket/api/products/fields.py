from django.utils.translation import gettext_lazy as _
from rest_framework.fields import Field, empty
from rest_framework.serializers import ValidationError


class ProductImagesUpdateField(Field):
    """
    Получает:   [{
                    "image": "data:image/png;base64...",
                    "is_main": false
                },
                {
                    "image": <image_id>,
                    "is_main": true
                }]

    Отдает:     (images_album, new_images)
    """

    def __init__(
        self,
        *,
        read_only=False,
        write_only=False,
        required=None,
        default=...,
        initial=...,
        source=None,
        label=None,
        help_text=None,
        style=None,
        error_messages=None,
        validators=None,
        allow_null=False,
        max_length=0,
    ):
        self.max_length = max_length
        super().__init__(
            read_only=read_only,
            write_only=write_only,
            required=required,
            default=default,
            initial=initial,
            source=source,
            label=label,
            help_text=help_text,
            style=style,
            error_messages=error_messages,
            validators=validators,
            allow_null=allow_null,
        )

    def _parse_images(self, images):
        """
        Парсит список картинок,
        разделяет их на:
        новые(new_images) и шаблон для изменения старых(images_album).
        """
        if len(images) > self.max_length:
            raise ValidationError(_(f"You can attach up to {self.max_length} photos"))

        new_images = {}
        images_album = {}

        for image in images:
            image_data = image["image"]
            is_main = image["is_main"]

            if type(image_data) == int:
                images_album[image_data] = is_main
            elif type(image_data) == str:
                # ВНИМАНИЕ! Здесь одинаковые картинки убираются!!!
                new_images[image_data] = is_main
            else:
                raise ValidationError(_("The image field can only be id or base64"))
        return images_album, new_images

    def to_internal_value(self, data):
        images_album, new_images = self._parse_images(data)
        return (images_album, new_images)
