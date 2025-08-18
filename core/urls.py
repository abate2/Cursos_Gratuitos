"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# core/urls.py Importa el módulo del panel de administración 
# de Django, que viene integrado y permite gestionar la base 
# de datos a través de /admin/.
from django.contrib import admin
from django.urls import path, include # <-- Asegúrate de importar 'include'
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
#Esto crea la ruta /admin/ que carga la interfaz de administración de Django.
#admin.site.urls es un conjunto de rutas internas que Django trae 
#por defecto para el panel. 
#Include indica que use las rutas especificadas en cursos.urls 
#con el fin de hacer las rutas  mas  ordenadas   
    path('admin/', admin.site.urls),
    path('api/', include('cursos.urls')), # <-- Esto incluye todas las rutas de la app 'cursos' en la dirección '/api/'
    path('ckeditor/', include('ckeditor_uploader.urls')), # <--- ¡Añade esto!
]

# Necesario para servir archivos estáticos y archivos subidos en modo de desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)