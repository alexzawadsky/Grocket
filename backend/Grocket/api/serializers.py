from django.db.models import Avg
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from djmoney.contrib.django_rest_framework import MoneyField
from djoser import serializers as djserializers
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from api.fields import ProductImagesField
from comments.services import CommentService
from products.models import Category, Image, Product
from products.services import ProductService
from users.models import User
from users.services import UserService

products_services = ProductService()
users_services = UserService()
comments_services = CommentService()


class CustomUserSerializer(djserializers.UserSerializer):
    avatar = Base64ImageField(allow_null=True, required=False)
    rating = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    sold_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'rating', 'comments_count', 'sold_count', 'username',
                  'email', 'first_name', 'last_name', 'avatar', 'phone',
                  'country', 'date_joined', 'last_login',)

    def get_sold_count(self, obj):
        return obj.products.filter(is_sold=True).count()

    def get_comments_count(self, obj):
        return obj.seller_comments.count()

    def get_rating(self, obj):
        return obj.seller_comments.aggregate(Avg('rate'))['rate__avg']

    def update(self, instance, validated_data):
        avatar = validated_data.get('avatar')
        if not instance.avatar or avatar is not None:
            first_name = instance.first_name
            last_name = instance.last_name
            username = instance.username
            avatar = users_services.create_avatar(
                avatar=avatar,
                first_name=first_name,
                last_name=last_name,
                username=username,
            )
            validated_data['avatar'] = avatar

        return super().update(instance, validated_data)


class CustomUserCreateSerializer(djserializers.UserCreateSerializer):
    avatar = Base64ImageField(allow_null=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'password', 'avatar', 'phone', 'country', 'date_joined',
                  'last_login',)
        read_only_fields = ('id',)

    def create(self, validated_data):
        avatar = validated_data.get('avatar')
        first_name = validated_data.get('first_name')
        last_name = validated_data.get('last_name')
        username = validated_data.get('username')

        avatar = users_services.create_avatar(
            avatar=avatar,
            first_name=first_name,
            last_name=last_name,
            username=username,
        )
        validated_data['avatar'] = avatar

        return super().create(validated_data)


# ref
class PromotionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.SlugField()
    title = serializers.CharField()
    price = MoneyField(max_digits=19, decimal_places=2)
    price_currency = serializers.CharField()
    description = serializers.CharField()

    class Meta:
        fields = ('id', 'name', 'title', 'price',
                  'price_currency', 'description',)


# ref
class PromotionCreateUpdateSerializer(serializers.Serializer):
    promotions = serializers.ListField()

    class Meta:
        fields = ('promotions',)

    def validate_promotions(self, value):
        for promotion in value:
            if not isinstance(promotion, int):
                raise serializers.ValidationError()
        return value


# ref
class CategoryListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    parent = serializers.SerializerMethodField()
    is_lower = serializers.SerializerMethodField()

    class Meta:
        fields = ('id', 'title', 'parent', 'is_lower',)

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
        fields = ('id', 'title', 'parents',)

    def get_parents(self, obj):
        parents = products_services.get_ancestors_by_category(
            category_id=obj.id, ascending=False, include_self=False
        )
        serializer = CategoryListSerializer(
            instance=parents,
            many=True
        )
        return serializer.data


# ref
class ProductImageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    image = Base64ImageField(allow_null=True, required=False)
    is_main = serializers.BooleanField()

    class Meta:
        fields = ('id', 'image', 'is_main',)


class ProductImageCreateSerializer(serializers.Serializer):
    image = Base64ImageField(allow_null=True, required=False)
    is_main = serializers.BooleanField()

    class Meta:
        fields = ('image', 'is_main',)

    # def create(self, validated_data):
    #     image = validated_data.pop('image')
    #     # product = validated_data.get('product')

    #     # prepared_image = products_services.prepair_image(product.id, image)
    #     image = Image.objects.create(image=image, **validated_data)

    #     return image


