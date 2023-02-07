from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from djmoney.models.fields import MoneyField
from address.models import AddressField
from users.models import User
from core.models import WithDateModel, WithImageAlbumModel


class Product(WithDateModel, WithImageAlbumModel):
    name = models.CharField(
        max_length=200,
        verbose_name='Название товара',
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name='Продавец',
    )
    description = models.TextField(
        max_length=1000,
    )
    price = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency='USD',
    )
    address = AddressField()
    is_archived = models.BooleanField(default=False)
    is_sold = models.BooleanField(default=False)

    class Meta:
        ordering = ('-id',)
        verbose_name = 'Избранный'
        verbose_name_plural = 'Избранное'

    def __str__(self):
        return f'{self.name}, {self.user.username}'


class Favourite(models.Model):
    user = models.ForeignKey(
        User,
        related_name='favorites',
        on_delete=models.CASCADE,
    )
    product = models.ForeignKey(
        'Product',
        related_name='favorites',
        on_delete=models.CASCADE,
    )

    class Meta:
        ordering = ('-id',)
        verbose_name = 'Избранный'
        verbose_name_plural = 'Избранное'
        constraints = [models.UniqueConstraint(fields=['user', 'product'],
                       name='unique favorite')]

    def __str__(self):
        return f'{self.user.username}, {self.product.name}'


class Comment(WithDateModel):
    user = models.ForeignKey(
        User,
        related_name='comments',
        on_delete=models.CASCADE,
    )
    product = models.ForeignKey(
        'Product',
        related_name='comments',
        on_delete=models.CASCADE,
    )
    text = models.TextField(
        blank=True,
    )
    rate = models.SmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
