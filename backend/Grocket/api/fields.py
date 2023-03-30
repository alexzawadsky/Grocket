from django.utils.translation import gettext_lazy as _
from rest_framework.fields import Field
from rest_framework.serializers import ValidationError


class ProductImagesUpdateField(Field):
    '''
    Получает:   [{
                    "image": "data:image/png;base64...",
                    "is_main": false
                },
                {
                    "image": <image_id>,
                    "is_main": true
                }]

    Отдает:     (images_album, new_images)
    '''
    def _parse_images(self, images):
        '''
        Парсит список картинок,
        разделяет их на:
        новые(new_images) и шаблон для изменения старых(images_album).
        '''
        new_images = {}
        images_album = {}

        for image in images:
            image_data = image['image']
            is_main = image['is_main']

            if type(image_data) == int:
                images_album[image_data] = is_main
            elif type(image_data) == str:
                # ВНИМАНИЕ! Здесь одинаковые картинки убираются!!!
                new_images[image_data] = is_main
            else:
                raise ValidationError(
                    _('The image field can only be id or base64.')
                )
        return images_album, new_images

    def to_internal_value(self, data):
        images_album, new_images = self._parse_images(data)
        return (images_album, new_images)
