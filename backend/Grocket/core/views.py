from PIL import Image, ImageDraw, ImageFont
from django.conf import settings
import random


avatar = settings.AVATAR


def avatar_img_creating(first_name, last_name):
    text = first_name[0] + last_name[0]
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

    return img
