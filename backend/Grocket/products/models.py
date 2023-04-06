from django.contrib.auth import get_user_model
from django.db import models
from djmoney.models.fields import MoneyField
from mptt.models import MPTTModel, TreeForeignKey

from .fields import RichTextBleachField

User = get_user_model()


class ProductAddress(models.Model):
    product = models.ForeignKey(
        'Product',
        on_delete=models.CASCADE,
        verbose_name='product',
        related_name='product_addresses'
    )
    full = models.CharField(
        max_length=150,
        verbose_name='full address'
    )
    short = models.CharField(
        max_length=150,
        verbose_name='short address'
    )
    city = models.CharField(
        max_length=150,
        verbose_name='city'
    )
    country_code = models.CharField(
        max_length=2,
        verbose_name='country code'
    )
    latitude = models.FloatField(
        verbose_name='latitude'
    )
    longitude = models.FloatField(
        verbose_name='longitude'
    )

    class Meta:
        ordering = ('-id',)
        verbose_name = 'product address'
        verbose_name_plural = 'product addresses'

    def __str__(self):
        return f'{self.id} prod:{self.product.id} {self.short}'


class Image(models.Model):
    product = models.ForeignKey(
        'Product',
        related_name='images',
        on_delete=models.CASCADE,
        verbose_name='product',
    )
    image = models.ImageField(upload_to='images/')
    is_main = models.BooleanField(default=False)

    class Meta:
        ordering = ('-id',)
        verbose_name = 'product image'
        verbose_name_plural = 'product images'

    def __str__(self):
        return f'{self.id} prod:{self.product.id} main:{self.is_main}'


class Category(MPTTModel):
    title = models.CharField(
        max_length=50,
        verbose_name='category title',
    )
    parent = TreeForeignKey(
        'self',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='children',
        db_index=True,
        verbose_name='parent category'
    )

    class MPTTMeta:
        order_insertion_by = ['title']

    class Meta:
        unique_together = [['parent', 'title']]
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        parent_obj = self.parent
        if parent_obj is None:
            parent = None
        else:
            parent = parent_obj.id
        return f'{self.id} parent:{parent}'


class Promotion(models.Model):
    title = models.CharField(
        max_length=100,
        verbose_name='title',
    )
    name = models.SlugField(
        max_length=50,
        verbose_name='name',
        unique=True,
    )
    price = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency='USD',
        verbose_name='price',
    )
    description = models.TextField(
        max_length=500,
        verbose_name='description',
    )

    class Meta:
        ordering = ('-id',)
        verbose_name = 'promotion'
        verbose_name_plural = 'promotions'

    def __str__(self):
        return f'{self.id} {self.name}'


class Product(models.Model):
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
    category = TreeForeignKey(
        'Category',
        on_delete=models.PROTECT,
        related_name='posts',
        verbose_name='сategory',
    )
    description = RichTextBleachField(
        max_length=1000,
        verbose_name='product description',
    )
    price = MoneyField(
        max_digits=19,
        decimal_places=2,
        default_currency='USD',
        verbose_name='product price',
    )
    promotions = models.ManyToManyField(
        'Promotion',
        related_name='products',
        verbose_name='product promotion types',
        blank=True,
    )
    is_archived = models.BooleanField(default=False)
    is_sold = models.BooleanField(default=False)
    pub_date = models.DateTimeField(
        'Pub date',
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        ordering = ('-pub_date',)
        verbose_name = 'product'
        verbose_name_plural = 'products'

    def __str__(self):
        return (
            f'{self.id} user:{self.user.id} cat:{self.category.id} '
            f'arch:{self.is_archived} sold:{self.is_archived}'
        )


class Favourite(models.Model):
    user = models.ForeignKey(
        User,
        related_name='favourites',
        on_delete=models.CASCADE,
        verbose_name='user',
    )
    product = models.ForeignKey(
        Product,
        related_name='favourites',
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
        return f'{self.id} user:{self.user.id} prod:{self.product.id}'
