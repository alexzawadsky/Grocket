from modeltranslation.translator import register, TranslationOptions
from products.models import Category

@register(Category)
class NewsTranslationOptions(TranslationOptions):
    fields = ('title',)
