from django.contrib.auth import get_user_model
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from comments.selectors import get_comment_images, get_reply_to_comment
from products.models import Product

User = get_user_model()


# ref
class ProductCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "id",
            "name",
        )


class CommentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
        )


# ref
class CommentImageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    image = Base64ImageField(read_only=True)

    class Meta:
        fields = (
            "id",
            "image",
        )


# ref
class CommentImageCreateSerializer(serializers.Serializer):
    image = Base64ImageField()

    class Meta:
        fields = ("image",)


# ref
class StatusSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.SlugField()
    title = serializers.CharField()

    class Meta:
        fields = (
            "id",
            "title",
            "name",
        )


# ref
class CommentReplyCreateSerializer(serializers.Serializer):
    user = serializers.IntegerField()
    comment = serializers.IntegerField()
    text = serializers.CharField()

    class Meta:
        fields = (
            "user",
            "comment",
            "text",
        )


# ref
class CommentReplyReadOnlySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    text = serializers.CharField()
    user = CommentUserSerializer(read_only=True)
    pub_date = serializers.DateTimeField()

    class Meta:
        fields = (
            "id",
            "user",
            "text",
            "pub_date",
        )


# ref
class CommentReadOnlySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    rate = serializers.IntegerField(max_value=5, min_value=1)
    text = serializers.CharField()
    user = CommentUserSerializer(read_only=True)
    seller = CommentUserSerializer(read_only=True)
    product = ProductCommentSerializer(read_only=True)
    status = StatusSerializer(read_only=True)
    images = serializers.SerializerMethodField()
    reply = serializers.SerializerMethodField()
    pub_date = serializers.DateTimeField()

    class Meta:
        fields = (
            "id",
            "status",
            "rate",
            "text",
            "images",
            "reply",
            "user",
            "seller",
            "product",
            "pub_date",
        )

    def get_reply(self, obj):
        reply = get_reply_to_comment(comment_id=obj.id)
        if reply is None:
            return None
        serializer = CommentReplyReadOnlySerializer(instance=reply, read_only=True)
        return serializer.data

    def get_images(self, obj):
        images = get_comment_images(comment_id=obj.id)
        serializer = CommentImageSerializer(instance=images, many=True, read_only=True)
        return serializer.data


# ref
class CommentCreateSerializer(serializers.Serializer):
    user = serializers.IntegerField()
    product = serializers.IntegerField()
    images = serializers.ListField(required=False)
    rate = serializers.IntegerField(max_value=5, min_value=1)
    text = serializers.CharField(required=False)
    status = serializers.IntegerField()

    class Meta:
        fields = (
            "user",
            "product",
            "images",
            "rate",
            "text",
            "status",
        )

    def validate_images(self, value):
        serializer = CommentImageCreateSerializer(data=value, many=True)
        serializer.is_valid(raise_exception=True)
        images = [image["image"] for image in serializer.validated_data]
        return images
