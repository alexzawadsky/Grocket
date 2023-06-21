import random
from datetime import datetime
from io import BytesIO
from typing import Any, Optional

from django.conf import settings
from django.core.files import File
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image, ImageDraw, ImageFont


class ImageService:
    """Сервисы для работы с изображениями."""

    FORMATS = (
        "jpeg",
        "png",
        "ico",
        "gif",
        "tiff",
        "webp",
        "eps",
        "svg",
        "psd",
        "indd",
        "cdr",
        "ai",
        "raw",
    )

    def create_file_name(self, date=True, file_format: str = "png", **names) -> str:
        """
        Создает название файла:
        -Если date=True, то подставляется дата в формате YYYY-MM-DD
        -Подставляется формат (по умолчанию png)
        -Подставляеются все строки из **kwargs
        """
        date = datetime.now() if date else ""
        names_in_file_name = [str(name) for name in names.values()]
        return f'{"_".join(names_in_file_name)}{date}.{file_format}'

    def chek_file_name(self, file_name: Any) -> bool:
        """
        Проверяет название файла:
        -Название является строкой
        -Допустимый формат файла
        """
        if isinstance(file_name, str):
            if file_name.split(".")[-1] in self.FORMATS:
                return True
        return False

    def prepair_img(
        self, image: SimpleUploadedFile, file_name: Optional[str] = None
    ) -> File:
        """
        Подготавливает картинку для добавления в бд:
        -Изменяет размер
        -Изменяет формат
        -Создает название файла, если оно не было дано или не является валидным
        """
        img_settings = settings.BASE_IMAGE_SETTINGS

        if not self.chek_file_name(file_name=file_name):
            file_name = self.create_file_name(
                date=True, file_format=img_settings["FORMAT"].lower()
            )

        img = Image.open(image)

        img.thumbnail(img_settings["SIZE"])

        thumb_io = BytesIO()
        img.save(thumb_io, img_settings["FORMAT"])
        image = File(thumb_io, name=file_name)

        return image

    def add_watermark(
        self, image: SimpleUploadedFile, file_name: Optional[str] = None
    ) -> File:
        """
        <-Для нормальной работы все картинки должны быть одинкового размера->
        Добавляет вотермарку на картинку:
        -Приклеивает изображение вотермарки на картинку
        -Изменяет формат
        -Создает название файла, если оно не было дано или не является валидным
        """
        img_settings = settings.WATERMARK

        if not self.chek_file_name(file_name=file_name):
            file_name = self.create_file_name(
                date=True, file_format=img_settings["FORMAT"].lower()
            )

        img = Image.open(image)

        watermark = Image.open(
            f"{img_settings['WATERMARK_URL']}/{img_settings['WATERMARK_FILE_NAME']}"
        ).convert("RGBA")
        watermark.thumbnail((150, 150))
        img.paste(watermark, (img.width - watermark.width - img_settings['WATERMARK_INDENT'], img.height - watermark.height - img_settings['WATERMARK_INDENT']), watermark)
        img.paste(watermark, (img_settings['WATERMARK_INDENT'], img_settings['WATERMARK_INDENT']), watermark)

        thumb_io = BytesIO()
        img.save(thumb_io, img_settings["FORMAT"])
        image = File(thumb_io, name=file_name)

        return image

    def create_avatar_using_name(
        self, first_name: str = "Anon", last_name: str = "Anon"
    ) -> File:
        """
        Создает с нуля картинку с аватаркой:
        -Создает фон, выбрав рандомный цвет из данных
        -Вставляет 2 буквы: первая буква имени и фамилии пользователя
        """
        if len(first_name) == 0:
            first_name = "Anon"
        if len(last_name) == 0:
            last_name = "Anon"

        avatar_settings = settings.AVATAR

        first_name_letter = first_name.strip()[0].upper()
        last_name_letter = last_name.strip()[0].upper()
        file_name = self.create_file_name(date=True, file_format="png")
        text = first_name_letter + last_name_letter
        color = random.choice(avatar_settings["COLORS"]).upper()

        img = Image.new("RGB", avatar_settings["SIZE"], color=(color))
        font = ImageFont.truetype(
            f"{avatar_settings['FONT_URL']}/" f"{avatar_settings['FONT_FILE_NAME']}",
            size=avatar_settings["FONT_SIZE"],
        )
        draw_text = ImageDraw.Draw(img)

        draw_text.text(
            avatar_settings["FONT_INDENTS"],
            text,
            font=font,
            fill=avatar_settings["FONT_FILL"],
        )

        thumb_io = BytesIO()
        img.save(thumb_io, "PNG")
        avatar = File(thumb_io, name=file_name)

        return avatar
