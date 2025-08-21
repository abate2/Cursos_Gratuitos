        import os
        from pathlib import Path
        import dj_database_url # Importa dj_database_url

        # Build paths inside the project like this: BASE_DIR / 'subdir'.
        BASE_DIR = Path(__file__).resolve().parent.parent

        # Quick-start development settings - unsuitable for production
        # See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

        # IMPORTANT: KEEP THIS SECRET IN PRODUCTION.
        # Use an environment variable for SECRET_KEY
        # In Railway, we will set SECRET_KEY as an environment variable.
        SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-tu_clave_secreta_local_muy_larga_y_aleatoria')


        # SECURITY WARNING: don't run with debug turned on in production!
        # DEBUG will be False in production.
        DEBUG = os.environ.get('DEBUG_VALUE', 'True') == 'True'


        # Allow the Railway host. Your Railway URL will be something like "your-app-name.up.railway.app"
        ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
        if DEBUG:
            ALLOWED_HOSTS += ['127.0.0.1', 'localhost'] # For local development


        # Application definition

        INSTALLED_APPS = [
            'django.contrib.admin',
            'django.contrib.auth',
            'django.contrib.contenttypes',
            'django.contrib.sessions',
            'django.contrib.messages',
            'django.contrib.staticfiles',
            'rest_framework', # For REST APIs
            'corsheaders', # For CORS
            'cursos', # Your courses app
            'ckeditor', # For CKEditor
            'ckeditor_uploader', # For uploading images in CKEditor
        ]

        MIDDLEWARE = [
            'django.middleware.security.SecurityMiddleware',
            'whitenoise.middleware.WhiteNoiseMiddleware', # Add WhiteNoise to serve static files
            'django.contrib.sessions.middleware.SessionMiddleware',
            'corsheaders.middleware.CorsMiddleware', # Add CORS
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
                'DIRS': [BASE_DIR / 'templates'], # If you have Django HTML templates
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

        # Database configuration for production (Railway)
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }

        # The DATABASE_URL environment variable will be set by Railway.
        # If it exists, we use it; otherwise, we use local SQLite.
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

        LANGUAGE_CODE = 'es-es' # You can change it to 'es-es' if you wish

        TIME_ZONE = 'America/Bogota' # Or your preferred time zone

        USE_I18N = True

        USE_TZ = True


        # Static files (CSS, JavaScript, Images)
        # https://docs.djangoproject.com/en/5.0/howto/static-files/

        # Static file configuration for development and production
        STATIC_URL = 'static/'
        STATIC_ROOT = BASE_DIR / 'staticfiles' # Directory where collectstatic will collect files
        STATICFILES_DIRS = [
            BASE_DIR / 'static',
            # Path to your compiled React frontend static files
            BASE_DIR / 'frontend' / 'build' / 'static',
        ]

        # WhiteNoise configuration to serve compressed and cached static files
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
        CKEDITOR_UPLOAD_PATH = "uploads/" # Directory where images will be uploaded

        # Default primary key field type
        # https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

        DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

        # CORS Settings
        CORS_ALLOW_ALL_ORIGINS = True # This is for development. In production, you should be more restrictive.
        # CORS_ALLOWED_ORIGINS = [
        #     "https://your-frontend-railway-url.up.railway.app", # If your React frontend is on a separate Railway service
        # ]
        