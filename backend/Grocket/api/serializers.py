from djoser import serializers as djserializers
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from products.models import Category, Favourite, Image, Product, Promotion
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
                'Этот рецепт уже есть в избранном',
            )

        return value


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
        fields = ('image', 'is_main',)


class PromotionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Promotion
        fields = ('id', 'name', 'title', 'price',
                  'price_currency', 'description',)


class ProductSerializer(serializers.ModelSerializer):
    is_favourited = serializers.SerializerMethodField()
    promotion_name = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('is_favourited', 'promotion_name',)

    def get_is_favourited(self, obj):
        user = self.context['request'].user

        if user.is_authenticated:
            return Favourite.objects.filter(user=user, product=obj).exists()

        return False

    def get_promotion_name(self, obj):
        promotion = obj.promotion

        if promotion is not None:
            return promotion.name

        return None


class ProductRetrieveSerializer(ProductSerializer):
    user = CustomUserSerializer(read_only=True)
    category = ProductCategorySerializer(read_only=True)
    images = ProductImageSerializer(read_only=True, many=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'user',
            'description', 'price', 'price_currency',
            'address', 'is_archived', 'is_sold', 'is_favourited',
            'category', 'images', 'pub_date', 'promotion_name',
        )


class ProductListSerializer(ProductSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    category = CategorySerializer(read_only=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'user',
            'price', 'price_currency', 'address',
            'is_archived', 'is_sold', 'is_favourited',
            'category', 'images', 'pub_date', 'promotion_name',
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
    promotion = serializers.PrimaryKeyRelatedField(
        queryset=Promotion.objects.all(),
        default=None
    )
    is_archived = serializers.HiddenField(default=False)
    is_sold = serializers.HiddenField(default=False)
    images = ProductImageSerializer(many=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'user',
            'description', 'price', 'price_currency',
            'address', 'is_archived', 'is_sold',
            'category', 'images', 'promotion',
        )

    def validate_images(self, value):
        main = False
        for image in value:
            if image['is_main']:
                if main:
                    raise serializers.ValidationError(
                        'Нельзя добавить больше одной главной фотографии.'
                    )
                main = True
        if not main:
            raise serializers.ValidationError(
                'Нужно добавить главную фотографию.'
            )

        return value

    def validate_category(self, value):
        if not value.is_leaf_node():
            raise serializers.ValidationError(
                'Можно добавить только в конечную категорию.'
            )

        return value

    def creating_images(self, images, product):
        for image in images:
            Image.objects.create(
                image=image['image'],
                is_main=image['is_main'],
                product=product
            )

    def create(self, validated_data):
        images = validated_data.pop('images')
        product = Product.objects.create(**validated_data)

        self.creating_images(images, product)

        return product

    def update(self, instance, validated_data):
        images = validated_data.get('images')

        if images is not None:
            images = validated_data.pop('images')
            Image.objects.filter(product=instance).delete()

        instance = super().update(instance, validated_data)

        if images is not None:
            self.creating_images(images, instance)

        return instance

    def to_representation(self, product):
        serializer = ProductRetrieveSerializer(product, context=self.context)

        return serializer.data
