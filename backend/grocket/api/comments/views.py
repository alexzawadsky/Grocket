from django.db import transaction
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from comments.selectors import get_comments, get_statuses
from comments.services.services import (CommentReplyService, CommentService,
                                        CreateCommentReplyService,
                                        CreateCommentService)

from .mixins import CommentMixin


class CommentViewSet(CommentMixin):
    def destroy(self, request, pk):
        user_id = self.request.user.id
        service = CommentService(comment_id=pk)
        service.delete(user_id=user_id)
        data = self.get_response_message()
        return Response(data, status=status.HTTP_200_OK)

    @transaction.atomic()
    def create(self, request):
        request.data["user"] = self.request.user.id
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = CreateCommentService()
        service.create(**serializer.data)
        data = self.get_response_message()
        return Response(data, status=status.HTTP_201_CREATED)

    @action(["get"], detail=False)
    def me_comments(self, request):
        user = self.request.user
        queryset = get_comments(seller=user)
        return super().list(request, queryset)

    @action(["get"], detail=False)
    def user_comments(self, request, pk):
        queryset = get_comments(seller__id=pk)
        return super().list(request, queryset)

    @action(["post", "delete"], detail=True)
    def reply(self, request, pk):
        if request.method == "POST":
            request.data["comment"] = pk
            request.data["user"] = self.request.user.id
            serializer = self.get_serializer_class()(data=request.data)
            serializer.is_valid(raise_exception=True)
            service = CreateCommentReplyService()
            service.reply_to_comment(**serializer.data)
            data = self.get_response_message(method="POST")
            return Response(data, status=status.HTTP_201_CREATED)

        if request.method == "DELETE":
            user = self.request.user
            service = CommentReplyService(reply_id=pk)
            service.delete(user_id=user.id)
            data = self.get_response_message(method="DELETE")
            return Response(data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(["get"], detail=False)
    def statuses(self, request):
        statuses = get_statuses()
        serializer = self.get_serializer_class()(
            instance=statuses, many=True, read_only=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)
