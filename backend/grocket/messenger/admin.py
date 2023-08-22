from django.contrib import admin

from .models import Chat, Message


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "user_from",
        "user_to",
        "product",
    )
    empty_value_display = "-empty-"


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "author",
        "chat",
        "answer_to",
        "pub_date",
        "is_edited",
        "is_seen",
    )
    search_fields = ("text",)
    list_filter = ("is_edited",)
    empty_value_display = "-empty-"
