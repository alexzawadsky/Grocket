from djoser import serializers as djserializers
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from api.fields import ProductImagesField
from products.models import Category, Favourite, Image, Product, Promotion
from comments.models import Comment, CommentImage, CommentReply
from products.services import ProductService
from users.models import User
from users.services import UserService


class CustomUserSerializer(djserializers.UserSerializer):
    """Сериализатор модели User."""

    avatar = Base64ImageField(allow_null=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name',
                  'avatar', 'phone', 'country', 'date_joined', 'last_login',)

    def update(self, instance, validated_data):
        avatar = validated_data.get('avatar')
        if not instance.avatar or avatar is not None:
            first_name = instance.first_name
            last_name = instance.last_name
            username = instance.username
            avatar = UserService().create_avatar(
                avatar=avatar,
                first_name=first_name,
                last_name=last_name,
                username=username,
            )
            validated_data['avatar'] = avatar

        return super().update(instance, validated_data)


class CustomUserCreateSerializer(djserializers.UserCreateSerializer):
    """Кастомный сериализатор создания модели User."""

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

        avatar = UserService().create_avatar(
            avatar=avatar,
            first_name=first_name,
            last_name=last_name,
            username=username,
        )
        validated_data['avatar'] = avatar

        return super().create(validated_data)


class FavouriteSerializer(serializers.ModelSerializer):
    """Сериализатор для избранного."""

    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all()
    )

    class Meta:
        model = Favourite
        fields = ('id', 'user', 'product',)

    def validate_product(self, value):
        if Favourite.objects.filter(
            user=self.context['request'].user,
            product=value
        ).exists():
            raise serializers.ValidationError(
                _('This recipe is already in my favorites.'),
            )

        return value


class PromotionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promotion
        fields = ('id', 'name', 'title', 'price',
                  'price_currency', 'description',)


class PromotionCreateUpdateSerializer(serializers.ModelSerializer):
    promotions = serializers.PrimaryKeyRelatedField(
        queryset=Promotion.objects.all(),
        many=True
    )

    class Meta:
        model = Promotion
        fields = ('promotions',)


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ('id', 'title',)


class CategoryListSerializer(serializers.ModelSerializer):
    is_lower = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = (
            'id', 'title', 'tree_id', 'level', 'parent',
            'is_lower',
        )

    def get_is_lower(self, obj):
        return obj.is_leaf_node()


class ProductCategorySerializer(serializers.ModelSerializer):
    parents = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'title', 'parents',)

    def get_parents(self, obj):
        parents = obj.get_ancestors(ascending=False, include_self=False)
        serializer = CategorySerializer(
            instance=parents,
            many=True
        )

        return serializer.data


class ProductImageSerializer(serializers.ModelSerializer):
    image = Base64ImageField(allow_null=True, required=False)

    class Meta:
        model = Image
        fields = ('id', 'image', 'is_main',)


class ProductImageCreateSerializer(serializers.ModelSerializer):
    image = Base64ImageField(allow_null=True, required=False)

    class Meta:
        model = Image
        fields = ('image', 'is_main', 'product',)

    def create(self, validated_data):
        image = validated_data.pop('image')
        product = validated_data.get('product')

        prepared_image = ProductService().prepair_image(product.id, image)
        image = Image.objects.create(image=prepared_image, **validated_data)

        return image


class ProductReadOnlySerializer(serializers.ModelSerializer):
    is_favourited = serializers.SerializerMethodField()
    promotions = serializers.SerializerMethodField()
    user = CustomUserSerializer(read_only=True)

    def get_is_favourited(self, obj):
        user = self.context['request'].user

        if user.is_authenticated:
            return Favourite.objects.filter(user=user, product=obj).exists()

        return False

    def get_promotions(self, obj):
        promotions = obj.promotions.values_list('name', flat=True)

        return list(promotions)


class ProductRetrieveSerializer(ProductReadOnlySerializer):
    category = ProductCategorySerializer(read_only=True)
    images = ProductImageSerializer(read_only=True, many=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'user',
            'description', 'price', 'price_currency',
            'address', 'is_archived', 'is_sold', 'is_favourited',
            'category', 'images', 'pub_date', 'promotions',
        )


