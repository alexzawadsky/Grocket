from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from products.models import Product
from users.models import User
from django.conf import settings


def status_validate(value):
    if value not in settings.COMMENT_STATUSES:
        raise ValueError('Нет такого статуса.')


class CommentImage(models.Model):
    comment = models.ForeignKey(
        'Comment',
        related_name='comment_images',
        on_delete=models.CASCADE,
        verbose_name='comment',
    )
    image = models.ImageField(upload_to='comments/')

    class Meta:
        ordering = ('-id',)
        verbose_name = 'comment image'
        verbose_name_plural = 'comment images'

    def __str__(self):
        return f'comment: {self.comment.id}'


class Comment(models.Model):
    user = models.ForeignKey(
        User,
        related_name='user_comments',
        on_delete=models.CASCADE,
        verbose_name='user',
    )
    seller = models.ForeignKey(
        User,
        related_name='seller_comments',
        on_delete=models.CASCADE,
        verbose_name='seller',
    )
    product = models.ForeignKey(
        Product,
        related_name='comments',
        on_delete=models.SET_NULL,  # Мб потом поменять!!!
        null=True,
        verbose_name='commented product',
    )
    status = models.CharField(
        max_length=50,
        verbose_name='status',
        validators=[status_validate]
    )
    text = models.TextField(
        max_length=500,
        blank=True,
        verbose_name='comment text',
    )
    rate = models.SmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    pub_date = models.DateTimeField(
        'Pub date',
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        ordering = ('-pub_date',)
        verbose_name = 'comment'
        verbose_name_plural = 'comments'
        constraints = [models.UniqueConstraint(fields=['user', 'product'],
                       name='unique сomment')]

    def __str__(self):
        return f'{self.user.username}, {self.product.name}, {self.rate}'


class CommentReply(models.Model):
    user = models.ForeignKey(
        User,
        related_name='comment_replies',
        on_delete=models.CASCADE,
        verbose_name='seller',
    )
    comment = models.ForeignKey(
        'Comment',
        related_name='comment_replies',
        on_delete=models.CASCADE,
        verbose_name='comment',
    )
    text = models.TextField(
        max_length=500,
        verbose_name='reply comment text',
    )
    pub_date = models.DateTimeField(
        'Pub date',
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        ordering = ('-pub_date',)
        verbose_name = 'comment reply'
        verbose_name_plural = 'comment replies'
        constraints = [models.UniqueConstraint(fields=['user', 'comment'],
                       name='unique сomment reply')]

    def __str__(self):
        return f'{self.user.username}, init comment: {self.comment.id}'
