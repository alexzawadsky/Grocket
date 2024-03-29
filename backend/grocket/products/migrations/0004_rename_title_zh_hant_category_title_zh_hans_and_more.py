# Generated by Django 4.2 on 2023-08-21 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_alter_category_title_alter_category_title_de_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='category',
            old_name='title_zh_hant',
            new_name='title_zh_hans',
        ),
        migrations.RenameField(
            model_name='promotion',
            old_name='description_zh_hant',
            new_name='description_zh_hans',
        ),
        migrations.RenameField(
            model_name='promotion',
            old_name='title_zh_hant',
            new_name='title_zh_hans',
        ),
        migrations.AlterField(
            model_name='productaddress',
            name='city',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='city'),
        ),
    ]
