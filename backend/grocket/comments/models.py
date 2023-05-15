from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from products.models import Product
from users.models import User


class Status(models.Model):
    title = name = models.CharField(
        max_length=50,
        verbose_name="title",
    )
    name = models.SlugField(
        max_length=50,
        verbose_name="code",
    )

    class Meta:
        ordering = ("-id",)
        verbose_name = "Status"
        verbose_name_plural = "Statuses"

    def __str__(self):
        return f"{self.id} {self.name}"


class CommentImage(models.Model):
    comment = models.ForeignKey(
        "Comment",
        related_name="comment_images",
        on_delete=models.CASCADE,
        verbose_name="comment",
    )
    image = models.ImageField(
        upload_to="comments/",
    )

    class Meta:
        ordering = ("-id",)
        verbose_name = "comment image"
        verbose_name_plural = "comment images"

    def __str__(self):
        return f"{self.id} com:{self.comment.id}"


class Comment(models.Model):
    user = models.ForeignKey(
        User,
        related_name="user_comments",
        on_delete=models.CASCADE,
        verbose_name="user",
    )
    seller = models.ForeignKey(
        User,
        related_name="seller_comments",
        on_delete=models.CASCADE,
        verbose_name="seller",
    )
    product = models.ForeignKey(
        Product,
        related_name="comments",
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="product",
    )
    status = models.ForeignKey(
        "Status",
        related_name="comments",
        on_delete=models.PROTECT,
        verbose_name="status",
    )
    text = models.TextField(
        max_length=500,
        blank=True,
        verbose_name="text",
    )
    rate = models.SmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    pub_date = models.DateTimeField(
        "Pub date",
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        ordering = ("-pub_date",)
        verbose_name = "comment"
        verbose_name_plural = "comments"
        constraints = [
            models.UniqueConstraint(fields=["user", "product"], name="unique сomment")
        ]

    def __str__(self):
        return (
            f"{self.id} user:{self.user.id} sel:{self.seller.id} prod:{self.product.id}"
        )


class CommentReply(models.Model):
    user = models.ForeignKey(
        User,
        related_name="comment_replies",
        on_delete=models.CASCADE,
        verbose_name="seller",
    )
    comment = models.ForeignKey(
        "Comment",
        related_name="comment_replies",
        on_delete=models.CASCADE,
        verbose_name="comment",
    )
    text = models.TextField(
        max_length=500,
        verbose_name="text",
    )
    pub_date = models.DateTimeField(
        "Pub date",
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        ordering = ("-pub_date",)
        verbose_name = "comment reply"
        verbose_name_plural = "comment replies"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "comment"], name="unique сomment reply"
            )
        ]

    def __str__(self):
        return f"{self.id} user:{self.user.id} com:{self.comment.id}"
