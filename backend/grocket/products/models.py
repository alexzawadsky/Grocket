from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from mptt.models import MPTTModel, TreeForeignKey

from .fields import RichTextBleachField

User = get_user_model()


class ProductAddress(models.Model):
    product = models.ForeignKey(
        "Product",
        on_delete=models.CASCADE,
        verbose_name="product",
        related_name="product_addresses",
    )
    full = models.CharField(max_length=200, verbose_name="full address")
    short = models.CharField(max_length=200, verbose_name="short address")
    city = models.CharField(max_length=100, verbose_name="city", blank=True)
    country_code = models.CharField(max_length=2, verbose_name="country code")
    latitude = models.FloatField(
        verbose_name="latitude",
        validators=[MinValueValidator(-90.0), MaxValueValidator(90.0)],
    )
    longitude = models.FloatField(
        verbose_name="longitude",
        validators=[MinValueValidator(-180.0), MaxValueValidator(180.0)],
    )

    class Meta:
        ordering = ("-id",)
        verbose_name = "address"
        verbose_name_plural = "addresses"

    def __str__(self):
        return f"{self.id} prod:{self.product.id} {self.short}"


class Image(models.Model):
    product = models.ForeignKey(
        "Product",
        related_name="images",
        on_delete=models.CASCADE,
        verbose_name="product",
    )
    image = models.ImageField(verbose_name="image", upload_to="images/%Y-%m-%d/")
    is_main = models.BooleanField(verbose_name="is main", default=False)

    class Meta:
        ordering = ("-id",)
        verbose_name = "image"
        verbose_name_plural = "images"

    def __str__(self):
        return f"{self.id} prod:{self.product.id} main:{self.is_main}"


class Category(MPTTModel):
    title = models.CharField(
        max_length=50,
        verbose_name="title",
    )
    parent = TreeForeignKey(
        "self",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="children",
        verbose_name="parent category",
    )

    class MPTTMeta:
        order_insertion_by = ["title"]

    class Meta:
        unique_together = [["parent", "title"]]
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return f"{self.title}"


class Promotion(models.Model):
    title = models.CharField(
        max_length=100,
        verbose_name="title",
    )
    name = models.SlugField(
        max_length=50,
        verbose_name="name",
        unique=True,
    )
    price = models.PositiveIntegerField(verbose_name="price($)")
    description = models.TextField(
        max_length=500,
        verbose_name="description",
    )

    class Meta:
        ordering = ("-id",)
        verbose_name = "promotion"
        verbose_name_plural = "promotions"

    def __str__(self):
        return f"{self.id} {self.name}"


class Product(models.Model):
    name = models.CharField(
        max_length=200,
        verbose_name="name",
    )
    slug = models.SlugField(verbose_name="slug", max_length=200, unique=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="products",
        verbose_name="seller",
    )
    category = TreeForeignKey(
        "Category",
        on_delete=models.PROTECT,
        related_name="posts",
        verbose_name="сategory",
    )
    description = RichTextBleachField(
        max_length=10000,
        verbose_name="description",
    )
    price = models.PositiveIntegerField(verbose_name="price($)")
    promotions = models.ManyToManyField(
        "Promotion",
        related_name="products",
        verbose_name="promotion types",
        blank=True,
    )
    is_archived = models.BooleanField(default=False)
    is_sold = models.BooleanField(default=False)
    pub_date = models.DateTimeField(
        verbose_name="pub date",
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        ordering = ("-pub_date",)
        verbose_name = "product"
        verbose_name_plural = "products"

    def __str__(self):
        return (
            f"{self.id} {self.name[:10] if len(self.name) > 10 else self.name} "
            f"user:{self.user.id} arch:{self.is_archived} sold:{self.is_archived}"
        )


class Favourite(models.Model):
    user = models.ForeignKey(
        User,
        related_name="favourites",
        on_delete=models.CASCADE,
        verbose_name="user",
    )
    product = models.ForeignKey(
        Product,
        related_name="favourites",
        on_delete=models.CASCADE,
        verbose_name="product",
    )

    class Meta:
        ordering = ("-id",)
        verbose_name = "favourite"
        verbose_name_plural = "favourites"
        constraints = [
            models.UniqueConstraint(fields=["user", "product"], name="unique favorite")
        ]

    def __str__(self):
        return f"{self.id} user:{self.user.id} prod:{self.product.id}"
