# Generated by Django 4.2 on 2023-08-23 16:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='message',
            options={'ordering': ('-pub_date',), 'verbose_name': 'message', 'verbose_name_plural': 'messages'},
        ),
        migrations.AlterField(
            model_name='message',
            name='text',
            field=models.CharField(blank=True, max_length=1000),
        ),
    ]
