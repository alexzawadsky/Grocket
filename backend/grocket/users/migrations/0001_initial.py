# Generated by Django 4.1.7 on 2023-04-06 17:09

import django.utils.timezone
import django_countries.fields
import phonenumber_field.modelfields
from django.db import migrations, models

import users.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('avatar', models.ImageField(blank=True, upload_to='avatars/')),
                ('first_name', models.CharField(max_length=150, verbose_name='name')),
                ('last_name', models.CharField(max_length=150, verbose_name='last name')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='email')),
                ('phone', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, region=None, unique=True, verbose_name='phone')),
                ('country', django_countries.fields.CountryField(default='US', max_length=2)),
                ('is_staff', models.BooleanField(default=False, verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'User',
                'verbose_name_plural': 'Users',
                'ordering': ['-id'],
            },
            managers=[
                ('objects', users.models.CustomUserManager()),
            ],
        ),
    ]