import re

from api.users.serializers import CustomUserSerializer
from django.utils.translation import gettext_lazy as _
from drf_extra_fields.fields import Base64ImageField
from products.models import Category
from products.selectors import (
    get_ancestors_by_category,
    get_is_favourited,
    get_product_address,
    get_product_category,
    get_product_images,
    get_product_promotions,
    get_favourites_count,
)
from rest_framework import serializers
from users.services import UserService

users_services = UserService()


# ref
class PromotionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.SlugField()
    title = serializers.CharField()
    price = serializers.IntegerField(min_value=0)
    description = serializers.CharField()

    class Meta:
        fields = (
            "id",
            "name",
            "title",
            "price",
            "description",
        )


# ref
class PromotionCreateUpdateSerializer(serializers.Serializer):
    promotions = serializers.ListField()

    class Meta:
        fields = ("promotions",)

    def validate_promotions(self, value):
        for promotion in value:
            if not isinstance(promotion, int):
                raise serializers.ValidationError(_(f"`{promotion}` is not integer"))
        return value


# ref
class CategoryListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    parent = serializers.SerializerMethodField()
    is_lower = serializers.SerializerMethodField()

    class Meta:
        fields = (
            "id",
            "title",
            "parent",
            "is_lower",
        )

    def get_parent(self, obj):
        if obj.parent is not None:
            return obj.parent.id
        return None

    def get_is_lower(self, obj):
        return obj.is_leaf_node()


# ref
class ProductCategorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    parents = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = (
            "id",
            "title",
            "parents",
        )

    def get_parents(self, obj):
        parents = get_ancestors_by_category(category_id=obj.id)
        serializer = CategoryListSerializer(instance=parents, many=True)
        return serializer.data


# ref
class ProductImageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    image = Base64ImageField(allow_null=True, required=False)
    is_main = serializers.BooleanField()

    class Meta:
        fields = (
            "id",
            "image",
            "is_main",
        )


class ProductImageCreateSerializer(serializers.Serializer):
    image = Base64ImageField()
    is_main = serializers.BooleanField()

    class Meta:
        fields = (
            "image",
            "is_main",
        )


# ref
class ProductAddressCreateUpdateSerializer(serializers.Serializer):
    full = serializers.CharField(max_length=100)
    short = serializers.CharField(max_length=70)
    city = serializers.CharField(required=False, max_length=30)
    country_code = serializers.CharField(max_length=2)
    latitude = serializers.FloatField(max_value=90.0, min_value=-90.0)
    longitude = serializers.FloatField(max_value=180.0, min_value=-180.0)

    class Meta:
        fields = (
            "full",
            "city",
            "country_code",
            "latitude",
            "longitude",
        )


# ref
class ProductAddressRetrieveSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    full = serializers.CharField()
    city = serializers.CharField()
    short = serializers.CharField()
    country_code = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()

    class Meta:
        fields = (
            "id",
            "full",
            "short",
            "city",
            "country_code",
            "latitude",
            "longitude",
        )


# ref
class ProductAddressListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    short = serializers.CharField()
    country_code = serializers.CharField()
    city = serializers.CharField()

    class Meta:
        fields = (
            "id",
            "short",
            "city",
            "country_code",
        )


