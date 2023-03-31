import bleach
from ckeditor.fields import RichTextField


ALLOWED_TAGS = set(bleach.ALLOWED_TAGS + ['s', 'em', 'strong', 'u'])
ALLOWED_ATTRIBUTES = {}
ALLOWED_ATTRIBUTES.update(bleach.ALLOWED_ATTRIBUTES)
ALLOWED_ATTRIBUTES.update({})


def bleach_clean(html):
    return bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        strip=True
    )


class RichTextBleachField(RichTextField):
    def __init__(self, *args, **kwargs):
        super(RichTextBleachField, self).__init__(*args, **kwargs)

    def to_python(self, value):
        return bleach_clean(value)
