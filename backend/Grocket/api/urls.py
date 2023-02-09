from django.urls import path
from django.conf.urls import include
from djoser.views import UserViewSet
# from .views import CustomUserViewSet


app_name = 'api'


ME_METHODS = {
    'get': 'me',
    'delete': 'me',
    'patch': 'me',
}


urlpatterns = [
    path('users/me/', UserViewSet.as_view(ME_METHODS), name='me'),
    path(
        'users/<int:pk>/', UserViewSet.as_view({'get': 'retrieve'}),
        name='users_detail'),
    path(
        'users/set_password/',
        UserViewSet.as_view({'post': 'set_password'}),
        name='set_password'),
    path(
        'users/', UserViewSet.as_view({'post': 'create'}),
        name='users'),
    path('auth/', include('djoser.urls.jwt')),
]
