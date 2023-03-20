from math import ceil

from rest_framework.pagination import PageNumberPagination, Response


class PageLimitPagination(PageNumberPagination):
    page_size_query_param = 'limit'

    def get_number_of_pages(self):
        return ceil(
            self.page.paginator.count /
            self.get_page_size(request=self.request)
        )

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'pages_count': self.get_number_of_pages(),
            'page_number': int(self.get_page_number(
                request=self.request,
                paginator=self.page.paginator
            )),
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'results': data
        })


class CommentPageLimitPagination(PageLimitPagination):
    def get_stats(self, data):
        rates = []
        for comment in data:
            rates.append(comment['rate'])

        avg = 0 if len(rates) == 0 else round((sum(rates) / len(rates)), 2)

        stats = {
            'avg': avg,
            '1': rates.count(1),
            '2': rates.count(2),
            '3': rates.count(3),
            '4': rates.count(4),
            '5': rates.count(5)
        }

        return stats

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'pages_count': self.get_number_of_pages(),
            'page_number': int(self.get_page_number(
                request=self.request,
                paginator=self.page.paginator
            )),
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'stats': self.get_stats(data),
            'results': data
        })
