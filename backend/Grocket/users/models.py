from django.contrib.auth.models import AbstractUser
from django.db import models
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField


class User(AbstractUser):
    '''Custom User model'''
    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
    )
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
    country = CountryField(default='US')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ('first_name', 'last_name', 'username', 'phone',)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-id']
