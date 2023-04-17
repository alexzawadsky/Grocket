from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

RESPONSE_MESSAGES = {
    "products": {
        "create": _("Product has been successfully placed"),
        "destroy": _("Product has been deleted"),
        "promote": _("Successfully promoted"),
        "sell": {"POST": _("Marked as sold"), "DELETE": _("Placed again")},
        "archive": {
            "POST": _("Moved to the archive"),
            "DELETE": _("Removed from the archive"),
        },
        "favourite": {
            "POST": _("Added to favourites"),
            "DELETE": _("Removed from favourites"),
        },
        # 'updated': _('Product has been updated'),
    },
    "comments": {
        "create": _("Comment added"),
        "destroy": _("Comment deleted"),
        "reply": {"POST": _("Peply added"), "DELETE": _("Reply deleted")},
    },
}


class BaseMixin(GenericViewSet):
    def get_response_message(self, app, method=None):
        try:
            message = RESPONSE_MESSAGES[app][self.action]
            if method is not None:
                message = message[method]
            return {"message": message}
        except KeyError:
            return None

    def list(self, request, queryset, *args, **kwargs):
        queryset = self.filter_queryset(queryset)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
