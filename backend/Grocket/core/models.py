from django.db import models


class WithDateModel(models.Model):
    """Абстрактная модель. Добавляет дату создания."""

    pub_date = models.DateTimeField(
        'Дата создания',
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        abstract = True
