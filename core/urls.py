from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
# No necesitamos importar TemplateView ni re_path si confiamos en WHITENOISE_SINGLE_PAGE_APP

urlpatterns = [
    path('admin/', admin.site.urls), # Ruta para el panel de administración de Django
    path('api/', include('cursos.urls')), # Incluye las rutas de tu app 'cursos' bajo '/api/'
    path('ckeditor/', include('ckeditor_uploader.urls')), # Ruta necesaria para CKEditor
    # La configuración WHITENOISE_SINGLE_PAGE_APP en settings.py se encargará de servir index.html
    # para todas las demás rutas no definidas aquí, actuando como un "catch-all" para tu SPA React.
    # Por lo tanto, no necesitamos un `path('', TemplateView...)` ni un `re_path` genérico explícito aquí.
]

# Esto es CRUCIAL para servir archivos de medios (como imágenes subidas con CKEditor)
# y archivos estáticos en modo de desarrollo (DEBUG = True).
# NO USES ESTO EN PRODUCCIÓN, se maneja de forma diferente por Whitenoise.
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

