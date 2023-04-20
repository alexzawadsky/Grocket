from comments.models import Status
from modeltranslation.translator import TranslationOptions, register


@register(Status)
class StatusTranslationOptions(TranslationOptions):
    fields = ('title',)
