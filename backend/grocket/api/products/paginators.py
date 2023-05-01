from rest_framework.response import Response

from ..paginators import PageLimitPagination


class ProductPageLimitPagination(PageLimitPagination):
    def get_countries(self, data):
        print(data)

    def get_categories(self, data):
        pass

    def get_min_price(self, data):
        pass

    def get_max_price(self, data):
        pass

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
                "min_price": self.get_min_price(data),
                "max_price": self.get_max_price(data),
                "categories": self.get_categories(data),
                "countries": self.get_countries(data),
                "results": data,
            }
        )
