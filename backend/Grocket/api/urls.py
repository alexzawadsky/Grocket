from django.conf.urls import include
from django.urls import path
from djoser.views import UserViewSet
from rest_framework.routers import DefaultRouter

from .views import (CategoryViewSet, CustomUserRegisterViewSet,
                    CustomUserRetrieveViewSet, FavouriteViewSet,
                    ProductViewSet, PromotionViewSet,
                    CommentViewSet)

app_name = 'api'


ME_METHODS = {
    'get': 'me',
    'delete': 'me',
    'patch': 'me',
}


router = DefaultRouter()
router.register('products', ProductViewSet, basename='product')
router.register('promotions', PromotionViewSet, basename='promotion')
router.register('categories', CategoryViewSet, basename='category')


urlpatterns = [
    # <--------- Products --------->
    path('v1/products/<int:pk>/sell/',
         ProductViewSet.as_view({'post': 'sell', 'delete': 'sell'}),
         name='sell'),
    path('v1/products/<int:pk>/promote/',
         ProductViewSet.as_view({'post': 'promote'}),
         name='promote'),
    path('v1/products/<int:pk>/favourite/',
         FavouriteViewSet.as_view({'post': 'post', 'delete': 'delete'}),
         name='favourite'),
    path('v1/users/<int:pk>/products/',
         ProductViewSet.as_view({'get': 'user_products'}),
         name='user_products'),
    path('v1/users/me/products/',
         ProductViewSet.as_view({'get': 'me_products'}),
         name='me_products'),
    # <--------- Products --------->

    # <--------- Comments --------->
    path('v1/comments/<int:pk>/reply/',
         CommentViewSet.as_view({'post': 'reply'}),
         name='reply'),
    path('v1/comments/<int:pk>/',
         CommentViewSet.as_view({'delete': 'delete'}),
         name='delete_comment'),
    path('v1/comments/',
         CommentViewSet.as_view({'post': 'post'}),
         name='add_comment'),
    path('v1/users/<int:pk>/comments/',
         CommentViewSet.as_view({'get': 'user_comments'}),
         name='user_comments'),
    path('v1/users/me/comments/',
         CommentViewSet.as_view({'get': 'me_comments'}),
         name='me_comments'),
    # <--------- Comments --------->

    # <--------- Users ------------>
    path('v1/users/me/',
         UserViewSet.as_view(ME_METHODS),
         name='me'),
    path('v1/users/<int:pk>/',
         CustomUserRetrieveViewSet.as_view({'get': 'retrieve'}),
         name='users_detail'),
    path('v1/users/activation/',
         UserViewSet.as_view({'post': 'activation'}),
         name='set_password'),
    path('v1/users/set_password/',
         UserViewSet.as_view({'post': 'set_password'}),
         name='set_password'),
    path('v1/users/',
         CustomUserRegisterViewSet.as_view({'post': 'create'}),
         name='register'),
    path('v1/auth/', include('djoser.urls.jwt')),
    # <--------- Users ------------>

    path('v1/', include(router.urls)),
]
