# cursos/views.py
from rest_framework import generics
from rest_framework.response import Response 

from .models import Curso, Leccion, Flashcard
from .serializers import CursoSerializer, LeccionSerializer, FlashcardSerializer


class CursoListCreate(generics.ListCreateAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

class CursoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

class LeccionListCreate(generics.ListCreateAPIView):
    queryset = Leccion.objects.all()
    serializer_class = LeccionSerializer

class LeccionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Leccion.objects.all()
    serializer_class = LeccionSerializer

class LeccionFlashcardsList(generics.ListAPIView):
    serializer_class = FlashcardSerializer

    def get_queryset(self):
        leccion_id = self.kwargs['pk']
        return Flashcard.objects.filter(leccion__id=leccion_id)

# --- Nueva Vista para listar TODAS las Flashcards ---
class FlashcardList(generics.ListAPIView):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer

