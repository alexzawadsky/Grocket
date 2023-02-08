from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from djmoney.models.fields import MoneyField
from users.models import User
from core.models import WithDateModel
from mptt.models import MPTTModel, TreeForeignKey
from django.urls import reverse


class Image(models.Model):
    product = models.ForeignKey(
        'Product',
        related_name='images',
        on_delete=models.CASCADE,
        verbose_name='product image',
    )
    image = models.ImageField(upload_to='images/')
    is_main = models.BooleanField(default=False)


class Category(MPTTModel):
    title = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='category title',
    )
    parent = TreeForeignKey(
        'self',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='children',
        db_index=True,
        verbose_name='Родительская категория'
    )
    slug = models.SlugField(
        max_length=150,
    )

    class MPTTMeta:
        order_insertion_by = ['title']

    class Meta:
        unique_together = [['parent', 'slug']]
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def get_absolute_url(self):
        return reverse('post-by-category', args=[str(self.slug)])

    def __str__(self):
        return self.title


class Product(WithDateModel):
    name = models.CharField(
        max_length=200,
        verbose_name='product name',
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name='seller',
    )
    slug = models.SlugField(
        max_length=150,
    )
    category = TreeForeignKey(
        'Category',
        on_delete=models.PROTECT,
        related_name='posts',
        verbose_name='Категория'
    )
    description = models.TextField(
        max_length=1000,
        verbose_name='product description',
    )
    price = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency='USD',
        verbose_name='product price',
    )
    # Потом сделать нормальное поле!!!!!!!!!
    address = models.CharField(
        max_length=150,
        verbose_name='product address',
        default='no address',
    )
    is_archived = models.BooleanField(default=False)
    is_sold = models.BooleanField(default=False)

    class Meta:
        ordering = ('-id',)
        verbose_name = 'product'
        verbose_name_plural = 'products'

    def __str__(self):
        return f'{self.name}, {self.user.username}, {self.price}'


class Favourite(models.Model):
    user = models.ForeignKey(
        User,
        related_name='favorites',
        on_delete=models.CASCADE,
        verbose_name='customer',
    )
    product = models.ForeignKey(
        'Product',
        related_name='favorites',
        on_delete=models.CASCADE,
        verbose_name='favorite product',
    )

    class Meta:
        ordering = ('-id',)
        verbose_name = 'favourite'
        verbose_name_plural = 'favourites'
        constraints = [models.UniqueConstraint(fields=['user', 'product'],
                       name='unique favorite')]

    def __str__(self):
        return f'{self.user.username}, {self.product.name}'


class Comment(WithDateModel):
    user = models.ForeignKey(
        User,
        related_name='comments',
        on_delete=models.CASCADE,
        verbose_name='customer',
    )
    product = models.ForeignKey(
        'Product',
        related_name='comments',
        on_delete=models.CASCADE,
        verbose_name='commented product',
    )
    text = models.TextField(
        max_length=500,
        blank=True,
        verbose_name='comment text',
    )
    rate = models.SmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )

    class Meta:
        ordering = ('-id',)
        verbose_name = 'comment'
        verbose_name_plural = 'comments'

    def __str__(self):
        return f'{self.user.username}, {self.product.name}, {self.rate}'
