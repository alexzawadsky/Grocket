from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'pk', 'is_staff', 'username', 'email',
        'first_name', 'last_name', 'phone',
    )
    list_filter = ('username', 'email',)
    search_fields = (
        'pk', 'username', 'email',
        'first_name', 'last_name',
    )
    empty_value_display = '-пусто-'
