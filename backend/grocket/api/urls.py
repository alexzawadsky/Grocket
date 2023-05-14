from django.conf.urls import include
from django.urls import path
from djoser.views import UserViewSet

from .comments.views import CommentViewSet
from .products.views import CategoryViewSet, ProductViewSet, PromotionViewSet, exchange
from .users.views import CustomUserRegisterViewSet, CustomUserRetrieveViewSet
from payments.views import create_payment_view, payment_callback

app_name = "api"

urlpatterns = [
    path("v1/exchange/", exchange, name="exchange"),
    path("v1/stripe-callback", payment_callback, name="payment_callback"),
    path("v1/stripe/<str:slug>/", create_payment_view, name="stripe"),
    # <--------- Products --------->
    path(
        "v1/promotions/", PromotionViewSet.as_view({"get": "list"}), name="promotions"
    ),
    path("v1/categories/", CategoryViewSet.as_view({"get": "list"}), name="categories"),
    path(
        "v1/products/<int:pk>/",
        ProductViewSet.as_view({"patch": "partial_update", "delete": "destroy"}),
        name="product_action",
    ),
    path(
        "v1/products/<str:slug>/",
        ProductViewSet.as_view({"get": "retrieve"}),
        name="product_retrieve",
    ),
    path(
        "v1/products/",
        ProductViewSet.as_view({"post": "create", "get": "list"}),
        name="products",
    ),
    path(
        "v1/products/<int:pk>/archive/",
        ProductViewSet.as_view({"post": "archive", "delete": "archive"}),
        name="archive",
    ),
    path(
        "v1/products/<int:pk>/sell/",
        ProductViewSet.as_view({"post": "sell", "delete": "sell"}),
        name="sell",
    ),
    path(
        "v1/products/<int:pk>/promote/",
        ProductViewSet.as_view({"post": "promote"}),
        name="promote",
    ),
    path(
        "v1/products/<int:pk>/favourite/",
        ProductViewSet.as_view({"post": "favourite", "delete": "favourite"}),
        name="favourite",
    ),
    path(
        "v1/users/<int:pk>/products/",
        ProductViewSet.as_view({"get": "user_products"}),
        name="user_products",
    ),
    path(
        "v1/users/me/products/",
        ProductViewSet.as_view({"get": "me_products"}),
        name="me_products",
    ),
    # <--------- Products --------->
    # <--------- Comments --------->
    path(
        "v1/comments/<int:pk>/reply/",
        CommentViewSet.as_view({"post": "reply"}),
        name="reply",
    ),
    path(
        "v1/comments/<int:pk>/",
        CommentViewSet.as_view({"delete": "destroy"}),
        name="delete_comment",
    ),
    path(
        "v1/comments/replies/<int:pk>/",
        CommentViewSet.as_view({"delete": "reply"}),
        name="delete_reply",
    ),
    path(
        "v1/comments/", CommentViewSet.as_view({"post": "create"}), name="add_comment"
    ),
    path(
        "v1/users/<int:pk>/comments/",
        CommentViewSet.as_view({"get": "user_comments"}),
        name="user_comments",
    ),
    path(
        "v1/users/me/comments/",
        CommentViewSet.as_view({"get": "me_comments"}),
        name="me_comments",
    ),
    path(
        "v1/comments/statuses/",
        CommentViewSet.as_view({"get": "statuses"}),
        name="statuses",
    ),
    # <--------- Comments --------->
    # <--------- Users ------------>
    path(
        "v1/users/me/",
        UserViewSet.as_view({"get": "me", "delete": "me", "patch": "me"}),
        name="me",
    ),
    path(
        "v1/users/<int:pk>/",
        CustomUserRetrieveViewSet.as_view({"get": "retrieve"}),
        name="users_detail",
    ),
    path(
        "v1/users/activation/",
        UserViewSet.as_view({"post": "activation"}),
        name="set_password",
    ),
    path(
        "v1/users/set_password/",
        UserViewSet.as_view({"post": "set_password"}),
        name="set_password",
    ),
    path(
        "v1/users/",
        CustomUserRegisterViewSet.as_view({"post": "create"}),
        name="register",
    ),
    path("v1/auth/", include("djoser.urls.jwt")),
    # <--------- Users ------------>
]
