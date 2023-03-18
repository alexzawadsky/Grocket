import os
from datetime import timedelta
from pathlib import Path

from django.utils.translation import gettext_lazy as _
from dotenv import load_dotenv

load_dotenv('../../infra/.env')

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = (
    'django-insecure-ixh5=+g%x22o)3f58^+tm$#%dz)gf_cy7+m&_8_7j#%mh9vhuu'
)

DEBUG = True

ALLOWED_HOSTS = ['*']


INSTALLED_APPS = [
    'modeltranslation',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_dump_load_utf8',
    'phonenumber_field',
    'djmoney',
    'django_countries',
    'mptt',
    'django_mptt_admin',
    'rest_framework',
    'django_filters',
    'djoser',
    'rest_framework.authtoken',

    'users',
    'products',
    'comments',
    'core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Grocket.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Grocket.wsgi.application'


AUTH_USER_MODEL = 'users.User'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
    # 'default': {
    #     'ENGINE': os.getenv('DB_ENGINE'),
    #     'NAME': os.getenv('DB_NAME'),
    #     'USER': os.getenv('POSTGRES_USER'),
    #     'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
    #     'HOST': os.getenv('DB_HOST'),
    #     'PORT': os.getenv('DB_PORT')
    # }
}


AUTH_PASSWORD_VALIDATORS = []  # В конце добавить валидаторы!!!


# <--- Локализация --->
LANGUAGES = [
    ('en', _('English')),
    ('ru', _('Russian')),
    ('nl', _('Dutch')),
]

LOCALE_PATHS = [
    BASE_DIR / 'locale',
]

MODELTRANSLATION_DEFAULT_LANGUAGE = 'en'

LANGUAGE_CODE = 'en'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True
# <--- Локализация --->

# <--- Настройка путей --->
DATA_URL = '/data/'
DATA_ROOT = os.path.join(BASE_DIR, 'data')

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

CSV_URL = 'data/csv'
# <--- Настройка путей --->


# Email бекенд
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
SITE_NAME = 'Grocket'

# API
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'api.paginators.PageLimitPagination',
    'PAGE_SIZE': 20,
    'EXCEPTION_HANDLER': 'rest_framework.views.exception_handler',
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '500/day',
        'user': '1000/day'
    }
}

# JWT токены
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=500),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=10),
    'UPDATE_LAST_LOGIN': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# User api
DJOSER = {
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': False,  # Это менять чтоб письмо отправлялось
    'SET_PASSWORD_RETYPE': True,
    'USER_CREATE_PASSWORD_RETYPE': True,
    'HIDE_USERS': False,
    'USER_ID_FIELD': 'pk',
    'USERNAME_FIELD': 'email',
    'PERMISSIONS': {
        'user': ['rest_framework.permissions.IsAuthenticated'],
    },
    'SERIALIZERS': {
        'user_create_password_retype': (
            'api.serializers.CustomUserCreateSerializer'
        ),
        'user': 'api.serializers.CustomUserSerializer',
        'current_user': 'api.serializers.CustomUserSerializer',
    },
}


# Обработка изображения аватарки
AVATAR = {
    'COLORS': [
        'fbf8cc', 'fde4cf', 'ffcfd2', 'f1c0e8', 'cfbaf0',
        '90dbf4', '8eecf5', '98f5e1', 'b9fbc0', 'a3c4f3',
    ],
    'SIZE': (500, 500),
    'FONT_URL': os.path.join(DATA_ROOT, 'fonts'),
    'FONT_FILE_NAME': 'arial_black.ttf',
    'FONT_SIZE': 200,
    'FONT_INDENTS': (100, 100),
    'FONT_FILL': '#1C0606',
}

# Обработка изображения товара и добавления вотермарки
PRODUCT_IMAGE = {
    'SIZE': (400, 400),
    'WATERMARK_INDENTS': (100, 100),
    'WATERMARK_URL': os.path.join(DATA_ROOT, 'img_templates'),
    'WATERMARK_FILE_NAME': 'watermark.png',
}

# # Список статусов комментариев
# COMMENT_STATUSES = [
#     _('Bought'),
#     _('Did not agree'),
#     _('Ignored'),
#     _('Other'),
# ]

# Брокер для Celery
CELERY_BROKER_URL = 'redis://localhost:6379'
CELERY_RESULT_BACKEND = 'redis://localhost:6379'
