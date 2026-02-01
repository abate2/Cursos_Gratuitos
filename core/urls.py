# mi-plataforma-cursos/core/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls), # Ruta para el panel de administración de Django
    path('api/', include('cursos.urls')), # Incluye las rutas de tu app 'cursos' bajo '/api/'
    path('ckeditor/', include('ckeditor_uploader.urls')), # ¡Ruta necesaria para CKEditor!
]

# Esto es CRUCIAL para servir archivos de medios (como imágenes subidas con CKEditor)
# y archivos estáticos en modo de desarrollo (DEBUG = True).
# NO USES ESTO EN PRODUCCIÓN, se maneja de forma diferente.
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

