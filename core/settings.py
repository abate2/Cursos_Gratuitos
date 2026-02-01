# mi-plataforma-cursos/core/settings.py

import os
import dj_database_url
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-m#+5x=w3z8y9e@&h-m7#b7q-@p+n5n#k4p_z+0y!*q_w_f-d9#' # ¡CAMBIA ESTO EN PRODUCCIÓN!

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'ckeditor', # ¡Importante para el editor!
    'ckeditor_uploader', # ¡Importante para subir imágenes en el editor!
    'cursos', # Tu aplicación 'cursos'
    # ... otras aplicaciones si las tienes
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # Middleware de CORS
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls' # ¡Asegúrate de que apunte a 'core.urls'!

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

WSGI_APPLICATION = 'core.wsgi.application' # ¡Asegúrate de que apunte a 'core.wsgi'!


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600
    )
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'es-es' # Cambiado a español
TIME_ZONE = 'America/Bogota' # Zona horaria de Bogotá (o la que prefieras)
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

# Configuración de archivos estáticos (CSS, JavaScript, imágenes que forman parte de tu aplicación)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles' # Directorio donde se recolectan los archivos estáticos en producción

# Configuración de archivos de medios (imágenes, videos subidos por los usuarios a través de CKEditor)
# Usado para servir archivos subidos
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media' # Directorio donde se guardarán los archivos subidos (ej. imágenes de CKEditor)


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configuración de CKEditor
CKEDITOR_UPLOAD_PATH = 'uploads/' # Los archivos subidos desde CKEditor se guardarán en media/uploads/
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full', # Esto habilita la barra de herramientas completa
        'height': 300,
        'width': '100%',
        'extraPlugins': 'codesnippet', # Si necesitas resaltar código (opcional, CKEditor 4 requiere plugin)
        'filebrowserUploadUrl': '/ckeditor/upload/', # URL a la que CKEditor subirá archivos
        'filebrowserBrowseUrl': '/ckeditor/browse/', # URL para navegar archivos en el servidor
        'removePlugins': 'elementspath', # Eliminar la barra de ruta de elementos en la parte inferior del editor
        'resize_enabled': False, # Desactivar redimensionamiento manual del editor
    },
}

# Configuración de CORS (si estás haciendo peticiones desde React a Django)
CORS_ALLOW_ALL_ORIGINS = True # Esto es solo para desarrollo. Para producción, sé más específico.
# Opcionalmente, para más seguridad en producción:
# CORS_ALLOWED_ORIGINS = [
#    "http://localhost:3000", # Tu frontend de React en desarrollo
#    "http://127.0.0.1:3000",
# ]