# ref
class ProductReadOnlySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    slug = serializers.SlugField()
    price = serializers.IntegerField(min_value=0)
    is_archived = serializers.BooleanField()
    is_sold = serializers.BooleanField()
    pub_date = serializers.DateTimeField()
    is_favourited = serializers.SerializerMethodField()
    promotions = serializers.SerializerMethodField()

    def get_is_favourited(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return get_is_favourited(user_id=user.id, product_id=obj.id)
        return False

    def get_promotions(self, obj):
        promotions = get_product_promotions(product_id=obj.id).values_list(
            "name", flat=True
        )
        return list(promotions)


# ref
class ProductRetrieveSerializer(ProductReadOnlySerializer):
    description = serializers.CharField()
    category = ProductCategorySerializer(read_only=True)
    images = serializers.SerializerMethodField()
    user = CustomUserSerializer(read_only=True)
    address = serializers.SerializerMethodField()
    favourites_count = serializers.SerializerMethodField()

    class Meta:
        fields = (
            "id",
            "name",
            "slug",
            "user",
            "address",
            "description",
            "price",
            "is_archived",
            "is_sold",
            "is_favourited",
            "favourites_count",
            "category",
            "images",
            "pub_date",
            "promotions",
        )

    def get_favourites_count(self, obj):
        user = self.context["request"].user
        if user.is_authenticated:
            return get_favourites_count(product_id=obj.id, user_id=user.id)
        return None

    def get_address(self, obj):
        address = get_product_address(product_id=obj.id)
        serializer = ProductAddressRetrieveSerializer(instance=address, read_only=True)
        return serializer.data

    def get_images(self, obj):
        images = get_product_images(product_id=obj.id).order_by("-is_main")
        serializer = ProductImageSerializer(instance=images, read_only=True, many=True)
        return serializer.data


# ref
class ProductListSerializer(ProductReadOnlySerializer):
    description = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()

    class Meta:
        fields = (
            "id",
            "name",
            "slug",
            "user",
            "description",
            "price",
            "address",
            "is_archived",
            "is_sold",
            "is_favourited",
            "category",
            "images",
            "pub_date",
            "promotions",
        )

    def get_address(self, obj):
        address = get_product_address(product_id=obj.id)
        serializer = ProductAddressListSerializer(instance=address, read_only=True)
        return serializer.data

    def get_category(self, obj):
        category = get_product_category(product_id=obj.id)
        serializer = CategoryListSerializer(instance=category, read_only=True)
        return serializer.data

    def get_user(self, obj):
        user = users_services.get_user_or_404(id=obj.user_id)
        serializer = CustomUserSerializer(instance=user, read_only=True)
        return serializer.data

    def get_description(self, obj):
        return obj.description[:200]

    def get_images(self, obj):
        images = get_product_images(product_id=obj.id).order_by("-is_main")[:3]
        serializer = ProductImageSerializer(instance=images, read_only=True, many=True)
        return serializer.data


# ref
class ProductCreateSerializer(serializers.Serializer):
    images = serializers.ListField(max_length=8)
    name = serializers.CharField(max_length=100)
    user = serializers.IntegerField()
    description = serializers.CharField(max_length=5000)
    price = serializers.IntegerField(min_value=0)
    category = serializers.IntegerField()
    address = ProductAddressCreateUpdateSerializer()

    class Meta:
        fields = (
            "name",
            "user",
            "description",
            "price",
            "category",
            "images",
        )

    def validate_name(self, value):
        if not re.match('^[a-zA-Z0-9_ !"#$%&()*+,-./:;<=>?@[\]^_`{|}~]+$', value):
            raise serializers.ValidationError(
                _("Only latin letters, numbers and punctuation marks can be used")
            )
        return value

    def validate_images(self, value):
        serializer = ProductImageCreateSerializer(data=value, many=True)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data


class ProductUpdateSerializer(serializers.Serializer):
    pass
    # images = ProductImagesUpdateField(required=False)
    # name = serializers.CharField(required=False)
    # description = serializers.CharField(required=False)
    # price = serializers.IntegerField(min_value=0)
    # address = serializers.CharField(required=False)
    # category = serializers.IntegerField(required=False)

    # class Meta:
    #     fields = (
    #         "name",
    #         "description",
    #         "price",
    #         "address",
    #         "category",
    #         "images",
    #     )

    # # Не работает
    # def validate_images(self, value):
    #     product_id = self.context["product_id"]
    #     try:
    #         products_services.check_product_images_update_logic(
    #             images=value, product_id=product_id
    #         )
    #     except ValidationError as error:
    #         raise serializers.ValidationError(error.messages)

    #     images_album, new_images = value
    #     images = []
    #     for image in new_images:
    #         images.append({"image": image, "is_main": new_images[image]})

    #     serializer = ProductImageCreateSerializer(data=images, many=True)
    #     serializer.is_valid(raise_exception=True)
    #     return serializer.validated_data

    # def creating_images(self, new_images, product):
    #     super().creating_images(new_images.items(), product)

    # def _images_updating(self, images, instance):
    #     """Запускает все манипудяции с обновлением картинок."""
    #     # (images_album - старые, new_images - которые надо создать)
    #     images_album, new_images = images
    #     # Удаляем картинки, которые юзер удалил
    #     Image.objects.filter(product=instance).exclude(
    #         id__in=images_album.keys()
    #     ).delete()
    #     # Берем все картинки после удаления
    #     images_after_deleting = Image.objects.filter(product=instance).only(
    #         "id", "is_main"
    #     )
    #     # Меняем все is_main
    #     for image_after_deleting in images_after_deleting:
    #         if image_after_deleting.id in images_album.keys():
    #             image_after_deleting.is_main = images_album[image_after_deleting.id]
    #             image_after_deleting.save()
    #     # Создаем новые картинки
    #     self.creating_images(new_images, instance)

    # def update(self, instance, validated_data):
    #     images = validated_data.get("images")

    #     if images is not None:
    #         images = validated_data.pop("images")

    #         instance = super().update(instance, validated_data)
    #         self._images_updating(images, instance)

    #         return instance

    #     return super().update(instance, validated_data)
