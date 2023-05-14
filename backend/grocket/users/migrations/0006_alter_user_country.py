# Generated by Django 4.2 on 2023-05-14 15:33

from django.db import migrations
import django_countries.fields


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_alter_user_country'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='country',
            field=django_countries.fields.CountryField(default='US', max_length=2),
        ),
    ]