import csv

from django.core.management.base import BaseCommand

from products.models import Category


class Command(BaseCommand):
    """Загрузка категорий из CSV в БД."""
    def validate_and_type(self, title, parent, category_id):
        if parent.isdigit():
            parent = int(parent)
        elif parent == 'null':
            parent = None
        else:
            raise TypeError(
                'parent_id может быть только числом и null')

        if category_id.isdigit():
            category_id = int(category_id)
        else:
            raise TypeError(
                'category_id может быть только числом')

        title = str(title)

        return title, parent, category_id

    def handle(self, *args, **options):
        with open(
            'csv/categories.csv', newline='', encoding="utf-8"
        ) as csvfile:
            spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
            next(spamreader)

            categories = {}
            for string in spamreader:
                title, parent, category_id = string[0].split(',')

                title, parent, category_id = self.validate_and_type(
                    title, parent, category_id
                )

                if category_id not in categories.keys():
                    if parent is None:
                        if not Category.objects.filter(title=title).exists():
                            category = Category.objects.create(title=title)
                        else:
                            raise ValueError(
                                f'Категория с title={title} уже есть в бд.')
                    elif parent in categories.keys():
                        parent_category = categories[parent]
                        if not Category.objects.filter(title=title).exists():
                            category = Category.objects.create(
                                title=title,
                                parent=parent_category
                            )
                        else:
                            raise ValueError(
                                f'Категория с title={title} уже есть в бд.')
                    else:
                        raise ValueError(
                                f'Нет категории с id={parent}'
                                f' или она идет дальше в списке.'
                            )
                    categories[category_id] = category
                    print(f'Удачно добавлена: {category.title}')
                else:
                    raise ValueError(
                        f'Категория с id={category_id} уже соществует')
