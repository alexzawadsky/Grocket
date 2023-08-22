import re

from django.utils.translation import gettext_lazy as _
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from api.users.serializers import CustomUserSerializer
from images.services import ImageService
from products.models import Category, Image, Product, ProductAddress
from products.selectors import (get_ancestors_by_category,
                                get_favourites_count, get_is_favourited,
                                get_product_address, get_product_category,
                                get_product_images, get_product_promotions)
from products.services.services import CreateProductService
from users.services import UserService

from .fields import ProductImagesUpdateField

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


# удалить при рефакторинге апдейта
class ProductImageUpdateSerializer(serializers.ModelSerializer):
    image = Base64ImageField(allow_null=True, required=False)

    class Meta:
        model = Image
        fields = (
            "image",
            "is_main",
            "product",
        )

    def create(self, validated_data):
        service = ImageService()
        prepared_image = service.prepair_img(image=validated_data.get("image"))
        with_watermark = service.add_watermark(prepared_image)
        validated_data["image"] = with_watermark
        return super().create(validated_data)


# удалить при рефакторинге апдейта
class ProductAddressUpdateSerializer(serializers.ModelSerializer):
    full = serializers.CharField(max_length=100)
    short = serializers.CharField(max_length=70)
    city = serializers.CharField(required=False, max_length=30, allow_blank=True)
    country_code = serializers.CharField(max_length=2)
    latitude = serializers.FloatField(max_value=90.0, min_value=-90.0)
    longitude = serializers.FloatField(max_value=180.0, min_value=-180.0)

    class Meta:
        model = ProductAddress
        fields = (
            "full",
            "city",
            "short",
            "country_code",
            "latitude",
            "longitude",
        )


# ref
class ProductAddressCreateUpdateSerializer(serializers.Serializer):
    full = serializers.CharField(max_length=100)
    short = serializers.CharField(max_length=70)
    city = serializers.CharField(required=False, max_length=30, allow_blank=True)
    country_code = serializers.CharField(max_length=2)
    latitude = serializers.FloatField(max_value=90.0, min_value=-90.0)
    longitude = serializers.FloatField(max_value=180.0, min_value=-180.0)

    class Meta:
        fields = (
            "full",
            "city",
            "short",
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
    price = serializers.FloatField(min_value=0, max_value=3000000000)
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


class ProductUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=100, required=False)
    description = serializers.CharField(max_length=5000, required=False)
    price = serializers.FloatField(min_value=0, required=False, max_value=3000000000)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    address = ProductAddressUpdateSerializer(required=False)
    images = ProductImagesUpdateField(max_length=8, required=False)

    class Meta:
        model = Product
        fields = (
            "name",
            "address",
            "description",
            "price",
            "category",
            "images",
        )

    def validate_category(self, value):
        if not value.is_leaf_node():
            raise serializers.ValidationError(
                "Можно добавить только в конечную категорию."
            )

        return value

    def to_representation(self, instance):
        return instance.slug

    def validate_name(self, value):
        if not re.match('^[a-zA-Z0-9_ !"#$%&()*+,-./:;<=>?@[\]^_`{|}~]+$', value):
            raise serializers.ValidationError(
                _("Only latin letters, numbers and punctuation marks can be used")
            )
        return value

    def validate_images(self, value):
        product = self.instance
        images_album, new_images = value
        images_album_keys = list(images_album.keys())
        images_album_values = list(images_album.values())
        new_images_values = list(new_images.values())

        for image in images_album_keys:
            image_obj = Image.objects.filter(id=image)
            if not image_obj.exists():
                raise serializers.ValidationError(f"Картинки с id={image} нет.")
            if not image_obj.filter(product=product).exists():
                raise serializers.ValidationError(
                    f"Картинка с id={image} не от этого товара."
                )

        product_images = list(
            product.images.select_related()
            .exclude(id__in=images_album_keys)
            .filter(id__in=images_album_keys)
            .values_list("is_main", flat=True)
        )

        all_is_main = images_album_values + new_images_values + product_images

        if True not in all_is_main:
            raise serializers.ValidationError(
                "Надо добавить хотябы одну главную картинку."
            )
        if all_is_main.count(True) > 1:
            raise serializers.ValidationError(
                "Может быть только одна главная картинка."
            )

        return value

    def creating_images(self, new_images, product):
        for image in new_images.items():
            image_base64 = image[0]
            is_main = image[1]

            images_serializer = ProductImageUpdateSerializer(
                data={"image": image_base64, "is_main": is_main, "product": product.id}
            )
            images_serializer.is_valid(raise_exception=True)
            images_serializer.save()

    def _images_updating(self, images, instance):
        """Запускает все манипудяции с обновлением картинок."""
        # (images_album - старые, new_images - которые надо создать)
        images_album, new_images = images
        # Удаляем картинки, которые юзер удалил
        Image.objects.filter(product=instance).exclude(
            id__in=images_album.keys()
        ).delete()
        # Берем все картинки после удаления
        images_after_deleting = Image.objects.filter(product=instance).only(
            "id", "is_main"
        )
        # Меняем все is_main
        for image_after_deleting in images_after_deleting:
            if image_after_deleting.id in images_album.keys():
                image_after_deleting.is_main = images_album[image_after_deleting.id]
                image_after_deleting.save()
        # Создаем новые картинки
        self.creating_images(new_images, instance)

    def update(self, instance, validated_data):
        images = validated_data.get("images")
        address = validated_data.pop("address", False)
        name = validated_data.get("name")

        if name is not None and instance.name != name:
            instance.slug = CreateProductService()._generate_slug(name=name)

        if address:
            serializer = ProductAddressUpdateSerializer(
                instance=instance.product_addresses.get(product=instance), data=address
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()

        if images is not None:
            images = validated_data.pop("images")
            instance = super().update(instance, validated_data)
            self._images_updating(images, instance)
            return instance

        return super().update(instance, validated_data)
