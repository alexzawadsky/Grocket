from rest_framework.response import Response

from ..paginators import PageLimitPagination


class ProductPageLimitPagination(PageLimitPagination):
    def get_stats(self, data):
        rates = []
        for comment in data:
            rates.append(comment["rate"])

        rates_lenth = len(rates)
        avg = 0 if rates_lenth == 0 else round((sum(rates) / rates_lenth), 2)

        stats = {
            "avg": avg,
            "1": rates.count(1),
            "2": rates.count(2),
            "3": rates.count(3),
            "4": rates.count(4),
            "5": rates.count(5),
        }

        return stats

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
                "countries": self.get
                "results": data,
            }
        )
