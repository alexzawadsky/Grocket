from PIL import Image, ImageDraw, ImageFont
import random


AVATAR = {
    'COLORS': [
        'fbf8cc',
        'fde4cf',
        'ffcfd2',
        'f1c0e8',
        'cfbaf0',
        'a3c4f3',
        '90dbf4',
        '8eecf5',
        '98f5e1',
        'b9fbc0',
    ],
    'SIZE': (500, 500),
    'FONT': 'fonts/arial_black.ttf',
    'FONT_SIZE': 200,
    'FONT_INDENTS': (100, 100),
    'FONT_FILL': '#1C0606',
}
# COLORS = [
#     'fbf8cc',
#     'fde4cf',
#     'ffcfd2',
#     'f1c0e8',
#     'cfbaf0',
#     'a3c4f3',
#     '90dbf4',
#     '8eecf5',
#     '98f5e1',
#     'b9fbc0',
# ]
# SIZE = (500, 500)
# FONT = 'fonts/arial_black.ttf'
# FONT_SIZE = 200
# FONT_INDENTS = (100, 100)
# FONT_FILL = '#1C0606'


def avatar_img_creating(first_name, last_name):
    text = first_name[0] + last_name[0]
    color = '#' + random.choice(AVATAR['COLORS']).upper()

    img = Image.new('RGB', AVATAR['SIZE'], color=(color))
    font = ImageFont.truetype(AVATAR['FONT'], size=AVATAR['FONT_SIZE'])
    draw_text = ImageDraw.Draw(img)

    draw_text.text(
        AVATAR['FONT_INDENTS'],
        text,
        font=font,
        fill=AVATAR['FONT_FILL']
    )

    return img
