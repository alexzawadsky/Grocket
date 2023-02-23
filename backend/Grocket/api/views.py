from django.shortcuts import get_object_or_404
from django_filters import rest_framework as django_filters
from djoser import views as djviews
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.views import avatar_img_creating
from products.models import Category, Favourite, Product, Promotion
from users.models import User

from .filters import ProductFilter
from .permissions import IsOwnerOrReadOnly
from .serializers import (CategoryListSerializer, FavouriteSerializer,
                          ProductCreateUpdateSerializer, ProductListSerializer,
                          ProductRetrieveSerializer, PromotionSerializer)


class CustomUserRetrieveViewSet(djviews.UserViewSet):
    permission_classes = (permissions.AllowAny,)


class CustomUserRegisterViewSet(djviews.UserViewSet):
    def create(self, request):
        data = request.data
        data_keys = data.keys()

        if 'first_name' not in data_keys or 'last_name' not in data_keys:
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)

        first_name = data['first_name']
        last_name = data['last_name']

        if 'avatar' not in data_keys:
            data['avatar'] = avatar_img_creating(first_name, last_name)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )


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
        data = {
            'user': request.user.id,
            'product': pk
        }
        serializer = self.serializer_class(
            data=data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        obj = self.queryset.filter(user=request.user, product__id=pk)

        if obj.exists():
            obj.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class ProductViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
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
        if self.action == 'retrieve':
            return ProductRetrieveSerializer
        elif self.action in ('list', 'me_products', 'user_products'):
            return ProductListSerializer
        elif self.action in ('create', 'update'):
            return ProductCreateUpdateSerializer

    def user_products_serialize(self, queryset, request):
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

        return self.user_products_serialize(queryset, request)

    @action(['get'], detail=False)
    def user_products(self, request, pk):
        user = get_object_or_404(User, id=pk)
        queryset = self.filter_queryset(
            Product.objects.filter(user=user, is_archived=False))

        if self.request.query_params.get('is_sold') == '1':
            queryset = queryset.filter(is_sold=True)

        return self.user_products_serialize(queryset, request)

    @action(['post'], detail=False)
    def promote(self, request, product_pk, promotion_pk):
        product = get_object_or_404(Product, id=product_pk)

        if product.promotion is None:
            promotion = get_object_or_404(Promotion, id=promotion_pk)
            product.promotion = promotion
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
