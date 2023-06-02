from rest_framework.response import Response

from products.selectors import get_categories as get_all_categories

from ..paginators import PageLimitPagination
from .serializers import CategoryListSerializer
from products.models import Product


class ProductPageLimitPagination(PageLimitPagination):
    def get_countries(self, data):
        countries = []
        for product in data:
            countries.append(product["address"]["country_code"])
        return set(countries)

    def get_categories(self, data):
        categories = []
        for product in data:
            categories.append(product["category"]["id"])
        queryset = get_all_categories(id__in=set(categories))
        return CategoryListSerializer(instance=queryset, many=True).data

    def get_min_price(self, data):
        return min(data, key=lambda x: x['price'])['price'] if len(data) > 0 else 0

    def get_max_price(self, data):
        return max(data, key=lambda x: x['price'])['price'] if len(data) > 0 else 0

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
