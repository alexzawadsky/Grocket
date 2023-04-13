from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from products.selectors import (get_all_products, get_categories,
                                get_favourited_products, get_product_or_404,
                                get_products_for_comments, get_promotions,
                                get_safe_products)
from products.services.services import CreateProductService, ProductService

from .mixins import CategoryMixin, ProductMixin, PromotionMixin


class ProductViewSet(ProductMixin):
    def destroy(self, request, pk):
        user_id = self.request.user.id
        service = ProductService(product_id=pk)
        service.delete(user_id=user_id)
        data = self.get_response_message()
        return Response(data, status=status.HTTP_204_NO_CONTENT)

    def list(self, request):
        return super().list(request, queryset=get_safe_products())

    def retrieve(self, request, pk):
        user_id = self.request.user.id
        product = get_product_or_404(user_id=user_id, id=pk)
        serializer = self.get_serializer_class()(
            instance=product, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        request.data["user"] = self.request.user.id
        serializer = self.get_serializer_class()(data=request.data)
        serializer.is_valid(raise_exception=True)
        service = CreateProductService()
        service.create(**serializer.validated_data)
        data = self.get_response_message()
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
            queryset = get_safe_products()
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
        data = self.get_response_message()
        return Response(data, status=status.HTTP_204_NO_CONTENT)

    @action(["post", "delete"], detail=True)
    def sell(self, request, pk):
        user = self.request.user

        if request.method == "POST":
            service = ProductService(product_id=pk)
            service.sell(user_id=user.id, is_sold=True)
            data = self.get_response_message(method="POST")
            return Response(data, status=status.HTTP_204_NO_CONTENT)

        if request.method == "DELETE":
            service = ProductService(product_id=pk)
            service.sell(user_id=user.id, is_sold=False)
            data = self.get_response_message(method="DELETE")
            return Response(data, status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(["post", "delete"], detail=True)
    def archive(self, request, pk):
        user = self.request.user

        if request.method == "POST":
            service = ProductService(product_id=pk)
            service.archive(user_id=user.id, is_archived=True)
            data = self.get_response_message(method="POST")
            return Response(data, status=status.HTTP_204_NO_CONTENT)

        if request.method == "DELETE":
            service = ProductService(product_id=pk)
            service.archive(user_id=user.id, is_archived=False)
            data = self.get_response_message(method="DELETE")
            return Response(data, status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(["post", "delete"], detail=True)
    def favourite(self, request, pk):
        user = self.request.user

        if request.method == "POST":
            service = ProductService(product_id=pk)
            service.favourite(user_id=user.id, is_favourited=True)
            data = self.get_response_message(method="POST")
            return Response(data, status=status.HTTP_204_NO_CONTENT)

        if request.method == "DELETE":
            service = ProductService(product_id=pk)
            service.favourite(user_id=user.id, is_favourited=False)
            data = self.get_response_message(method="DELETE")
            return Response(data, status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class CategoryViewSet(CategoryMixin):
    def list(self, request):
        parent_id = self.request.query_params.get("parent_id")

        if self.request.query_params.get("all"):
            queryset = get_categories()
        else:
            queryset = get_categories(parent__id=parent_id)

        return super().list(request, queryset)


class PromotionViewSet(PromotionMixin):
    def list(self, request):
        queryset = get_promotions()
        return super().list(request, queryset)
