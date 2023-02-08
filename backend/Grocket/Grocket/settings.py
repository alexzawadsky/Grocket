import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-ixh5=+g%x22o)3f58^+tm$#%dz)gf_cy7+m&_8_7j#%mh9vhuu'

DEBUG = True

ALLOWED_HOSTS = ['*']


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'phonenumber_field',
    'djmoney',
    'django_countries',
    'mptt',
    'django_mptt_admin',
    'rest_framework',
    'djoser',
    'users',
    'products',
    'core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
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


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


AUTH_PASSWORD_VALIDATORS = [
    # {
    #     'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    # },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    # },
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


STATIC_URL = '/static/'

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
   'AUTH_HEADER_TYPES': ('JWT',),
}

DJOSER = {
    'HIDE_USERS': False,
    'USER_ID_FIELD': 'pk',
    'LOGIN_FIELD': 'email',
    'USERNAME_FIELD': 'email',
    # 'PERMISSIONS': {
    #     'user_list': ['rest_framework.permissions.AllowAny'],
    #     'user': ['rest_framework.permissions.IsAuthenticated'],
    #     'user_delete': ['rest_framework.permissions.AllowAny'],
    # },
    'SERIALIZERS': {
        'user_create': 'api.serializers.CustomUserCreateSerializer',
    },
}


# ссылки:
#  -- Поле с деньгами
# https://github.com/django-money/django-money
#  -- Поле с телефоном
# https://django-phonenumber-field.readthedocs.io/en/latest/#
#  -- Поле с адресом (пока не работает)
# https://github.com/furious-luke/django-address
# -- Поле с несколькими фото
# https://medium.com/ibisdev/upload-multiple-images-to-a-model-with-django-fd00d8551a1c
# -- Поле со страной
# https://github.com/SmileyChris/django-countries#countryfield
# древовидгые категории
# https://tretyakov.net/post/drevovidnye-kategorii-v-django/
