# Generated by Django 4.2 on 2023-08-23 16:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messenger', '0002_alter_message_options_alter_message_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='text',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
