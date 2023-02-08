from django.contrib.auth.models import AbstractUser
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django_countries.fields import CountryField


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

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ('first_name', 'last_name', 'email',)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-id']
