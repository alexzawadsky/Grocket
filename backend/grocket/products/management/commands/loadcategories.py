import json

from django.conf import settings
from django.core.management.base import BaseCommand

from products.models import Category

url = settings.JSON_URL


class bcolors:
    HEADER = "\033[95m"
    OKBLUE = "\033[94m"
    OKCYAN = "\033[96m"
    OKGREEN = "\033[92m"
    WARNING = "\033[93m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"


class Command(BaseCommand):
    """Парсит json файл с категориями и записывает их в БД."""

    def handle(self, *args, **options):
        with open(f"{url}/categories.json", "r", encoding="utf-8") as file:
            data = json.load(file)

        items = data.get("items")

        added, missed = 0, 0
        for item in items:
            id = item.get("id")
            name = item.get("name")
            parent_id = item.get("parentId")

            if not Category.objects.filter(id=id).exists():
                if parent_id is None:
                    Category.objects.create(id=id, title_en=name)
                else:
                    parent = Category.objects.get(id=parent_id)
                    Category.objects.create(id=id, title_en=name, parent=parent)
                added += 1
            else:
                missed += 1

        print(f"{bcolors.OKGREEN}Добавлено: {added}")
        print(f"{bcolors.FAIL}Пропущено: {missed}")
