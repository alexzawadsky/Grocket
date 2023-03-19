from comments.services import CommentService
from django.shortcuts import get_object_or_404
from django_filters import rest_framework as django_filters
from djoser import views as djviews
from products.models import Category, Favourite, Product, Promotion
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from users.models import User
from users.services import UserService

from .filters import ProductFilter
from .permissions import IsOwnerOrReadOnly
from .serializers import (CategoryListSerializer, CommentCreateSerializer,
                          CommentReadOnlySerializer,
                          CommentReplyCreateSerializer, FavouriteSerializer,
                          ProductCreateSerializer, ProductListSerializer,
                          ProductRetrieveSerializer, ProductUpdateSerializer,
                          PromotionCreateUpdateSerializer, PromotionSerializer,
                          StatusSerializer)

comments_services = CommentService()
users_services = UserService()


class CustomUserRetrieveViewSet(djviews.UserViewSet):
    permission_classes = (permissions.AllowAny,)


class CustomUserRegisterViewSet(djviews.UserViewSet):
    pass


class CommentViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'delete']
    permission_classes = (IsOwnerOrReadOnly,)

    def get_queryset(self):
        return comments_services.get_comments()

    def get_permissions(self):
        if self.action in ('user_comments',):
            self.permission_classes = (permissions.AllowAny,)
        elif self.action in ('create', 'reply', 'me_comments',):
            self.permission_classes = (permissions.IsAuthenticated,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ('user_comments', 'me_comments',):
            return CommentReadOnlySerializer
        elif self.action in ('create',):
            return CommentCreateSerializer
        elif self.action in ('reply',):
            return CommentReplyCreateSerializer
        elif self.action in ('statuses',):
            return StatusSerializer

    def destroy(self, request, pk):
        comments_services.delete_comment(comment_id=pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def create(self, request):
        request.data['user'] = self.request.user.id

        serializer = self.get_serializer_class()(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        comments_services.create_comment(
            **serializer.data
        )
        return Response(status=status.HTTP_201_CREATED)

    def _user_comments_list(self, user, request):
        queryset = self.filter_queryset(
            comments_services.get_comments(seller=user)
        )
        page = self.paginate_queryset(queryset)
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(
            instance=page,
            context={'request': request},
            many=True,
        )
        return self.get_paginated_response(serializer.data)

    @action(['get'], detail=False)
    def me_comments(self, request):
        user = self.request.user
        return self._user_comments_list(user, request)

    @action(['get'], detail=False)
    def user_comments(self, request, pk):
        user = users_services.get_user_or_404(id=pk)
        return self._user_comments_list(user, request)

    @action(['post', 'delete'], detail=True)
    def reply(self, request, pk):
        if request.method == 'POST':
            request.data['comment'] = pk
            request.data['user'] = self.request.user.id

            serializer = self.get_serializer_class()(
                data=request.data
            )
            serializer.is_valid(raise_exception=True)

            comments_services.reply_to_comment(
                **serializer.data
            )
            return Response(status=status.HTTP_201_CREATED)

        if request.method == 'DELETE':
            comments_services.delete_reply(reply_id=pk)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(['get'], detail=False)
    def statuses(self, request):
        statuses = comments_services.get_statuses()

        serializer = self.get_serializer_class()(
            instance=statuses,
            many=True,
            read_only=True
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class CategoryViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    http_method_names = ['get']
    serializer_class = CategoryListSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Category.objects.all()
        parent_id = self.request.query_params.get('parent_id')

        if parent_id is None:
            return queryset.filter(parent=None)

        return queryset.filter(parent=parent_id)


class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    http_method_names = ['get']
    permission_classes = (permissions.AllowAny,)
    serializer_class = PromotionSerializer
    pagination_class = None


class FavouriteViewSet(viewsets.ModelViewSet):
    queryset = Favourite.objects.all()
    http_method_names = ['post', 'delete']
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = FavouriteSerializer

    def post(self, request, pk):
        user = request.user.id

        if get_object_or_404(Product, id=pk).user.id == user:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        data = {
            'user': user,
            'product': pk
        }
        serializer = self.serializer_class(
            data=data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        obj = self.queryset.filter(user=request.user, product__id=pk)

        if obj.exists():
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class ProductViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete']
    permission_classes = (IsOwnerOrReadOnly,)
    filter_backends = [
        filters.OrderingFilter,
        django_filters.DjangoFilterBackend,
    ]
    filterset_class = ProductFilter
    ordering_fields = ['price', 'pub_date']

    def get_queryset(self):
        queryset = Product.objects.filter(
            is_sold=False,
            is_archived=False
        )

        return queryset

    def get_permissions(self):
        if self.action == 'me_products':
            self.permission_classes = (permissions.IsAuthenticated,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ('retrieve',):
            return ProductRetrieveSerializer
        elif self.action in ('list', 'me_products', 'user_products',):
            return ProductListSerializer
        elif self.action in ('create',):
            return ProductCreateSerializer
        elif self.action in ('partial_update',):
            return ProductUpdateSerializer
        elif self.action in ('promote',):
            return PromotionCreateUpdateSerializer

    def _user_products_serialize(self, queryset, request):
        page = self.paginate_queryset(queryset)
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(
            page,
            context={'request': request},
            many=True,
        )

        return self.get_paginated_response(serializer.data)

    @action(['get'], detail=False)
    def me_products(self, request):
        user = self.request.user
        queryset = self.filter_queryset(Product.objects.filter(user=user))

        if self.request.query_params.get('is_sold') == '1':
            queryset = queryset.filter(is_sold=True)
        elif self.request.query_params.get('is_archived') == '1':
            queryset = queryset.filter(is_archived=True)
        else:
            queryset = queryset.filter(is_sold=False, is_archived=False)

        return self._user_products_serialize(queryset, request)

    @action(['get'], detail=False)
    def user_products(self, request, pk):
        user = get_object_or_404(User, id=pk)
        queryset = self.filter_queryset(
            Product.objects.filter(user=user, is_archived=False))

        if self.request.query_params.get('is_sold') == '1':
            queryset = queryset.filter(is_sold=True)

        return self._user_products_serialize(queryset, request)

    @action(['post'], detail=False)
    def promote(self, request, pk):
        product = get_object_or_404(Product, id=pk)

        serializer = PromotionCreateUpdateSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        promotions = serializer.validated_data.get('promotions')

        if promotions is not None:
            product.promotions.set(promotions)
            product.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(['post', 'delete'], detail=True)
    def sell(self, request, pk):
        product = get_object_or_404(Product, id=pk)

        if request.method == 'DELETE':
            if product.is_sold:
                product.is_sold = False
                product.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.method == 'POST':
            if not product.is_sold:
                product.is_sold = True
                product.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(['post', 'delete'], detail=True)
    def archive(self, request, pk):
        product = get_object_or_404(Product, id=pk)

        if request.method == 'DELETE':
            if product.is_archived:
                product.is_archived = False
                product.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.method == 'POST':
            if not product.is_archived:
                product.is_archived = True
                product.save()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_400_BAD_REQUEST)
