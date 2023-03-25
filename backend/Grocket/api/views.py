from djoser import views as djviews
from rest_framework import permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from comments.services import CommentService
from products.services import ProductService
from users.services import UserService

from .mixins import CategoryMixin, CommentMixin, ProductMixin, PromotionMixin

comments_services = CommentService()
users_services = UserService()
products_services = ProductService()


class CommentViewSet(CommentMixin):
    def destroy(self, request, pk):
        user_id = self.request.user.id
        comments_services.delete_comment(user_id=user_id, comment_id=pk)
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

    @action(['get'], detail=False)
    def me_comments(self, request):
        user = self.request.user
        queryset = self.filter_queryset(
            comments_services.get_comments(seller=user)
        )
        return super().list(request, queryset)

    @action(['get'], detail=False)
    def user_comments(self, request, pk):
        user = users_services.get_user_or_404(id=pk)
        queryset = self.filter_queryset(
            comments_services.get_comments(seller=user)
        )
        return super().list(request, queryset)

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
            user_id = self.request.user.id
            comments_services.delete_reply(user_id=user_id, reply_id=pk)
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


class ProductViewSet(ProductMixin):
    def destroy(self, request, pk):
        user_id = self.request.user.id
        products_services.delete_product(user_id=user_id, product_id=pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def list(self, request):
        queryset = products_services.get_safe_products()
        return super().list(request, queryset)

    def retrieve(self, request, pk):
        user_id = self.request.user.id
        product = products_services.get_product_or_404(id=pk, user_id=user_id)
        serializer = self.get_serializer_class()(
            instance=product,
            context={'request': request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        pass

    def partial_update(self, request):
        pass

    @action(['get'], detail=False)
    def me_products(self, request):
        user = self.request.user

        is_sold = self.request.query_params.get('is_sold')
        is_archived = self.request.query_params.get('is_archived')

        if not any([is_sold, is_archived]):
            queryset = products_services.get_safe_products()
        elif is_sold:
            queryset = products_services.get_sold_products(user_id=user.id)
        elif is_archived:
            queryset = products_services.get_archived_products(user_id=user.id)

        return super().list(request, queryset)

    @action(['get'], detail=False)
    def user_products(self, request, pk):
        user = users_services.get_user_or_404(id=pk)

        is_sold = self.request.query_params.get('is_sold')
        if not any([is_sold]):
            queryset = products_services.get_safe_products()
        elif is_sold:
            queryset = products_services.get_sold_products(user_id=user.id)

        return super().list(request, queryset)

    @action(['post'], detail=False)
    def promote(self, request, pk):
        serializer = self.get_serializer_class()(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        promotions = serializer.validated_data.get('promotions')
        user_id = self.request.user.id
        products_services.promote_product(
            user_id=user_id, product_id=pk, promotions_ids=promotions
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(['post', 'delete'], detail=True)
    def sell(self, request, pk):
        user_id = self.request.user.id

        if request.method == 'POST':
            products_services.sell_product(user_id=user_id, product_id=pk)
            return Response(status=status.HTTP_204_NO_CONTENT)

        if request.method == 'DELETE':
            products_services.unsell_product(user_id=user_id, product_id=pk)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(['post', 'delete'], detail=True)
    def archive(self, request, pk):
        user_id = self.request.user.id

        if request.method == 'DELETE':
            products_services.unarchive_product(user_id=user_id, product_id=pk)
            return Response(status=status.HTTP_204_NO_CONTENT)

        if request.method == 'POST':
            products_services.archive_product(user_id=user_id, product_id=pk)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(['post', 'delete'], detail=True)
    def favourite(self, request, pk):
        user_id = self.request.user.id

        if request.method == 'DELETE':
            products_services.unfavourite_product(
                user_id=user_id, product_id=pk
            )
            return Response(status=status.HTTP_204_NO_CONTENT)

        if request.method == 'POST':
            products_services.favourite_product(user_id=user_id, product_id=pk)
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class CategoryViewSet(CategoryMixin):
    def list(self, request):
        parent_id = self.request.query_params.get('parent_id')
        is_all = self.request.query_params.get('all')
        if is_all:
            queryset = products_services.get_categories()
        else:
            queryset = products_services.get_categories(parent__id=parent_id)
        return super().list(request, queryset)


class PromotionViewSet(PromotionMixin):
    def list(self, request):
        queryset = products_services.get_promotions()
        return super().list(request, queryset)


class CustomUserRetrieveViewSet(djviews.UserViewSet):
    permission_classes = (permissions.AllowAny,)


class CustomUserRegisterViewSet(djviews.UserViewSet):
    pass
