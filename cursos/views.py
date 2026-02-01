from rest_framework import generics
# Importa los modelos que vas a usar en tus vistas
from .models import Curso, Leccion, Flashcard, QuizQuestion 
# Importa los serializadores que convierten los objetos de Django a JSON y viceversa
from .serializers import CursoSerializer, LeccionSerializer, FlashcardSerializer, QuizQuestionSerializer 

# Vista para listar todos los cursos (GET) y crear nuevos cursos (POST)
class CursoList(generics.ListAPIView): # Cambiado a ListAPIView para solo listar
    queryset = Curso.objects.all() # Define el conjunto de objetos que esta vista manejará
    serializer_class = CursoSerializer # El serializador que se usará para convertir los datos

# Vista para ver el detalle de un curso específico, actualizarlo o eliminarlo
class CursoDetail(generics.RetrieveAPIView): # Cambiado a RetrieveAPIView para solo detalle
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

# Vista para listar todas las lecciones (GET) y crear nuevas lecciones (POST)
class LeccionList(generics.ListAPIView): # Cambiado a ListAPIView para solo listar
    queryset = Leccion.objects.all()
    serializer_class = LeccionSerializer

# Vista para ver el detalle de una lección específica, actualizarla o eliminarla
class LeccionDetail(generics.RetrieveAPIView): # Cambiado a RetrieveAPIView para solo detalle
    queryset = Leccion.objects.all()
    serializer_class = LeccionSerializer

# Vista para listar flashcards de una lección específica
# Filtra las flashcards basándose en el 'leccion_id' pasado en la URL
class LeccionFlashcardsList(generics.ListAPIView):
    serializer_class = FlashcardSerializer

    def get_queryset(self):
        leccion_id = self.kwargs['leccion_id'] # Obtiene el ID de la lección de los argumentos de la URL
        return Flashcard.objects.filter(leccion_id=leccion_id) # Filtra las flashcards por el ID de la lección

# Vista para listar TODAS las flashcards (usada para el juego de memorizar general)
class FlashcardList(generics.ListAPIView):
    queryset = Flashcard.objects.all() # Obtiene todas las flashcards sin filtrar
    serializer_class = FlashcardSerializer

# --- NUEVA VISTA PARA EL MINI-CUESTIONARIO ---
# Vista para listar las preguntas de quiz de una lección específica
# Filtra las preguntas del quiz basándose en el 'leccion_id' pasado en la URL
class LeccionQuizQuestionsList(generics.ListAPIView):
    serializer_class = QuizQuestionSerializer

    def get_queryset(self):
        leccion_id = self.kwargs['leccion_id'] # Obtiene el ID de la lección de los argumentos de la URL
        return QuizQuestion.objects.filter(leccion_id=leccion_id) # Filtra las preguntas por el ID de la lección
