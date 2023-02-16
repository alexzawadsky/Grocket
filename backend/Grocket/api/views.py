from djoser import views as djviews
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from core.views import avatar_img_creating
from products.models import Category, Product
from users.models import User
from django.shortcuts import get_object_or_404
from .permissions import IsOwnerOrReadOnly
from .serializers import (CategoryListSerializer,
                          ProductCreateUpdateSerializer, ProductListSerializer,
                          ProductRetrieveSerializer)


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


class ProductViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'put', 'delete']
    permission_classes = (IsOwnerOrReadOnly,)

    def get_queryset(self):
        queryset = Product.objects.filter(
            is_sold=False,
            is_archived=False
        )
        user = self.request.user
        if self.action == 'me_products' and user.is_authenticated:
            queryset = queryset.filter(user=user)

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

    @action(['get'], detail=False)
    def me_products(self, request):
        return self.list(request)

    @action(['get'], detail=False)
    def user_products(self, request, pk):
        user = get_object_or_404(User, id=pk)
        queryset = self.get_queryset().filter(user=user)
        page = self.paginate_queryset(queryset)

        serializer_class = self.get_serializer_class()
        serializer = serializer_class(
            page,
            context={'request': request},
            many=True,
        )

        return self.get_paginated_response(serializer.data)
