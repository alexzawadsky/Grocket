from modeltranslation.translator import TranslationOptions, register

from comments.models import Status


@register(Status)
class StatusTranslationOptions(TranslationOptions):
    fields = ('title',)
