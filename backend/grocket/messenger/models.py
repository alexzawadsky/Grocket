from django.contrib.auth import get_user_model
from django.db import models

from products.models import Product

User = get_user_model()


class Chat(models.Model):
    user_from = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="user_from_chats",
    )
    user_to = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="user_to_chats",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        related_name="chats",
    )

    class Meta:
        ordering = ("-id",)
        verbose_name = "chat"
        verbose_name_plural = "chats"

    def __str__(self):
        return f"{self.id} to:{self.user_to} from:{self.user_from}"


class Message(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="messenger",
    )
    answer_to = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        related_name="replies",
        blank=True,
        null=True,
    )
    chat = models.ForeignKey(
        "Chat",
        on_delete=models.CASCADE,
        related_name="messages",
    )
    text = models.CharField(
        max_length=1000,
        blank=True,
        null=True,
    )
    image = models.ImageField(
        verbose_name="image",
        upload_to="messages/%Y-%m-%d/",
        blank=True,
    )
    pub_date = models.DateTimeField(
        verbose_name="pub date",
        auto_now_add=True,
        db_index=True,
    )
    is_edited = models.BooleanField(default=False)
    is_seen = models.BooleanField(default=False)

    class Meta:
        ordering = ("-pub_date",)
        verbose_name = "message"
        verbose_name_plural = "messages"

    def __str__(self):
        return f"{self.id} chat:{self.chat.id}"
