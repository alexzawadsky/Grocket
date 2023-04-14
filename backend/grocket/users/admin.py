from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "is_staff",
        "email",
        "first_name",
        "last_name",
        "phone",
        "country",
    )
    list_filter = ("email",)
    search_fields = (
        "pk",
        "email",
        "first_name",
        "last_name",
        "phone",
        "country",
    )
    empty_value_display = "-empty-"
