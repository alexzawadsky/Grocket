from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.db import models
from django.utils import timezone
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField


class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        email = self.normalize_email(email)
        user = User(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        assert extra_fields["is_staff"]
        assert extra_fields["is_superuser"]
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
    )
    first_name = models.CharField(
        verbose_name="name",
        max_length=150,
    )
    last_name = models.CharField(
        verbose_name="last name",
        max_length=150,
    )
    email = models.EmailField(
        verbose_name="email",
        max_length=254,
        unique=True,
    )
    phone = PhoneNumberField(
        verbose_name="phone",
        blank=True,
        unique=True,
    )
    country = CountryField(default="US")
    is_staff = models.BooleanField(verbose_name="staff status", default=False)
    is_active = models.BooleanField(verbose_name="active", default=True)
    date_joined = models.DateTimeField(verbose_name="date joined", default=timezone.now)

    objects = CustomUserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = (
        "first_name",
        "last_name",
        "phone",
    )

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-id"]

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = "%s %s" % (self.first_name, self.last_name)
        return full_name.strip()
