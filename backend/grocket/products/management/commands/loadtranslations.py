import json

from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **options):
        with open("data/json/categories.json", mode="r", encoding="UTF-8") as f:
            categories = json.load(f)

            for i in range(len(categories)):
                pk = categories[i].get("pk")

                with open(
                    "data/json/translated_categories.json",
                    mode="r",
                    encoding="UTF-8",
                ) as f:
                    translated_categories = json.load(f)

                    for translated_category in translated_categories:
                        if translated_category.get("pk") == pk:
                            translations = {
                                "title_zh-hant": translated_category.get(
                                    "title_zh-hant"
                                ),
                                "title_fr": translated_category.get("title_fr"),
                                "title_de": translated_category.get("title_de"),
                                "title_nl": translated_category.get("title_nl"),
                                "title_sv": translated_category.get("title_sv"),
                                "title_uk": translated_category.get("title_uk"),
                                "title_it": translated_category.get("title_it"),
                                "title_pl": translated_category.get("title_pl"),
                            }

                categories[i]["fields"].update(translations)

        with open("data/json/categories.json", mode="w", encoding="UTF-8") as f:
            f.write(json.dumps(categories, indent="    "))
