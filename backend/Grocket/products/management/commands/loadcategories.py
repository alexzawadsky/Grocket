import json
from django.core.management.base import BaseCommand
from products.models import Category
from django.conf import settings

url = settings.JSON_URL


class Command(BaseCommand):
    def handle(self, *args, **options):
        with open(f'{url}/categories.json', 'r', encoding="utf-8") as file:
            data = json.load(file)

        items = data.get('items')

        added, missed = 0, 0
        for item in items:
            id = item.get('id')
            name = item.get('name')
            parent_id = item.get('parentId')

            if not Category.objects.filter(id=id).exists():
                if parent_id is None:
                    Category.objects.create(
                        id=id,
                        title_en=name
                    )
                else:
                    parent = Category.objects.get(id=parent_id)
                    Category.objects.create(
                        id=id,
                        title_en=name,
                        parent=parent
                    )
                added += 1
            else:
                missed += 1

        print(f'Добавлено: {added}')
        print(f'Пропущено: {missed}')
