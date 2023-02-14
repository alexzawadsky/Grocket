from django.contrib import admin
from django_mptt_admin.admin import DjangoMpttAdmin

from .models import Category, Comment, Favourite, Image, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'pk', 'name', 'user', 'price', 'pub_date',
        'is_archived', 'is_sold',
    )
    search_fields = ('name', 'user', 'price',)
    list_filter = ('user', 'price', 'pub_date',)
    empty_value_display = '-empty-'
    # prepopulated_fields = {'title': ('name',)}


@admin.register(Category)
class CategoryAdmin(DjangoMpttAdmin):
    # prepopulated_fields = {'title': ('title',)}
    pass


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'product', 'rate',)
    search_fields = ('user', 'product', 'rate',)
    list_filter = ('user', 'product', 'rate',)
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
