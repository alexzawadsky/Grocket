from django_filters import rest_framework as django_filters
from .filters import ProductFilter
from rest_framework import filters, permissions
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    UpdateModelMixin,
    RetrieveModelMixin,
)
from ..mixins import BaseMixin
from .serializers import (
    ProductRetrieveSerializer,
    ProductListSerializer,
    ProductCreateSerializer,
    ProductUpdateSerializer,
    PromotionCreateUpdateSerializer,
    CategoryListSerializer,
    PromotionSerializer,
)


class ProductMixin(
    CreateModelMixin, DestroyModelMixin, UpdateModelMixin, RetrieveModelMixin, BaseMixin
):
    filter_backends = [
        filters.OrderingFilter,
        django_filters.DjangoFilterBackend,
    ]
    filterset_class = ProductFilter
    ordering_fields = ["price", "pub_date"]

    def get_response_message(self, method=None):
        return super().get_response_message(app="products", method=method)

    def get_permissions(self):
        if self.action in (
            "list",
            "retrieve",
            "user_products",
        ):
            self.permission_classes = (permissions.AllowAny,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ("retrieve",):
            return ProductRetrieveSerializer
        elif self.action in (
            "list",
            "me_products",
            "user_products",
        ):
            return ProductListSerializer
        elif self.action in ("create",):
            return ProductCreateSerializer
        elif self.action in ("partial_update",):
            return ProductUpdateSerializer
        elif self.action in ("promote",):
            return PromotionCreateUpdateSerializer


class CategoryMixin(BaseMixin):
    pagination_class = None

    def get_serializer_class(self):
        if self.action in ("list",):
            return CategoryListSerializer

    def get_permissions(self):
        if self.action in ("list",):
            self.permission_classes = (permissions.AllowAny,)
        return super().get_permissions()


class PromotionMixin(BaseMixin):
    pagination_class = None

    def get_serializer_class(self):
        if self.action in ("list",):
            return PromotionSerializer

    def get_permissions(self):
        if self.action in ("list",):
            self.permission_classes = (permissions.AllowAny,)
        return super().get_permissions()
