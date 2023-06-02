import os
from datetime import timedelta
from pathlib import Path

from django.utils.translation import gettext_lazy as _
from dotenv import load_dotenv

load_dotenv("../../infra/.env")

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-ixh5=+g%x22o)3f58^+tm$#%dz)gf_cy7+m&_8_7j#%mh9vhuu"

DEBUG = True

ALLOWED_HOSTS = ["*"]


INSTALLED_APPS = [
    "core",
    "modeltranslation",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_dump_load_utf8",
    "phonenumber_field",
    "django_countries",
    "mptt",
    "django_mptt_admin",
    "rest_framework",
    "django_filters",
    "djoser",
    "rest_framework.authtoken",
    "ckeditor",
    "django_bleach",
    "users",
    "products",
    "comments",
    "images",
    "payments",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "grocket.urls"


# <--- Настройка путей --->
DATA_URL = "/data/"
DATA_ROOT = os.path.join(BASE_DIR, "data")

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "core", "static"),
]
TEMPLATES_DIR = os.path.join(BASE_DIR, "core", "templates")

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

CSV_URL = "data/csv"
JSON_URL = "data/json"
# <--- Настройка путей --->


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [TEMPLATES_DIR],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "grocket.wsgi.application"


AUTH_USER_MODEL = "users.User"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

DATABASES = {
    # "default": {
    #     "ENGINE": "django.db.backends.sqlite3",
    #     "NAME": BASE_DIR / "db.sqlite3",
    # },
    "default": {
        "ENGINE": os.getenv("DB_ENGINE"),
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("POSTGRES_USER"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD"),
        "HOST": os.getenv("DB_HOST"),
        "PORT": os.getenv("DB_PORT"),
    }
}


# <--- Локализация --->
LANGUAGES = [
    ("en", "English"),
    ("ru", "Russian"),
    ("nl", "Dutch"),
    ("sv", "Swedish"),
    ("uk", "Ukranian"),
    ("it", "Italian"),
    ("fr", "French"),
    ("de", "Deuch"),
    ("zh-hans", "Chinese"),
    ("pl", "Polish"),
]

LOCALE_PATHS = [
    BASE_DIR / "data/locale/",
]

MODELTRANSLATION_DEFAULT_LANGUAGE = "en"

LANGUAGE_CODE = "en"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True
# <--- Локализация --->


# Email бекенд
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
SITE_NAME = "Grocket"

# API
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PAGINATION_CLASS": "api.paginators.PageLimitPagination",
    "PAGE_SIZE": 20,
    "EXCEPTION_HANDLER": "rest_framework.views.exception_handler",
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {"anon": "2000/day", "user": "5000/day"},
}

# JWT токены
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=10),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=31),
    "UPDATE_LAST_LOGIN": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# User api
DJOSER = {
    "ACTIVATION_URL": "activate/{uid}/{token}",
    "SEND_ACTIVATION_EMAIL": False,  # Это менять чтоб письмо отправлялось
    "SET_PASSWORD_RETYPE": False,
    "USER_CREATE_PASSWORD_RETYPE": True,
    "HIDE_USERS": False,
    "USER_ID_FIELD": "pk",
    "USERNAME_FIELD": "email",
    "PERMISSIONS": {
        "user": ["rest_framework.permissions.IsAuthenticated"],
    },
    "SERIALIZERS": {
        "user_create_password_retype": (
            "api.users.serializers.CustomUserCreateSerializer"
        ),
        "user": "api.users.serializers.CustomUserSerializer",
        "current_user": "api.users.serializers.CustomUserSerializer",
    },
}


# <--- Работа с каринками --->

# Обработка изображения аватарки
AVATAR = {
    "COLORS": [
        "#fca5a5",
        "#fdba74",
        "#fcd34d",
        "#bef264",
        "#86efac",
        "#5eead4",
        "#67e8f9",
        "#7dd3fc",
        "#93c5fd",
        "#a5b4fc",
        "#c4b5fd",
        "#f0abfc",
        "#f9a8d4",
        "#fda4af",
    ],
    "SIZE": (500, 500),
    "FONT_URL": os.path.join(DATA_ROOT, "fonts"),
    "FONT_FILE_NAME": "arial_black.ttf",
    "FONT_SIZE": 200,
    # "FONT_INDENTS": (100, 100),
    "FONT_FILL": "#1C0606",
}

# Добавления вотермарки
WATERMARK = {
    "WATERMARK_INDENTS": (100, 100),
    "WATERMARK_URL": os.path.join(DATA_ROOT, "img_templates"),
    "WATERMARK_FILE_NAME": "watermark.png",
    "FORMAT": "WEBP",  # Большими буквами; ФОРМАТ КАРТИНКИ, А НЕ ВОТЕРМАРКИ
}

# Основная обработка картинок
BASE_IMAGE_SETTINGS = {
    "SIZE": (700, 700),
    "FORMAT": "WEBP",  # Большими буквами
}

# <--- Работа с каринками --->


# Брокер для Celery
CELERY_BROKER_URL = "redis://localhost:6379"
CELERY_RESULT_BACKEND = "redis://localhost:6379"


# HTML поле для товаров и валидация
BLEACH_DEFAULT_WIDGET = "wysiwyg.widgets.WysiwygWidget"
CKEDITOR_CONFIGS = {
    "default": {
        "toolbar_Basic": [["Source", "-", "Bold", "Italic"]],
        "toolbar_YourCustomToolbarConfig": [
            {"name": "document", "items": ["Source", "Preview"]},
            {"name": "clipboard", "items": ["Undo", "Redo"]},
            {"name": "editing", "items": ["Find", "Replace"]},
            {"name": "tools", "items": ["Maximize", "ShowBlocks"]},
            "/",
            {"name": "basicstyles", "items": ["Bold", "Italic", "Underline", "Strike"]},
        ],
        "toolbar": "YourCustomToolbarConfig",
        "tabSpaces": 4,
        "extraPlugins": ",".join(
            [
                "div",
                "autolink",
                "autoembed",
                "embedsemantic",
                "autogrow",
                "widget",
                "lineutils",
                "clipboard",
                "dialog",
                "dialogui",
                "elementspath",
            ]
        ),
    }
}


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "console": {"format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"},
        "file": {"format": "%(asctime)s %(name)-12s %(levelname)-8s %(message)s"},
    },
    "handlers": {
        # "console": {"class": "logging.StreamHandler", "formatter": "console"},
        "file": {
            "level": "DEBUG",
            "class": "logging.FileHandler",
            "formatter": "file",
            "filename": "logs.log",
        },
    },
    "loggers": {"": {"level": "DEBUG", "handlers": ["file"]}},
}


EXCHANGE = {
    "REDIS": {
        "host": os.getenv("REDIS_HOST", "localhost"),
        "port": os.getenv("REDIS_PORT", 6379),
        "db": os.getenv("REDIS_DB", 0),
    },
    "EXPIRE_TIME": 10,  # в секундах
    "CURRENCIES": ("rub", "eur", "bmd"),
}

STRIPE_PUBLIC_KEY = os.getenv("STRIPE_PUBLIC_KEY")
STRIPE_PRIVATE_KEY = os.getenv("STRIPE_PRIVATE_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

RATES = {
    "USD": 1,
    "EUR": 0.9,
    "RUB": 82,
    "UAH": 36,
    "GBP": 0.8,
    "SEK": 10,
    "KZT": 454,
    "TRY": 19,
    "GEL": 2.5,
    "INR": 82,
    "ILS": 3.6,
    "AED": 3.7,
    "KRW": 1340,
    "CNY": 7,
}
