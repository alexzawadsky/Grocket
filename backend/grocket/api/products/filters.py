from django.db.models import Avg
from django_filters import rest_framework as django_filters

from products.models import Category, Product


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    category_id = django_filters.NumberFilter(field_name="category", method="category")
    country = django_filters.CharFilter(field_name="product_addresses__country_code")
    user_rating = django_filters.NumberFilter(method="rating")

    class Meta:
        model = Product
        fields = ["price"]

    def rating(self, queryset, name, value):
        # print(queryset, value)

        # queryset = queryset.filter(
        #     user__seller_comments__rate__gte=aggregate(
        #         Avg("user__seller_comments__rate")
        #     )
        # )
        # print(queryset)

        return queryset

    def category(self, queryset, name, value):
        category_ids = dict(self.data.lists())["category_id"]
        categories = Category.objects.filter(id__in=category_ids)

        child_categories = []
        for category in categories:
            category_children = category.get_descendants(include_self=True)
            category_children_ids = list(category_children.values_list("id", flat=True))
            child_categories += category_children_ids

        queryset = queryset.filter(category__in=child_categories)

        return queryset