class ProductListSerializer(ProductReadOnlySerializer):
    category = CategorySerializer(read_only=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'user',
            'price', 'price_currency', 'address',
            'is_archived', 'is_sold', 'is_favourited',
            'category', 'images', 'pub_date', 'promotions',
        )

    def get_images(self, obj):
        images = Image.objects.filter(product=obj, is_main=True)
        serializer = ProductImageSerializer(
            instance=images,
            read_only=True,
            many=True
        )

        return serializer.data


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all()
    )
    is_archived = serializers.HiddenField(default=False)
    is_sold = serializers.HiddenField(default=False)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'user',
            'description', 'price', 'price_currency',
            'address', 'is_archived', 'is_sold',
            'category', 'images',
        )

    def validate_category(self, value):
        if not value.is_leaf_node():
            raise serializers.ValidationError(
                _('Can only be added to the final category.')
            )

        return value

    def validate_images(self, value):
        pass

    def to_representation(self, product):
        serializer = ProductRetrieveSerializer(product, context=self.context)

        return serializer.data

    def creating_images(self, new_images, product):
        '''Создает и обрабатывает картинки.'''
        for image in new_images:
            image_base64 = image[0]
            is_main = image[1]

            images_serializer = ProductImageCreateSerializer(
                data={
                    'image': image_base64,
                    'is_main': is_main,
                    'product': product.id
                }
            )
            images_serializer.is_valid(raise_exception=True)
            images_serializer.save()


class ProductCreateSerializer(ProductCreateUpdateSerializer):
    images = serializers.ListField()

    def validate_images(self, value):
        super().validate_images(value)

        main = False
        for image in value:
            is_main = image['is_main']
            image = image['image']
            if is_main:
                if main:
                    raise serializers.ValidationError(
                        _('You cannot add more than one main photo.')
                    )
                main = True

        if not main:
            raise serializers.ValidationError(
                _('Add a main photo.')
            )

        return value

    def creating_images(self, images, product):
        new_images = []
        for new_image in images:
            new_images.append(
                (new_image['image'], new_image['is_main'])
            )

        super().creating_images(new_images, product)

    def create(self, validated_data):
        images = validated_data.pop('images')
        product = Product.objects.create(**validated_data)
        self.creating_images(images, product)

        return product


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


class ProductCommentSerializer(ProductReadOnlySerializer):

    class Meta:
        model = Product
        fields = ('id', 'name',)


class CommentUserSerializer(CustomUserSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name',)


class CommentImageSerializer(serializers.ModelSerializer):
    image = Base64ImageField(read_only=True)

    class Meta:
        model = CommentImage
        fields = ('id', 'image', )


class CommentImageCreateSerializer(serializers.ModelSerializer):
    image = Base64ImageField()

    class Meta:
        model = CommentImage
        fields = ('image', 'comment',)


class CommentReplyCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    comment = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.all()
    )

    class Meta:
        model = CommentReply
        fields = ('user', 'comment', 'text')


class CommentReplyReadOnlySerializer(serializers.ModelSerializer):
    user = CommentUserSerializer(read_only=True)

    class Meta:
        model = CommentReply
        fields = ('id', 'user', 'text')


class CommentReadOnlySerializer(serializers.ModelSerializer):
    user = CommentUserSerializer(read_only=True)
    product = ProductCommentSerializer(read_only=True)
    images = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'status', 'rate', 'text', 'images',
                  'replies', 'user', 'product',)

    def get_replies(self, obj):
        replies = CommentReply.objects.filter(comment=obj)
        serializer = CommentReplyReadOnlySerializer(
            instance=replies,
            many=True,
            read_only=True
        )

        return serializer.data

    def get_images(self, obj):
        images = CommentImage.objects.filter(comment=obj)
        serializer = CommentImageSerializer(
            instance=images,
            many=True,
            read_only=True
        )

        return serializer.data


class CommentCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
    )
    images = serializers.ListField()
    status = serializers.CharField()

    class Meta:
        model = Comment
        fields = ('user', 'product', 'images', 'rate', 'text', 'status',)

    def validate_status(self, value):
        if value not in settings.COMMENT_STATUSES:
            raise serializers.ValidationError(_('No such status.'))

        return value

    def to_representation(self, comment):
        serializer = CommentReadOnlySerializer(comment, context=self.context)

        return serializer.data

    def creating_images(self, images, comment):
        '''Создает и обрабатывает картинки.'''
        for image in images:
            images_serializer = CommentImageCreateSerializer(
                data={
                    'image': image['image'],
                    'comment': comment.id
                }
            )
            images_serializer.is_valid(raise_exception=True)
            images_serializer.save()

    def validate_product(self, obj):
        if obj.is_archived:
            raise serializers.ValidationError(
                _('There is no such product or it is archived.')
            )
        return obj

    def create(self, validated_data):
        product = validated_data.get('product')
        user = validated_data.get('user')
        images = validated_data.pop('images')
        seller = product.user

        comments_exists = Comment.objects.filter(
            user=user,
            product=product
        ).exists()

        if seller == user:
            raise serializers.ValidationError(
                _('You can not add a comment to your product.')
            )

        if not comments_exists:
            comment = Comment.objects.create(
                seller=seller,
                **validated_data
            )
            self.creating_images(images, comment)
        else:
            raise serializers.ValidationError(
                _('You can not add 2 comments to one product.')
            )

        return comment
