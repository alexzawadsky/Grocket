from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'pk', 'is_staff', 'username', 'email',
        'first_name', 'last_name', 'phone', 'country',
    )
    list_filter = ('username', 'email',)
    search_fields = (
        'pk', 'username', 'email',
        'first_name', 'last_name',
        'phone', 'country',
    )
    empty_value_display = '-empty-'
