from modeltranslation.translator import TranslationOptions, register
from products.models import Category, Promotion


@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ('title',)


@register(Promotion)
class PromotionTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)
