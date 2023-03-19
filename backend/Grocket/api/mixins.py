# from rest_framework import exceptions as rest_exceptions
# from django.core.exceptions import ValidationError
# from project.common.utils import get_error_message


# class ErrorsMixin:
#     """
#     Mixin that transforms Django and Python exceptions into rest_framework ones.
#     Without the mixin, they return 500 status code which is not desired.
#     """
#     expected_exceptions = {
#         ValueError: rest_exceptions.ValidationError,
#         ValidationError: rest_exceptions.ValidationError,
#         PermissionError: rest_exceptions.PermissionDenied
#     }

#     def handle_exception(self, exc):
#         if isinstance(exc, tuple(self.expected_exceptions.keys())):
#             drf_exception_class = self.expected_exceptions[exc.__class__]
#             drf_exception = drf_exception_class(get_error_message(exc))
#             return super().handle_exception(drf_exception)
#         return super().handle_exception(exc)
