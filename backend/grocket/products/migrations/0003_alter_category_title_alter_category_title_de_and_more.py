# Generated by Django 4.2 on 2023-05-19 09:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='title',
            field=models.CharField(max_length=150, verbose_name='title'),
        ),
        migrations.AlterField(
            model_name='category',
            name='title_de',
            field=models.CharField(max_length=150, null=True, verbose_name='title'),
        ),
        migrations.AlterField(
            model_name='category',
            name='title_en',
            field=models.CharField(max_length=150, null=True, verbose_name='title'),
        ),
        migrations.AlterField(
            model_name='category',
            name='title_fr',
            field=models.CharField(max_length=150, null=True, verbose_name='title'),
        ),
        migrations.AlterField(
            model_name='category',
            name='title_it',
            field=models.CharField(max_length=150, null=True, verbose_name='title'),
        ),
        migrations.AlterField(
            model_name='category',
            name='title_nl',
            field=models.CharField(max_length=150, null=True, verbose_name='title'),
        ),
        migrations.AlterField(
            model_name='category',
            name='title_pl',
            field=models.CharField(max_length=150, null=True, verbose_name='title'),
        ),
        migrations.AlterField(
            model_name='category',
            name='title_ru',
            field=models.CharField(max_length=150, null=True, verbose_name='title'),
        ),
        migrations.AlterField(
            model_name='category',
            name='title_sv',
            field=models.CharField(max_length=150, null=True, verbose_name='title'),
        ),
        migrations.AlterField(
            model_name='category',
            name='title_uk',
            field=models.CharField(max_length=150, null=True, verbose_name='title'),
        ),
        migrations.AlterField(
            model_name='category',
            name='title_zh_hant',
            field=models.CharField(max_length=150, null=True, verbose_name='title'),
        ),
    ]
