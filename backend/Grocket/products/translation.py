from modeltranslation.translator import register, TranslationOptions
from products.models import Category, Promotion


@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ('title',)


@register(Promotion)
class PromotionTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)
