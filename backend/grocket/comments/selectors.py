from core.utils import http_404_logger
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404

from .models import Comment, CommentImage, CommentReply, Status


def get_statuses(**fields) -> QuerySet[Status]:
    return Status.objects.filter(**fields)


def get_comments(**fields) -> QuerySet[Comment]:
    return Comment.objects.filter(**fields)


@http_404_logger
def get_comment_images(comment_id: int, **fields) -> QuerySet[CommentImage]:
    comment = get_object_or_404(Comment, id=comment_id)
    return CommentImage.objects.filter(comment=comment, **fields)


@http_404_logger
def get_reply_to_comment(comment_id: int, **fields) -> CommentReply:
    return CommentReply.objects.filter(comment__id=comment_id, **fields).first()
