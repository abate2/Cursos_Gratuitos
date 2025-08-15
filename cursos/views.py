# cursos/views.py
from rest_framework import generics
from .models import Curso, Leccion
from .serializers import CursoSerializer, LeccionSerializer

class CursoListView(generics.ListAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

# This class must be present and correctly named
class CursoDetailView(generics.RetrieveAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer