from rest_framework.permissions import SAFE_METHODS, BasePermission
from django.utils.translation import gettext_lazy as _


class IsOwnerOrReadOnly(BasePermission):
    """Пермишен: только автор или чтение."""

    message = _('You are not the author.')

    def has_permission(self, request, view):
        return (request.method in SAFE_METHODS
                or request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        return (request.method in SAFE_METHODS
                or obj.user == request.user)


class IsOwner(BasePermission):
    """Пермишен: только автор."""

    message = _('You are not the author.')

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.author == request.user


class IsAdminOrReadOnly(BasePermission):
    """Пермишен: только админ или чтение."""

    message = _('You do not have permission to perform this action.')

    def has_permission(self, request, view):
        return (request.method in SAFE_METHODS
                or (request.user.is_authenticated and (
                    request.user.is_admin or request.user.is_superuser)))
