from django.contrib import admin
from modeltranslation.admin import TranslationAdmin

from comments.models import Comment, CommentImage, CommentReply, Status


@admin.register(Status)
class StatusAdmin(TranslationAdmin):
    list_display = (
        "pk",
        "title",
        "name",
    )
    search_fields = (
        "title",
        "name",
    )
    empty_value_display = "-empty-"


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "user",
        "seller",
        "product",
        "status",
        "short_text",
        "rate",
        "pub_date",
    )
    search_fields = ("text",)
    list_filter = (
        "user",
        "seller",
        "product",
        "status",
        "rate",
        "pub_date",
    )
    empty_value_display = "-empty-"

    @admin.display(description="text")
    def short_text(self, obj):
        text = obj.text
        max_letters = 15
        return text[:max_letters] + ("..." if len(text) > max_letters else "")


@admin.register(CommentReply)
class CommentReplyAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "user",
        "comment",
        "short_text",
        "pub_date",
    )
    search_fields = ("text",)
    list_filter = (
        "user",
        "comment",
        "pub_date",
    )
    empty_value_display = "-empty-"

    @admin.display(description="text")
    def short_text(self, obj):
        text = obj.text
        max_letters = 30
        return text[:max_letters] + ("..." if len(text) > max_letters else "")


@admin.register(CommentImage)
class CommentImageAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "comment",
    )
    list_filter = ("comment",)
    empty_value_display = "-empty-"
