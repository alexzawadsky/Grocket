from django.contrib import admin
from django_mptt_admin.admin import DjangoMpttAdmin
from modeltranslation.admin import TranslationAdmin

from .models import Category, Favourite, Image, Product, Promotion


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'pk', 'name', 'user', 'price', 'pub_date',
        'is_archived', 'is_sold',
    )
    search_fields = ('name', 'user', 'price',)
    list_filter = ('user', 'price', 'pub_date',)
    empty_value_display = '-empty-'


@admin.register(Category)
class CategoryAdmin(TranslationAdmin, DjangoMpttAdmin):
    list_display = ('pk', 'title', 'parent',)
    search_fields = ('title',)
    empty_value_display = '-empty-'


@admin.register(Favourite)
class FavouriteAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'product',)
    search_fields = ('user', 'product',)
    list_filter = ('user', 'product',)
    empty_value_display = '-empty-'


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('pk', 'product', 'is_main',)
    search_fields = ('product',)
    list_filter = ('product', 'is_main',)
    empty_value_display = '-empty-'


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name', 'price',)
    search_fields = ('name',)
    empty_value_display = '-empty-'
