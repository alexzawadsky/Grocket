from django.db import transaction
from products.selectors import (
    get_all_products,
    get_categories,
    get_favourited_products,
    get_product_or_404,
    get_products_for_comments,
    get_promotions,
    get_safe_products,
)
from products.services.exchange_service import ExchangeRateService
from products.services.services import CreateProductService, ProductService
from rest_framework import permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

from .mixins import CategoryMixin, ProductMixin, PromotionMixin


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def exchange(request):
    # service = ExchangeRateService(key=code)
    # data = {"rate": service.get_exchange_rate()}
    data = {
        "USD": 1,
        "EUR": 0.9,
        "RUB": 82,
        "UAH": 36,
        "GPB": 0.8,
        "SEK": 10,
        "KZT": 454,
        "TRY": 19,
        "GEL": 2.5,
        "INR": 82,
        "ILS": 3.6,
        "AED": 3.7,
        "KRW": 1340,
        "CNY": 7,
    }
    return Response(data, status=status.HTTP_200_OK)


class ProductViewSet(ProductMixin):
    def destroy(self, request, pk):
        user_id = self.request.user.id
        service = ProductService(product_id=pk)
        service.delete(user_id=user_id)
        data = self._get_response_message()
        return Response(data, status=status.HTTP_200_OK)

    def list(self, request):
        queryset = self.filter_queryset(get_safe_products())
        respones = super().list(request, queryset=queryset).data
        data = self._get_searching_data(respones=respones, queryset=queryset)
        return Response(data=data, status=status.HTTP_200_OK)

    def retrieve(self, request, slug):
        user = self.request.user
        product = get_product_or_404(user_id=user.id, slug=slug)
        serializer = self.get_serializer_class()(
            instance=product, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @transaction.atomic()
    def create(self, request):
        request.data["user"] = self.request.user.id
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = CreateProductService()
        product_slug = service.create(**serializer.validated_data)
        data = {"slug": product_slug}
        data.update((self._get_response_message()))
        return Response(data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, pk):
        # serializer = self.get_serializer_class()(
        #     context={'product_id': pk},
        #     data=request.data
        # )
        # serializer.is_valid(raise_exception=True)

        # user_id = self.request.user.id
        # products_services.update_product(
        #     product_id=pk, user_id=user_id,
        #     **serializer.validated_data
        # )

        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(["get"], detail=False)
    def me_products(self, request):
        user = self.request.user

        is_sold = self.request.query_params.get("is_sold")
        is_archived = self.request.query_params.get("is_archived")
        is_favourited = self.request.query_params.get("is_favourited")

        if not any([is_sold, is_archived, is_favourited]):
            queryset = get_safe_products(user__id=user.id)
        elif is_sold:
            queryset = get_all_products(user_id=user.id, is_sold=True)
        elif is_archived:
            queryset = get_all_products(user_id=user.id, is_archived=True)
        elif is_favourited:
            queryset = get_favourited_products(user_id=user.id)

        return super().list(request, queryset)

    @action(["get"], detail=False)
    def user_products(self, request, pk):
        user = self.request.user

        is_sold = self.request.query_params.get("is_sold")
        for_comments = self.request.query_params.get("for_comments")

        if not any([is_sold, for_comments]):
            queryset = get_safe_products(user__id=pk)
        elif is_sold:
            queryset = get_all_products(user__id=pk, is_sold=True)
        elif for_comments:
            queryset = get_products_for_comments(seller_id=pk, user_id=user.id)

        return super().list(request, queryset)

    @action(["post"], detail=False)
    def promote(self, request, pk):
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)
        promotions = serializer.validated_data.get("promotions")
        user = self.request.user
        service = ProductService(product_id=pk)
        service.promote(user_id=user.id, promotions_ids=promotions)
        data = self._get_response_message()
        return Response(data, status=status.HTTP_200_OK)

    @action(["post", "delete"], detail=True)
    def sell(self, request, pk):
        user = self.request.user

        if request.method == "POST":
            service = ProductService(product_id=pk)
            service.sell(user_id=user.id, is_sold=True)
            data = self._get_response_message(method="POST")
            return Response(data, status=status.HTTP_200_OK)

        if request.method == "DELETE":
            service = ProductService(product_id=pk)
            service.sell(user_id=user.id, is_sold=False)
            data = self._get_response_message(method="DELETE")
            return Response(data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(["post", "delete"], detail=True)
    def archive(self, request, pk):
        user = self.request.user

        if request.method == "POST":
            service = ProductService(product_id=pk)
            service.archive(user_id=user.id, is_archived=True)
            data = self._get_response_message(method="POST")
            return Response(data, status=status.HTTP_200_OK)

        if request.method == "DELETE":
            service = ProductService(product_id=pk)
            service.archive(user_id=user.id, is_archived=False)
            data = self._get_response_message(method="DELETE")
            return Response(data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(["post", "delete"], detail=True)
    def favourite(self, request, pk):
        user = self.request.user

        if request.method == "POST":
            service = ProductService(product_id=pk)
            service.favourite(user_id=user.id, is_favourited=True)
            data = self._get_response_message(method="POST")
            return Response(data, status=status.HTTP_200_OK)

        if request.method == "DELETE":
            service = ProductService(product_id=pk)
            service.favourite(user_id=user.id, is_favourited=False)
            data = self._get_response_message(method="DELETE")
            return Response(data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class CategoryViewSet(CategoryMixin):
    def list(self, request):
        parent_id = self.request.query_params.get("parent_id")

        if self.request.query_params.get("all"):
            queryset = get_categories()
        else:
            queryset = get_categories(parent__id=parent_id)

        response = super().list(request, queryset)
        data = sorted(response.data, key=lambda category: not category["is_lower"])

        return Response(data, status=response.status_code)


class PromotionViewSet(PromotionMixin):
    def list(self, request):
        queryset = get_promotions()
        return super().list(request, queryset)
