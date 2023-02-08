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


# class ImageAlbum(models.Model):
#     def default(self):
#         return self.images.filter(default=True).first()

#     def images(self):
#         return self.images.all()


# class Image(models.Model):
#     image = models.ImageField(upload_to='images/')
#     default = models.BooleanField(default=False)
#     album = models.ForeignKey(
#         ImageAlbum,
#         related_name='images',
#         on_delete=models.CASCADE,
#     )


# class WithImageAlbumModel(models.Model):
#     album = models.OneToOneField(
#         ImageAlbum,
#         related_name='products',
#         on_delete=models.CASCADE,
#         blank=True,
#         null=True,
#     )
