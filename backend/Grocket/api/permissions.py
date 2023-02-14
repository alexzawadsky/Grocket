from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsOwnerOrReadOnly(BasePermission):
    """Пермишен: только автор или чтение."""

    message = 'Вы не являетесь автором.'

    def has_permission(self, request, view):
        return (request.method in SAFE_METHODS
                or request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        return (request.method in SAFE_METHODS
                or obj.author == request.user)


# class IsOwner(BasePermission):
#     """Пермишен: только автор."""

#     message = 'Вы не являетесь автором.'

#     def has_permission(self, request, view):
#         return request.user.is_authenticated

#     def has_object_permission(self, request, view, obj):
#         return obj.author == request.user


# class IsAdminOrReadOnly(BasePermission):
#     """Пермишен: только админ или чтение."""

#     message = 'У вас нет прав для выполнения этого действия.'

#     def has_permission(self, request, view):
#         return (request.method in SAFE_METHODS
#                 or (request.user.is_authenticated and (
#                     request.user.is_admin or request.user.is_superuser)))
