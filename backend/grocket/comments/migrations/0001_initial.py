# Generated by Django 4.1.7 on 2023-04-06 17:09

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(blank=True, max_length=500, verbose_name='comment text')),
                ('rate', models.SmallIntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('pub_date', models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='Pub date')),
            ],
            options={
                'verbose_name': 'comment',
                'verbose_name_plural': 'comments',
                'ordering': ('-pub_date',),
            },
        ),
        migrations.CreateModel(
            name='CommentImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='comments/')),
            ],
            options={
                'verbose_name': 'comment image',
                'verbose_name_plural': 'comment images',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50, verbose_name='title')),
                ('title_en', models.CharField(max_length=50, null=True, verbose_name='title')),
                ('title_ru', models.CharField(max_length=50, null=True, verbose_name='title')),
                ('title_nl', models.CharField(max_length=50, null=True, verbose_name='title')),
                ('name', models.SlugField(verbose_name='code')),
            ],
            options={
                'verbose_name': 'Status',
                'verbose_name_plural': 'Statuses',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='CommentReply',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(max_length=500, verbose_name='reply comment text')),
                ('pub_date', models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='Pub date')),
                ('comment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comment_replies', to='comments.comment', verbose_name='comment')),
            ],
            options={
                'verbose_name': 'comment reply',
                'verbose_name_plural': 'comment replies',
                'ordering': ('-pub_date',),
            },
        ),
    ]