from django.urls import path
from django.conf.urls import include
from djoser.views import UserViewSet


app_name = 'api'


urlpatterns = [
    path(
        'users/', UserViewSet.as_view({'post': 'create'}),
        name='users'),
    path('auth/', include('djoser.urls.jwt')),
]
