# Generated by Django 4.2 on 2023-04-14 21:11

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0004_alter_category_options"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="category",
            options={"verbose_name": "Category", "verbose_name_plural": "Categories"},
        ),
    ]
