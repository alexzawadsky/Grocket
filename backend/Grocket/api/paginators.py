from math import ceil

from rest_framework.pagination import PageNumberPagination, Response


class PageLimitPagination(PageNumberPagination):
    page_size_query_param = "limit"

    def get_number_of_pages(self):
        return ceil(
            self.page.paginator.count / self.get_page_size(request=self.request)
        )

    def get_paginated_response(self, data):
        return Response(
            {
                "count": self.page.paginator.count,
                "pages_count": self.get_number_of_pages(),
                "page_number": int(
                    self.get_page_number(
                        request=self.request, paginator=self.page.paginator
                    )
                ),
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "results": data,
            }
        )
