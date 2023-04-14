from django.shortcuts import get_object_or_404

from ..models import Comment, CommentReply


class BaseCommentService:
    def __init__(self, comment_id: int) -> None:
        self.comment_id: int = comment_id
        self.comment: Comment = self._get_comment_or_404(comment_id=comment_id)

    def _get_comment_or_404(self, comment_id: int) -> Comment:
        return get_object_or_404(Comment, id=comment_id)


class BaseCommentReplyService:
    def __init__(self, reply_id: int) -> None:
        self.reply_id: int = reply_id
        self.reply: CommentReply = self._get_reply_or_404(reply_id=reply_id)

    def _get_reply_or_404(self, reply_id: int) -> CommentReply:
        return get_object_or_404(CommentReply, id=reply_id)
