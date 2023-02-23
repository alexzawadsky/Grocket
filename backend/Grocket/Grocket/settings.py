import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv('../../infra/.env')

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
    'django_filters',
    'djoser',
    'rest_framework.authtoken',
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


# SQLITE3 DB:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# POSTGRES DB:
# DATABASES = {
#     'default': {
#         'ENGINE': os.getenv('DB_ENGINE'),
#         'NAME': os.getenv('DB_NAME'),
#         'USER': os.getenv('POSTGRES_USER'),
#         'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
#         'HOST': os.getenv('DB_HOST'),
#         'PORT': os.getenv('DB_PORT')
#     }
# }


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

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


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
}

SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('Bearer',),
}

DJOSER = {
    'SET_PASSWORD_RETYPE': True,
    'USER_CREATE_PASSWORD_RETYPE': True,
    'HIDE_USERS': False,
    'USER_ID_FIELD': 'pk',
    # 'LOGIN_FIELD': 'email',
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


AVATAR = {
    'COLORS': [
        'fbf8cc',
        'fde4cf',
        'ffcfd2',
        'f1c0e8',
        'cfbaf0',
        'a3c4f3',
        '90dbf4',
        '8eecf5',
        '98f5e1',
        'b9fbc0',
    ],
    'SIZE': (500, 500),
    'FONT': 'fonts/arial_black.ttf',
    'FONT_SIZE': 200,
    'FONT_INDENTS': (100, 100),
    'FONT_FILL': '#1C0606',
}

APPEND_SLASH = False