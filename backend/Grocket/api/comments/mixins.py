class CommentMixin(CreateModelMixin, DestroyModelMixin, BaseMixin):
    pagination_class = CommentPageLimitPagination

    def get_permissions(self):
        if self.action in (
            "user_comments",
            "statuses",
        ):
            self.permission_classes = (permissions.AllowAny,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in (
            "user_comments",
            "me_comments",
        ):
            return CommentReadOnlySerializer
        elif self.action in ("create",):
            return CommentCreateSerializer
        elif self.action in ("reply",):
            return CommentReplyCreateSerializer
        elif self.action in ("statuses",):
            return StatusSerializer
