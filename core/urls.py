from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls), # Ruta para el panel de administración de Django
    path('api/', include('cursos.urls')), # Incluye las rutas de tu app 'cursos' bajo '/api/'
    path('ckeditor/', include('ckeditor_uploader.urls')), # Ruta necesaria para CKEditor
    # ¡IMPORTANTE! Eliminamos las rutas explícitas de TemplateView para el index.html
    # La configuración WHITENOISE_SINGLE_PAGE_APP = True en settings.py
    # hará que Whitenoise sirva automáticamente el index.html para todas las demás rutas.
]

# Esto es CRUCIAL para servir archivos de medios (como imágenes subidas con CKEditor)
# y archivos estáticos en modo de desarrollo (DEBUG = True).
# NO USES ESTO EN PRODUCCIÓN, se maneja de forma diferente por Whitenoise.
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
