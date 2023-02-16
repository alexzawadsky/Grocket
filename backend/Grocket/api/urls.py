from django.conf.urls import include
from django.urls import path
from djoser.views import UserViewSet
from rest_framework.routers import DefaultRouter

from .views import (CategoryViewSet, CustomUserRegisterViewSet,
                    CustomUserRetrieveViewSet, ProductViewSet)

app_name = 'api'


ME_METHODS = {
    'get': 'me',
    'delete': 'me',
    'patch': 'me',
}


router = DefaultRouter()
router.register('products', ProductViewSet, basename='product')
router.register('categories', CategoryViewSet, basename='category')


urlpatterns = [
    path('v1/users/<int:pk>/products/',
         ProductViewSet.as_view({'get': 'user_products'}),
         name='user_products'),
    path('v1/users/me/products/',
         ProductViewSet.as_view({'get': 'me_products'}),
         name='me_products'),
    path('v1/users/me/', UserViewSet.as_view(ME_METHODS), name='me'),
    path('v1/users/<int:pk>/',
         CustomUserRetrieveViewSet.as_view({'get': 'retrieve'}),
         name='users_detail'),
    path(
        'v1/users/set_password/',
        UserViewSet.as_view({'post': 'set_password'}),
        name='set_password'),
    path(
        'v1/users/', CustomUserRegisterViewSet.as_view({'post': 'create'}),
        name='register'),
    path('v1/', include(router.urls)),
    path('v1/auth/', include('djoser.urls.jwt')),
]
