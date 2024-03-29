# Generated by Django 4.2 on 2023-08-21 16:51

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('products', '0004_rename_title_zh_hant_category_title_zh_hans_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='chats', to='products.product')),
                ('user_from', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_from_chats', to=settings.AUTH_USER_MODEL)),
                ('user_to', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_to_chats', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'chat',
                'verbose_name_plural': 'chats',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=1000)),
                ('image', models.ImageField(blank=True, upload_to='messages/%Y-%m-%d/', verbose_name='image')),
                ('pub_date', models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='pub date')),
                ('is_edited', models.BooleanField(default=False)),
                ('is_seen', models.BooleanField(default=False)),
                ('answer_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='replies', to='messenger.message')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messenger', to=settings.AUTH_USER_MODEL)),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='messenger.chat')),
            ],
            options={
                'verbose_name': 'message',
                'verbose_name_plural': 'messages',
                'ordering': ('pub_date',),
            },
        ),
    ]
