from django.db import models

from products.models import Product, Promotion


class StripePromotionsTransaction(models.Model):
    product = models.ForeignKey(
        Product,
        related_name="transactions",
        on_delete=models.CASCADE,
        verbose_name="product",
    )

    promotions = models.ManyToManyField(
        Promotion,
        related_name="transaction",
        verbose_name="promotion types",
        blank=False,
    )

    pub_date = models.DateTimeField(
        "Pub date",
        auto_now_add=True,
        db_index=True,
    )

    stripe_id = models.CharField(
        max_length=100,
        verbose_name='stripe_id',
        default=None,
        null=True
    )

    class Meta:
        ordering = ("-id",)
        verbose_name = "stripe promotions transaction"
        verbose_name_plural = "stripe promotions transaction"

    def __str__(self):
        return f"{self.id} transaction"

