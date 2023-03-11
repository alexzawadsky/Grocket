from io import BytesIO
from datetime import datetime
from django.core.files import File
from django.db.models import Manager, Model
from PIL import Image
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from products.models import Product


class ProductService:
    objects: Manager = Product.objects
    model: Model = Product

    def prepair_image(
        self, product_id: int, image: SimpleUploadedFile
    ) -> File:
        file_name = self.create_image_file_name(product_id)

        image_settings = settings.PRODUCT_IMAGE

        img = Image.open(image)
        img.convert('RGB')
        img.resize(image_settings['SIZE'])

        watermark = Image.open(
            f"{image_settings['WATERMARK_URL']}/"
            f"{image_settings['WATERMARK_FILE_NAME']}"
        )

        img.paste(
            watermark,
            image_settings['WATERMARK_INDENTS']
        )

        thumb_io = BytesIO()
        img.save(thumb_io, 'PNG')
        prepared_image = File(thumb_io, name=file_name)

        return prepared_image

    def create_image_file_name(self, product_id: int) -> str:
        date = datetime.date(datetime.now())
        return f'{product_id}__{date}.png'
