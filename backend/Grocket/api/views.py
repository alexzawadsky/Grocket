from djoser.views import UserViewSet
from rest_framework import permissions


class CustomUserRetrieveViewSet(UserViewSet):
    permission_classes = (permissions.AllowAny,)
