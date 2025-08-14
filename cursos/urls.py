# cursos/urls.py
# 1. Importa 'path' para definir las rutas, 
# es  una  funcion  por  defecto  de django.
from django.urls import path
# 2. Importa la vista que acabas de crear en  views
# cambiara dependiendo de la vista que se quiera crear.
from .views import CursoListView

# 3. 'urlpatterns' es una lista de todas las rutas de tu aplicación.
urlpatterns = [
    # 4. Define una ruta. Cuando alguien vaya a esta URL, se ejecutará la vista.
    path('cursos/', CursoListView.as_view(), name='curso-list'),
]