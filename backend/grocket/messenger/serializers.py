from django.utils.translation import gettext_lazy as _
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from api.products.serializers import ProductImageSerializer
from products.selectors import get_avilable_product_or_none, get_product_images
from users.services import UserService

from .selectors import (
    get_answer_to_message_or_none,
    get_last_message,
    get_unseen_messages_count_by_chat,
)

users_services = UserService()


class MessageLastInChat(serializers.Serializer):
    id = serializers.IntegerField()
    text = serializers.CharField()
    pub_date = serializers.DateTimeField()
    is_seen = serializers.BooleanField()


class MessageAnswerToSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    text = serializers.CharField()
    image = Base64ImageField()


class MessageListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    author = serializers.PrimaryKeyRelatedField(read_only=True)
    text = serializers.CharField()
    image = Base64ImageField()
    answer_to = serializers.SerializerMethodField()
    pub_date = serializers.DateTimeField()
    is_edited = serializers.BooleanField()
    is_seen = serializers.BooleanField()

    def get_answer_to(self, obj):
        answer = get_answer_to_message_or_none(message_id=obj.id)
        if answer is not None:
            serializer = MessageAnswerToSerializer(instance=answer, read_only=True)
            return serializer.data


class MessageCreateSerializer(serializers.Serializer):
    answer_to = serializers.IntegerField(allow_null=True)
    text = serializers.CharField(allow_null=True, max_length=300)
    image = Base64ImageField(allow_null=True)

    def validate(self, data):
        if data["text"] is not None and data["image"] is not None:
            raise serializers.ValidationError(
                _("You can not send both a picture and a message together")
            )
        if data["text"] is None and data["image"] is None:
            raise serializers.ValidationError(
                _("You can not send message without text and picture")
            )
        return data


class ChatListUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    avatar = Base64ImageField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    country = serializers.CharField()


class ChatListProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    slug = serializers.SlugField()
    name = serializers.CharField()
    price = serializers.FloatField()
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        images = get_product_images(product_id=obj.id).filter(is_main=True).first()
        serializer = ProductImageSerializer(instance=images, read_only=True)
        return serializer.data


class ChatListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    user = serializers.SerializerMethodField()
    product = serializers.SerializerMethodField()
    unseen_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    def _choice_user(self, user_id, obj):
        """Выбирает юзера существующего в чате но отличного от запрашивающего."""
        return obj.user_from_id if obj.user_from_id != user_id else obj.user_to_id

    def get_last_message(self, obj):
        message = get_last_message(chat_id=obj.id)
        if message is not None:
            serializer = MessageLastInChat(instance=message, read_only=True)
            return serializer.data

    def get_unseen_count(self, obj):
        user_id = self.context["request"].user.id
        return get_unseen_messages_count_by_chat(chat_id=obj.id, user_id=user_id)

    def get_user(self, obj):
        user_id = self.context["request"].user.id
        author = self._choice_user(user_id=user_id, obj=obj)
        user = users_services.get_user_or_404(id=author)
        serializer = ChatListUserSerializer(instance=user, read_only=True)
        return serializer.data

    def get_product(self, obj):
        product = get_avilable_product_or_none(product_id=obj.product_id)
        if product is not None:
            serializer = ChatListProductSerializer(instance=product, read_only=True)
            return serializer.data
