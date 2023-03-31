from django.utils.translation import gettext_lazy as _
from django_filters import rest_framework as django_filters
from rest_framework import filters, permissions, status
from rest_framework.mixins import (CreateModelMixin, DestroyModelMixin,
                                   RetrieveModelMixin, UpdateModelMixin)
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .filters import ProductFilter
from .paginators import CommentPageLimitPagination
from .serializers import (CategoryListSerializer, CommentCreateSerializer,
                          CommentReadOnlySerializer,
                          CommentReplyCreateSerializer,
                          ProductCreateSerializer, ProductListSerializer,
                          ProductRetrieveSerializer, ProductUpdateSerializer,
                          PromotionCreateUpdateSerializer, PromotionSerializer,
                          StatusSerializer)

RESPONSE_MESSAGES = {
    'products': {
        'create': _('Created'),
        'destroy': _('Deleted'),
        'promote': _('Successfully promoted'),
        'sell': {
            'POST': _('Marked as sold'),
            'DELETE': _('Removed from sold')
        },
        'archive': {
            'POST': _('Moved to archive'),
            'DELETE': _('Removed from the archive')
        },
        'favourite': {
            'POST': _('Marked as favourite'),
            'DELETE': _('Removed from favourites'),
        },
        # 'updated': _('Updated'),
    }
}


class BaseMixin(GenericViewSet):
    def get_response_message(self, app, method=None):
        try:
            message = RESPONSE_MESSAGES[app][self.action]
            if method is not None:
                message = message[method]
            return {"message": message}
        except KeyError:
            return None

    def list(self, request, queryset, *args, **kwargs):
        queryset = self.filter_queryset(queryset)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CategoryMixin(BaseMixin):
    pagination_class = None

    def get_serializer_class(self):
        if self.action in ('list',):
            return CategoryListSerializer

    def get_permissions(self):
        if self.action in ('list',):
            self.permission_classes = (permissions.AllowAny,)
        return super().get_permissions()


class PromotionMixin(BaseMixin):
    pagination_class = None

    def get_serializer_class(self):
        if self.action in ('list',):
            return PromotionSerializer

    def get_permissions(self):
        if self.action in ('list',):
            self.permission_classes = (permissions.AllowAny,)
        return super().get_permissions()


class CommentMixin(
        CreateModelMixin, DestroyModelMixin,
        BaseMixin
        ):
    pagination_class = CommentPageLimitPagination

    def get_permissions(self):
        if self.action in ('user_comments', 'statuses',):
            self.permission_classes = (permissions.AllowAny,)
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


class ProductMixin(
        CreateModelMixin, DestroyModelMixin,
        UpdateModelMixin, RetrieveModelMixin,
        BaseMixin
        ):
    filter_backends = [
        filters.OrderingFilter,
        django_filters.DjangoFilterBackend,
    ]
    filterset_class = ProductFilter
    ordering_fields = ['price', 'pub_date']

    def get_response_message(self, method=None):
        return super().get_response_message(app='products', method=method)

    def get_permissions(self):
        if self.action in ('list', 'retrieve', 'user_products',):
            self.permission_classes = (permissions.AllowAny,)
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
