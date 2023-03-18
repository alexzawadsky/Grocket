from django.db.models import QuerySet, Manager, Model
from django.shortcuts import get_object_or_404
from comments.models import Comment


class CommentService:
    def create_comment(self):
        pass

    def reply_to_comment(self):
        pass

    def get_comments(self, **kwargs) -> QuerySet[Comment]:
        return Comment.objects.filter(**kwargs)

    def get_replies_to_comment(self):
        pass

    def get_all_statuses(self):
        pass
