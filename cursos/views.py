# cursos/views.py
# 1. Importa las clases necesarias de Django REST Framework. Para qué sirve: DRF trae vistas 
# pre-hechas llamadas generic views que ya incluyen funciones comunes como listar, crear, actualizar 
# o borrar datos, para que no tengas que escribir todo desde cero.
from rest_framework import generics
# 2. Importa tus modelos y el serializador que acabas de crear.
from .models import Curso
from .serializers import CursoSerializer

# 3. Define una clase 'CursoListView'.
#    'generics.ListAPIView' es una vista "genérica" de DRF que te da la funcionalidad
#    de listar todos los objetos de un modelo con muy poco código.
#    basicamente devolvera un listado de todos los  cursos
#    Hay otras  configuraciones ya predefinidas como para filtrar y etc 
#    en caso de  que se  requiera de esa forma. 

class CursoListView(generics.ListAPIView): 
    # 4. 'queryset' le dice a la vista qué datos debe buscar en la base de datos.
    queryset = Curso.objects.all() # <-- 'Curso.objects.all()' significa que traiga TODOS los cursos.
    # 5. 'serializer_class' le dice a la vista qué traductor usar para esos datos.
    serializer_class = CursoSerializer # <-- Usa el traductor 'CursoSerializer' que definiste.

