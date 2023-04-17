from ckeditor.widgets import CKEditorWidget
from django import forms
from django.contrib import admin, messages
from django_mptt_admin.admin import DjangoMpttAdmin
from modeltranslation.admin import TranslationAdmin

from .models import (Category, Favourite, Image, Product, ProductAddress,
                     Promotion)


class PostAdminForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorWidget())

    class Meta:
        model = Product
        fields = "__all__"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "short_name",
        "user",
        "category",
        "price",
        "price_currency",
        "pub_date",
        "is_archived",
        "is_sold",
    )
    search_fields = (
        "name",
        "description",
    )
    list_filter = (
        "user",
        "pub_date",
        "is_archived",
        "is_sold",
        "promotions",
    )
    prepopulated_fields = {"slug": ("name",)}
    date_hierarchy = "pub_date"
    empty_value_display = "-empty-"
    form = PostAdminForm
    save_on_top = True
    actions = [
        "sell_products",
        "unsell_products",
        "archive_products",
        "unarchive_products",
    ]

    @admin.display(description="name")
    def short_name(self, obj):
        name = obj.name
        max_letters = 20
        return name[:max_letters] + ("..." if len(name) > max_letters else "")

    def _action(self, request, queryset, message, **fields):
        queryset.update(**fields)
        count = queryset.count()
        product_word = "products were" if count > 1 else "product was"
        self.message_user(
            request, f"{count} {product_word} {message}.", messages.SUCCESS
        )

    @admin.action(description="Mark as sold")
    def sell_products(self, request, queryset):
        message = "successfully marked as sold"
        self._action(request, queryset, message, is_sold=True)

    @admin.action(description="Remove from sold")
    def unsell_products(self, request, queryset):
        message = "successfully removed from sold"
        self._action(request, queryset, message, is_sold=False)

    @admin.action(description="Archive")
    def archive_products(self, request, queryset):
        message = "successfully added to archive"
        self._action(request, queryset, message, is_archived=True)

    @admin.action(description="Remove from archive")
    def unarchive_products(self, request, queryset):
        message = "successfully removed from archive"
        self._action(request, queryset, message, is_archived=False)


@admin.register(ProductAddress)
class ProductAddressAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "product",
        "full",
        "city",
        "country_code",
        "latitude",
        "longitude",
    )
    search_fields = (
        "full",
        "city",
        "country_code",
    )
    list_filter = (
        "product",
        "country_code",
        "city",
    )
    empty_value_display = "-empty-"


@admin.register(Category)
class CategoryAdmin(TranslationAdmin, DjangoMpttAdmin):
    list_display = (
        "pk",
        "title",
        "parent",
    )
    search_fields = ("title",)
    empty_value_display = "-empty-"


@admin.register(Favourite)
class FavouriteAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "user",
        "product",
    )
    search_fields = (
        "user",
        "product",
    )
    list_filter = (
        "user",
        "product",
    )
    empty_value_display = "-empty-"


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "product",
        "is_main",
    )
    search_fields = ("product",)
    list_filter = (
        "product",
        "is_main",
    )
    empty_value_display = "-empty-"


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "name",
        "price",
    )
    search_fields = ("name",)
    empty_value_display = "-empty-"
