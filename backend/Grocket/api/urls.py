from django.urls import path
from django.conf.urls import include
from djoser.views import UserViewSet
from .views import CustomUserViewSet


app_name = 'api'


urlpatterns = [
    path(
        'users/me/', CustomUserViewSet.as_view({'get': 'me'}),
        name='me'),
    path(
        'users/<int:pk>/', UserViewSet.as_view({'get': 'retrieve'}),
        name='users_detail'),
    path(
        'users/set_password/',
        CustomUserViewSet.as_view({'post': 'set_password'}),
        name='set_password'),
    path(
        'users/', UserViewSet.as_view({'post': 'create'}),
        name='users'),
    path('auth/', include('djoser.urls.jwt')),
]
