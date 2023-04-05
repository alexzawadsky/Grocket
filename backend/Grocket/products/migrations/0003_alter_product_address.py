# Generated by Django 4.1.7 on 2023-04-05 20:00

import address.models
from django.db import migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('address', '0003_auto_20200830_1851'),
        ('products', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='address',
            field=address.models.AddressField(on_delete=django.db.models.deletion.PROTECT, related_name='products', to='address.address', verbose_name='address'),
        ),
    ]
