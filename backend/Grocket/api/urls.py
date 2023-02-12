from django.urls import path
from django.conf.urls import include
from djoser.views import UserViewSet
from .views import CustomUserRetrieveViewSet


app_name = 'api'


ME_METHODS = {
    'get': 'me',
    'delete': 'me',
    'patch': 'me',
}


urlpatterns = [
    path('v1/users/me/', UserViewSet.as_view(ME_METHODS), name='me'),
    path('v1/users/<int:pk>/',
         CustomUserRetrieveViewSet.as_view({'get': 'retrieve'}),
         name='users_detail'),
    path(
        'v1/users/set_password/',
        UserViewSet.as_view({'post': 'set_password'}),
        name='set_password'),
    path(
        'v1/users/', UserViewSet.as_view({'post': 'create'}),
        name='users'),
    path('v1/auth/', include('djoser.urls.jwt')),
]
