from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from django.contrib.auth import get_user_model
from djoser import serializers as djserializers

User = get_user_model()


class CustomUserSerializer(djserializers.UserSerializer):
    avatar = Base64ImageField(allow_null=True, required=False)
    rating = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    sold_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "rating",
            "comments_count",
            "sold_count",
            "email",
            "first_name",
            "last_name",
            "avatar",
            "phone",
            "country",
            "date_joined",
            "last_login",
        )

    def get_sold_count(self, obj):
        return obj.products.filter(is_sold=True).count()

    def get_comments_count(self, obj):
        return obj.seller_comments.count()

    def get_rating(self, obj):
        return obj.seller_comments.aggregate(Avg("rate"))["rate__avg"]

    def update(self, instance, validated_data):
        avatar = validated_data.get("avatar")
        if not instance.avatar or avatar is not None:
            first_name = instance.first_name
            last_name = instance.last_name
            avatar = users_services.create_avatar(
                avatar=avatar,
                first_name=first_name,
                last_name=last_name,
            )
            validated_data["avatar"] = avatar

        return super().update(instance, validated_data)


class CustomUserCreateSerializer(djserializers.UserCreateSerializer):
    avatar = Base64ImageField(allow_null=True, required=False)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
            "avatar",
            "phone",
            "country",
            "date_joined",
            "last_login",
        )
        read_only_fields = ("id",)

    def create(self, validated_data):
        avatar = validated_data.get("avatar")
        first_name = validated_data.get("first_name")
        last_name = validated_data.get("last_name")

        avatar = users_services.create_avatar(
            avatar=avatar,
            first_name=first_name,
            last_name=last_name,
        )
        validated_data["avatar"] = avatar

        return super().create(validated_data)
