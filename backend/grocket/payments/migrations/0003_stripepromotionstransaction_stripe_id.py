# Generated by Django 4.2 on 2023-05-10 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0002_stripepromotionstransaction_pub_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='stripepromotionstransaction',
            name='stripe_id',
            field=models.CharField(default=None, max_length=50, null=True, verbose_name='stripe_id'),
        ),
    ]
