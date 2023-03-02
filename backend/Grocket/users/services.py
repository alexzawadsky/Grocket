import base64
import random
from io import BytesIO

from django.conf import settings
from PIL import Image, ImageDraw, ImageFont

avatar = settings.AVATAR


class UserService:
    def avatar_img_creating(first_name, last_name):
        text = first_name[0].upper() + last_name[0].upper()
        color = '#' + random.choice(avatar['COLORS']).upper()

        img = Image.new('RGB', avatar['SIZE'], color=(color))
        font = ImageFont.truetype(avatar['FONT'], size=avatar['FONT_SIZE'])
        draw_text = ImageDraw.Draw(img)

        draw_text.text(
            avatar['FONT_INDENTS'],
            text,
            font=font,
            fill=avatar['FONT_FILL']
        )

        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue())
        img_base64 = (
            bytes("data:image/jpeg;base64,", encoding='utf-8') +
            img_str
        )
        img_base64_str = img_base64.decode("utf-8")

        return img_base64_str
