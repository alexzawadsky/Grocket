from djoser import views as djviews
from rest_framework import permissions, status
from rest_framework.response import Response

from core.views import avatar_img_creating


class CustomUserRetrieveViewSet(djviews.UserViewSet):
    permission_classes = (permissions.AllowAny,)


class CustomUserRegisterViewSet(djviews.UserViewSet):
    def create(self, request):
        data = request.data
        data_keys = data.keys()

        if 'first_name' not in data_keys or 'last_name' not in data_keys:
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)

        first_name = data['first_name']
        last_name = data['last_name']

        if 'avatar' not in data_keys:
            data['avatar'] = avatar_img_creating(first_name, last_name)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
