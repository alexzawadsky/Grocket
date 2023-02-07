from django.contrib.auth.models import AbstractUser
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


class User(AbstractUser):
    first_name = models.CharField(
        verbose_name='name',
        max_length=150,
    )
    last_name = models.CharField(
        verbose_name='last name',
        max_length=150,
    )
    email = models.EmailField(
        verbose_name='email',
        max_length=254,
        unique=True,
    )
    phone = PhoneNumberField(
        verbose_name='phone',
        blank=True,
        unique=True,
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ('first_name', 'last_name', 'email',)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-id']
