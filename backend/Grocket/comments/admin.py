from django.contrib import admin
from modeltranslation.admin import TranslationAdmin

from comments.models import Comment, CommentImage, CommentReply, Status


@admin.register(Status)
class StatusAdmin(TranslationAdmin):
    list_display = ('pk', 'title', 'name',)
    search_fields = ('title', 'name',)
    empty_value_display = '-empty-'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'product', 'rate',)
    search_fields = ('user', 'product', 'rate',)
    list_filter = ('user', 'product', 'rate',)
    empty_value_display = '-empty-'


@admin.register(CommentReply)
class CommentReplyAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'comment',)
    search_fields = ('user', 'comment', 'text',)
    list_filter = ('user', 'comment',)
    empty_value_display = '-empty-'


@admin.register(CommentImage)
class CommentImageAdmin(admin.ModelAdmin):
    list_display = ('pk', 'comment',)
    list_filter = ('comment',)
    empty_value_display = '-empty-'
