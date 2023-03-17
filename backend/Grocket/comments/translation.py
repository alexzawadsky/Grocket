from modeltranslation.translator import TranslationOptions, register

from comments.models import CommentStatus


@register(CommentStatus)
class CommentStatusTranslationOptions(TranslationOptions):
    fields = ('name',)
