import random
from datetime import datetime
from io import BytesIO
from typing import Optional

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files import File
from django.core.files.uploadedfile import SimpleUploadedFile
from django.shortcuts import get_object_or_404
from PIL import Image, ImageDraw, ImageFont

User = get_user_model()


class UserService:
    def get_user_or_404(self, **kwargs) -> User:
        return get_object_or_404(User, **kwargs)

    def create_avatar(
        self, first_name: str, last_name: str, avatar: Optional[SimpleUploadedFile]
    ) -> File:
        file_name = self.create_avatar_file_name()
        if avatar is None:
            return self.create_avatar_img(first_name, last_name, file_name)
        return self.prepair_avatar_img(avatar, file_name)

    def create_avatar_file_name(self) -> str:
        date = datetime.date(datetime.now())
        return f"{date}.png"

    def prepair_avatar_img(self, avatar: SimpleUploadedFile, file_name: str) -> File:
        avatar_settings = settings.AVATAR

        img = Image.open(avatar)
        img.convert("RGB")
        img.resize(avatar_settings["SIZE"])
        thumb_io = BytesIO()
        img.save(thumb_io, "PNG")
        avatar = File(thumb_io, name=file_name)

        return avatar

    def create_avatar_img(
        self, first_name: str, last_name: str, file_name: str
    ) -> File:
        avatar_settings = settings.AVATAR

        text = first_name[0].upper() + last_name[0].upper()
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
