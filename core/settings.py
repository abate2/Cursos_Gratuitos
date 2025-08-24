import os
from pathlib import Path
import dj_database_url # Importa dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-m#+5x=w3z8y9e@&h-m7#b7q-@p+n5n#k4p_z+0y!*q_w_f-d9#') 

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG_VALUE', 'True') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
# RENDER_EXTERNAL_HOSTNAME se añade automáticamente a ALLOWED_HOSTS en Render
# Por seguridad, no añadimos 'localhost' ni '127.0.0.1' si DEBUG es False
if DEBUG:
    ALLOWED_HOSTS += ['127.0.0.1', 'localhost']


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
    'whitenoise.middleware.WhiteNoiseMiddleware', 
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

WSGI_APPLICATION = 'core.wsgi.application' 


# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    DATABASES['default'] = dj_database_url.config(default=DATABASE_URL, conn_max_age=600)


# Password validation
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
LANGUAGE_CODE = 'es-es' 
TIME_ZONE = 'America/Bogota' 
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles' 
STATICFILES_DIRS = [
    # ¡IMPORTANTE! Para el despliegue de backend solamente, esta lista puede estar vacía
    # o solo contener directorios de 'static' de apps de Django si las tienes.
    # NO debe apuntar a la carpeta 'build' del frontend.
]

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media' 


# Default primary key field type
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
# CORS_ALLOW_ALL_ORIGINS = True es bueno para desarrollo, pero en producción es mejor ser específico.
# Una vez que tu frontend esté desplegado en Vercel/Netlify, DESCOMENTA y usa CORS_ALLOWED_ORIGINS
# con la URL de tu frontend.
CORS_ALLOW_ALL_ORIGINS = True # <-- Temporalmente amplio para que el backend funcione.
# CORS_ALLOWED_ORIGINS = [
#     'https://tu-frontend-vercel-url.vercel.app', # Cuando tengas la URL de tu frontend
# ]


# --- CONFIGURACIÓN PARA RENDER ---
CSRF_TRUSTED_ORIGINS = [
    'https://cursos-django-backend.onrender.com',
    # ¡IMPORTANTE! Una vez que despliegues tu frontend, DEBES añadir su URL aquí.
    # Ejemplo: 'https://tu-frontend-vercel-url.vercel.app',
]

# --- CONFIGURACIÓN DE WHITENOISE PARA SINGLE PAGE APP (AHORA DESACTIVADA) ---
WHITENOISE_SINGLE_PAGE_APP = False # <-- ¡CAMBIO CLAVE: DESACTIVADO!

# --- CONFIGURACIÓN DE STORAGE PARA WHITENOISE ---
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}
