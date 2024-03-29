# Generated by Django 4.2 on 2023-05-14 13:36

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('comments', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='commentreply',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comment_replies', to=settings.AUTH_USER_MODEL, verbose_name='seller'),
        ),
        migrations.AddField(
            model_name='commentimage',
            name='comment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comment_images', to='comments.comment', verbose_name='comment'),
        ),
        migrations.AddField(
            model_name='comment',
            name='product',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='comments', to='products.product', verbose_name='product'),
        ),
        migrations.AddField(
            model_name='comment',
            name='seller',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='seller_comments', to=settings.AUTH_USER_MODEL, verbose_name='seller'),
        ),
        migrations.AddField(
            model_name='comment',
            name='status',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='comments', to='comments.status', verbose_name='status'),
        ),
        migrations.AddField(
            model_name='comment',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_comments', to=settings.AUTH_USER_MODEL, verbose_name='user'),
        ),
        migrations.AddConstraint(
            model_name='commentreply',
            constraint=models.UniqueConstraint(fields=('user', 'comment'), name='unique сomment reply'),
        ),
        migrations.AddConstraint(
            model_name='comment',
            constraint=models.UniqueConstraint(fields=('user', 'product'), name='unique сomment'),
        ),
    ]
