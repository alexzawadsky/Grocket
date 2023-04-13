from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response


class CommentViewSet(CommentMixin):
    def destroy(self, request, pk):
        user_id = self.request.user.id
        comments_services.delete_comment(user_id=user_id, comment_id=pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def create(self, request):
        request.data["user"] = self.request.user.id

        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)

        comments_services.create_comment(**serializer.data)
        return Response(status=status.HTTP_201_CREATED)

    @action(["get"], detail=False)
    def me_comments(self, request):
        user = self.request.user
        queryset = self.filter_queryset(comments_services.get_comments(seller=user))
        return super().list(request, queryset)

    @action(["get"], detail=False)
    def user_comments(self, request, pk):
        user = users_services.get_user_or_404(id=pk)
        queryset = self.filter_queryset(comments_services.get_comments(seller=user))
        return super().list(request, queryset)

    @action(["post", "delete"], detail=True)
    def reply(self, request, pk):
        if request.method == "POST":
            request.data["comment"] = pk
            request.data["user"] = self.request.user.id

            serializer = self.get_serializer_class()(data=request.data)
            serializer.is_valid(raise_exception=True)

            comments_services.reply_to_comment(**serializer.data)
            return Response(status=status.HTTP_201_CREATED)

        if request.method == "DELETE":
            user_id = self.request.user.id
            comments_services.delete_reply(user_id=user_id, reply_id=pk)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(["get"], detail=False)
    def statuses(self, request):
        statuses = comments_services.get_statuses()

        serializer = self.get_serializer_class()(
            instance=statuses, many=True, read_only=True
        )

        return Response(serializer.data, status=status.HTTP_200_OK)
