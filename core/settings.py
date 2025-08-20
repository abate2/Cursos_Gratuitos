import os
from pathlib import Path
import dj_database_url # Importa dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# IMPORTANTE: MANTÉN ESTO SECRETO EN PRODUCCIÓN.
# Usar una variable de entorno para SECRET_KEY
# En Railway, estableceremos SECRET_KEY como una variable de entorno.
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-tu_clave_secreta_local_muy_larga_y_aleatoria')


# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG será False en producción.
DEBUG = os.environ.get('DEBUG_VALUE', 'True') == 'True'


# Permite el host de Render. Tu URL de Railway será algo como "tu-app-name.up.railway.app"
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
if DEBUG:
    ALLOWED_HOSTS += ['127.0.0.1', 'localhost'] # Para desarrollo local


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework', # Para las APIs REST
    'corsheaders', # Para CORS
    'cursos', # Tu aplicación de cursos
    'ckeditor', # Para CKEditor
    'ckeditor_uploader', # Para subir imágenes en CKEditor
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Añadir WhiteNoise para servir estáticos
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', # Añadir CORS
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'], # Si tienes plantillas HTML de Django
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

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

# Configuración de la base de datos para producción (Railway)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# La variable de entorno DATABASE_URL será establecida por Railway.
# Si existe, la usamos; de lo contrario, usamos SQLite local.
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    DATABASES['default'] = dj_database_url.config(default=DATABASE_URL, conn_max_age=600)


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

LANGUAGE_CODE = 'es-es' # Puedes cambiarlo a 'es-es' si lo deseas

TIME_ZONE = 'America/Bogota' # O tu zona horaria preferida

USE_I17N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

# Configuración de archivos estáticos para desarrollo y producción
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles' # Directorio donde collectstatic recolectará los archivos
STATICFILES_DIRS = [
    BASE_DIR / 'static',
    # Ruta a los archivos estáticos de tu frontend React compilado
    BASE_DIR / 'frontend' / 'build' / 'static',
]

# Configuración de WhiteNoise para servir archivos estáticos comprimidos y con caché
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}


# CKEditor Settings
CKEDITOR_BASEPATH = "/static/ckeditor/ckeditor/"
CKEDITOR_UPLOAD_PATH = "uploads/" # Directorio donde se subirán las imágenes

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = True # Esto es para desarrollo. En producción, deberías ser más restrictivo.
# CORS_ALLOWED_ORIGINS = [
#     "https://tu-frontend-railway-url.up.railway.app", # Si tu frontend React está en un servicio separado de Railway
# ]
