# Generated by Django 4.2 on 2023-05-10 14:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_promotion_stripe_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='promotion',
            name='stripe_id',
            field=models.CharField(default=None, max_length=50, null=True, verbose_name='stripe_id'),
        ),
    ]
