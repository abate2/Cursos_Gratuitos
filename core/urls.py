from django.contrib import admin
from django.urls import path, include, re_path # ¡Asegúrate de importar re_path!
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView # ¡Asegúrate de importar TemplateView!

urlpatterns = [
    # Rutas de administración y API de Django
    path('admin/', admin.site.urls), 
    path('api/', include('cursos.urls')), # Incluye las rutas de tu app 'cursos' bajo '/api/'
    path('ckeditor/', include('ckeditor_uploader.urls')), # Ruta necesaria para CKEditor

    # --- ¡RUTAS CLAVE PARA SERVIR EL FRONTEND REACT! ---
    # 1. Ruta explícita para la raíz ('/')
    # Esto asegura que el index.html se sirva cuando alguien acceda a la URL base.
    path('', TemplateView.as_view(template_name='index.html'), name='root'), 
    
    # 2. Ruta "Catch-all" para el resto de las rutas del frontend React
    # Esto servirá el index.html para CUALQUIER otra ruta que no coincida con las anteriores.
    # ¡Debe ir ABSOLUTAMENTE AL FINAL de urlpatterns!
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='index.html')),
]

# Esto es CRUCIAL para servir archivos de medios (como imágenes subidas con CKEditor)
# y archivos estáticos en modo de desarrollo (DEBUG = True).
# NO USES ESTO EN PRODUCCIÓN, se maneja de forma diferente por Whitenoise.
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