# ref
class ProductReadOnlySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    price = MoneyField(max_digits=19, decimal_places=2)
    price_currency = serializers.CharField()
    address = serializers.CharField()
    is_archived = serializers.BooleanField()
    is_sold = serializers.BooleanField()
    pub_date = serializers.DateTimeField()
    is_favourited = serializers.SerializerMethodField()
    promotions = serializers.SerializerMethodField()
    user = CustomUserSerializer(read_only=True)

    def get_is_favourited(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return products_services.get_is_favourited(
                user_id=user.id, product_id=obj.id
            )
        return False

    def get_promotions(self, obj):
        promotions = products_services.get_product_promotions(
            product_id=obj.id
        ).values_list('name', flat=True)
        return list(promotions)


# ref
class ProductRetrieveSerializer(ProductReadOnlySerializer):
    description = serializers.CharField()
    category = ProductCategorySerializer(read_only=True)
    images = ProductImageSerializer(read_only=True, many=True)

    class Meta:
        fields = (
            'id', 'name', 'user',
            'description', 'price', 'price_currency',
            'address', 'is_archived', 'is_sold', 'is_favourited',
            'category', 'images', 'pub_date', 'promotions',
        )


# ref
class ProductListSerializer(ProductReadOnlySerializer):
    description = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    category = CategoryListSerializer(read_only=True)

    class Meta:
        fields = (
            'id', 'name', 'user', 'description',
            'price', 'price_currency', 'address',
            'is_archived', 'is_sold', 'is_favourited',
            'category', 'images', 'pub_date', 'promotions',
        )

    def get_description(self, obj):
        return obj.description[:200]

    def get_images(self, obj):
        images = products_services.get_product_images(
            product_id=obj.id
        ).order_by('-is_main')[:3]
        serializer = ProductImageSerializer(
            instance=images,
            read_only=True,
            many=True
        )
        return serializer.data


class ProductCreateUpdateSerializer(serializers.Serializer):
    name = serializers.CharField()
    user = serializers.IntegerField()
    description = serializers.CharField()
    price = MoneyField(max_digits=19, decimal_places=2)
    price_currency = serializers.CharField()
    address = serializers.CharField()
    category = serializers.IntegerField()

    class Meta:
        fields = (
            'name', 'user', 'price_currency', 'description',
            'price', 'address', 'category', 'images',
        )


class ProductCreateSerializer(ProductCreateUpdateSerializer):
    images = serializers.ListField()

    def validate_images(self, value):
        try:
            products_services.check_product_images_creation_logic(
                images=value
            )
        except ValidationError as error:
            raise serializers.ValidationError(error.messages)

        serializer = ProductImageCreateSerializer(
            data=value,
            many=True
        )
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data


class ProductUpdateSerializer(ProductCreateUpdateSerializer):
    images = ProductImagesField()

    def validate_images(self, value):
        super().validate_images(value)

        product = self.instance
        images_album, new_images = value
        images_album_keys = list(images_album.keys())
        images_album_values = list(images_album.values())
        new_images_values = list(new_images.values())

        for image in images_album_keys:
            image_obj = Image.objects.filter(id=image)
            if not image_obj.exists():
                raise serializers.ValidationError(
                    _('Image not found.')
                )
            if not image_obj.filter(product=product).exists():
                raise serializers.ValidationError(
                    _('This picture is not from this product.')
                )

        product_images = list(
            product.images.select_related().exclude(
                id__in=images_album_keys
            ).filter(
                id__in=images_album_keys
            ).values_list(
                'is_main', flat=True
            )
        )

        all_is_main = (images_album_values +
                       new_images_values +
                       product_images)

        if True not in all_is_main:
            raise serializers.ValidationError(
                _('Add a main photo.')
            )
        if all_is_main.count(True) > 1:
            raise serializers.ValidationError(
                _('You cannot add more than one main photo.')
            )

        return value

    def creating_images(self, new_images, product):
        super().creating_images(new_images.items(), product)

    def _images_updating(self, images, instance):
        '''Запускает все манипудяции с обновлением картинок.'''
        # (images_album - старые, new_images - которые надо создать)
        images_album, new_images = images
        # Удаляем картинки, которые юзер удалил
        Image.objects.filter(
            product=instance).exclude(id__in=images_album.keys()).delete()
        # Берем все картинки после удаления
        images_after_deleting = Image.objects.filter(
            product=instance).only('id', 'is_main')
        # Меняем все is_main
        for image_after_deleting in images_after_deleting:
            if image_after_deleting.id in images_album.keys():
                image_after_deleting.is_main = images_album[
                    image_after_deleting.id]
                image_after_deleting.save()
        # Создаем новые картинки
        self.creating_images(new_images, instance)

    def update(self, instance, validated_data):
        images = validated_data.get('images')

        if images is not None:
            images = validated_data.pop('images')

            instance = super().update(instance, validated_data)
            self._images_updating(images, instance)

            return instance

        return super().update(instance, validated_data)


# ref
class ProductCommentSerializer(ProductReadOnlySerializer):
    class Meta:
        model = Product
        fields = ('id', 'name',)


class CommentUserSerializer(CustomUserSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name',)


# ref
class CommentImageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    image = Base64ImageField(read_only=True)

    class Meta:
        fields = ('id', 'image',)


# ref
class CommentImageCreateSerializer(serializers.Serializer):
    image = Base64ImageField()

    class Meta:
        fields = ('image',)


# ref
class StatusSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.SlugField()
    title = serializers.CharField()

    class Meta:
        fields = ('id', 'title', 'name',)


# ref
class CommentReplyCreateSerializer(serializers.Serializer):
    user = serializers.IntegerField()
    comment = serializers.IntegerField()
    text = serializers.CharField()

    class Meta:
        fields = ('user', 'comment', 'text',)


# ref
class CommentReplyReadOnlySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    text = serializers.CharField()
    user = CommentUserSerializer(read_only=True)

    class Meta:
        fields = ('id', 'user', 'text',)


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

    class Meta:
        fields = ('id', 'status', 'rate', 'text', 'images',
                  'reply', 'user', 'seller', 'product', 'pub_date',)

    def get_reply(self, obj):
        reply = comments_services.get_replies_to_comment(comment_id=obj.id)
        if reply.exists():
            serializer = CommentReplyReadOnlySerializer(
                instance=reply.first(),
                read_only=True
            )
            return serializer.data
        return None

    def get_images(self, obj):
        images = comments_services.get_comment_images(comment_id=obj.id)
        serializer = CommentImageSerializer(
            instance=images,
            many=True,
            read_only=True
        )

        return serializer.data


# ref
class CommentCreateSerializer(serializers.Serializer):
    user = serializers.IntegerField()
    product = serializers.IntegerField()
    images = serializers.ListField()
    rate = serializers.IntegerField(max_value=5, min_value=1)
    text = serializers.CharField()
    status = serializers.IntegerField()
    status = serializers.IntegerField()

    class Meta:
        fields = ('user', 'product', 'images', 'rate', 'text', 'status',)

    def validate_images(self, value):
        serializer = CommentImageCreateSerializer(
            data=value,
            many=True
        )
        serializer.is_valid(raise_exception=True)
        images = [image['image'] for image in serializer.validated_data]
        return images
