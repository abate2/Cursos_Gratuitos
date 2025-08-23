import os
from pathlib import Path
import dj_database_url # Importa dj_database_url
from whitenoise.storage import CompressedManifestStaticFilesStorage # Importa el storage de WhiteNoise

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-m#+5x=w3z8y9e@&h-m7#b7q-@p+n5n#k4p_z+0y!*q_w_f-d9#') 

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG_VALUE', 'True') == 'True' # Usa la variable de entorno para DEBUG

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',') # Usa la variable de entorno para ALLOWED_HOSTS
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
    'rest_framework',
    'corsheaders',
    'ckeditor', 
    'ckeditor_uploader', 
    'cursos', 
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Middleware de WhiteNoise DEBE IR DESPUÉS de SecurityMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware', 
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
        'DIRS': [BASE_DIR / 'staticfiles'], # ¡CRUCIAL! Para que Django encuentre index.html si TemplateView lo usa
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.messages', 
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application' 


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# La variable de entorno DATABASE_URL será establecida por Render.
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
        'NAME': 'django.contrib.auth.password_validation.NumericLengthValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'es-es' # Puedes cambiarlo a 'es-es' si lo deseas

TIME_ZONE = 'America/Bogota' # O tu zona horaria preferida

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles' 
STATICFILES_DIRS = [
    BASE_DIR / 'static',
    # ¡CAMBIO CLAVE AQUÍ! Incluimos la carpeta 'build' completa para que index.html sea recolectado.
    BASE_DIR / 'frontend' / 'build', 
]

# Configuración de WhiteNoise para servir archivos estáticos comprimidos y con caché
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
    "default": { # Asegúrate de tener un default si no usas un storage personalizado para medios
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
}

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media' 


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Configuración de CKEditor
CKEDITOR_UPLOAD_PATH = 'uploads/' 
CKEDITOR_CONFIGS = {
    'default': {
        'toolbar': 'full', 
        'height': 300,
        'width': '100%',
        'extraPlugins': 'codesnippet', 
        'filebrowserUploadUrl': '/ckeditor/upload/', 
        'filebrowserBrowseUrl': '/ckeditor/browse/', 
        'removePlugins': 'elementspath', 
        'resize_enabled': False, 
    },
}

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = True # Permite peticiones desde cualquier origen (para desarrollo/pruebas)

# Confía en el origen de tu aplicación desplegada en Render para las solicitudes CSRF.
# Es muy importante que uses la URL real de tu servicio en Render.
# La URL de tu servicio es: https://cursos-django-backend.onrender.com
CSRF_TRUSTED_ORIGINS = [
    'https://cursos-django-backend.onrender.com',
]

# --- CONFIGURACIONES DE SEGURIDAD CLAVE PARA PRODUCCIÓN (Render) ---
CSRF_COOKIE_SECURE = True 
SESSION_COOKIE_SECURE = True 
SECURE_SSL_REDIRECT = True 
SECURE_HSTS_SECONDS = 31536000 
SECURE_HSTS_INCLUDE_SUBDOMAINS = True 
SECURE_HSTS_PRELOAD = True 
SECURE_BROWSER_XSS_FILTER = True 
X_FRAME_OPTIONS = 'DENY' 

# ¡CONFIGURACIÓN CLAVE PARA PROXIES SSL COMO RENDER!
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True
# --- CONFIGURACIÓN DE WHITENOISE PARA SINGLE PAGE APP ---
WHITENOISE_SINGLE_PAGE_APP = True # <-- ¡ASEGÚRATE DE QUE ESTO ESTÉ EN TRUE!
