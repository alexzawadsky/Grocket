import csv

from django.core.management.base import BaseCommand

from products.models import Promotion


class Command(BaseCommand):
    """Загрузка ингредиентов из CSV в БД."""

    def handle(self, *args, **options):
        with open(
            'csv/promotions.csv', newline='', encoding="utf-8"
        ) as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
            next(spamreader)

            for string in spamreader:
                name, title, price, price_currency, description = string
                if not Promotion.objects.filter(name=name).exists():
                    Promotion.objects.create(
                        name=name,
                        title=title,
                        price=price,
                        price_currency=price_currency,
                        description=description
                    )
                    print(f'Успешно добавлен: {name}')
                print(f'Пропущен: {name}')
