from api.fields import ProductImagesField
from comments.services import CommentService
from django.utils.translation import gettext_lazy as _
from djoser import serializers as djserializers
from drf_extra_fields.fields import Base64ImageField
from products.models import Category, Favourite, Image, Product, Promotion
from products.services import ProductService
from rest_framework import serializers
from users.models import User
from users.services import UserService

products_services = ProductService()
users_services = UserService()
comments_services = CommentService()


class CustomUserSerializer(djserializers.UserSerializer):
    """Сериализатор модели User."""

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
        sold_count = obj.products.select_related().filter(is_sold=True).count()
        return sold_count

    def get_comments_count(self, obj):
        comment_count = obj.seller_comments.select_related().count()
        return comment_count

    def get_rating(self, obj):
        comment_rates = list(
            obj.seller_comments.select_related().values_list('rate')
        )
        rates = [rate[0] for rate in comment_rates]
        rate_avg = round(0 if len(rates) == 0 else sum(rates) / len(rates), 2)
        return rate_avg

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

        avatar = users_services.create_avatar(
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

        # prepared_image = products_services.prepair_image(product.id, image)
        image = Image.objects.create(image=image, **validated_data)

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
        images = Image.objects.filter(product=obj).order_by('-is_main')[:3]
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


class CommentImageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    image = Base64ImageField(read_only=True)

    class Meta:
        fields = ('id', 'image',)


class CommentImageCreateSerializer(serializers.Serializer):
    image = Base64ImageField()

    class Meta:
        fields = ('image',)


class StatusSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.SlugField()
    title = serializers.CharField()

    class Meta:
        fields = ('id', 'title', 'name',)


class CommentReplyCreateSerializer(serializers.Serializer):
    user = serializers.IntegerField()
    comment = serializers.IntegerField()
    text = serializers.CharField()

    class Meta:
        fields = ('user', 'comment', 'text',)


class CommentReplyReadOnlySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    text = serializers.CharField()
    user = CommentUserSerializer(read_only=True)

    class Meta:
        fields = ('id', 'user', 'text',)


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
                  'reply', 'user', 'seller', 'product',)

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
