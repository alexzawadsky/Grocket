from djoser import views as djviews
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from core.views import avatar_img_creating
from products.models import Product, Category
from .serializers import (ProductRetrieveSerializer, ProductListSerializer,
                          CategoryListSerializer, ProductCreateSerializer)


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
    http_method_names = ['get', 'post']

    def get_queryset(self):
        queryset = Product.objects.filter(
            is_sold=False,
            is_archived=False
        )
        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductRetrieveSerializer
        elif self.action == 'list':
            return ProductListSerializer
        elif self.action == 'create':
            return ProductCreateSerializer

    def get_permissions(self):
        if self.action in ('retrieve', 'list'):
            self.permission_classes = (permissions.AllowAny,)
        elif self.action == 'create':
            self.permission_classes = (permissions.IsAuthenticated,)

        return super().get_permissions()
