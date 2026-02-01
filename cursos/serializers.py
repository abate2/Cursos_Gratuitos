from rest_framework import serializers
from .models import Curso, Leccion, Flashcard, QuizQuestion, QuizOption # Importa todos los modelos necesarios

# Serializador para el modelo Flashcard
# Define cómo los campos de una Flashcard serán convertidos a/desde JSON.
class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = '__all__' # Incluye todos los campos del modelo Flashcard (id, palabra, significado, ejemplo, leccion)

# Serializador para el modelo Leccion
# Incluye un campo anidado 'flashcards' para que al serializar una lección, también se incluyan sus flashcards relacionadas.
class LeccionSerializer(serializers.ModelSerializer):
    flashcards = FlashcardSerializer(many=True, read_only=True) # 'many=True' porque una lección puede tener varias flashcards.

    class Meta:
        model = Leccion
        fields = '__all__' # Incluye todos los campos del modelo Leccion

# Serializador para el modelo Curso
# Incluye un campo anidado 'lecciones' para que al serializar un curso, se incluyan sus lecciones relacionadas.
class CursoSerializer(serializers.ModelSerializer):
    lecciones = LeccionSerializer(many=True, read_only=True) # 'many=True' porque un curso puede tener varias lecciones.

    class Meta:
        model = Curso
        fields = '__all__' # Incluye todos los campos del modelo Curso

# --- SERIALIZADORES PARA EL MINI-CUESTIONARIO ---

# Serializador para el modelo QuizOption
# Define los campos para las opciones de respuesta del quiz.
class QuizOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ['id', 'option_text', 'is_correct'] # Exponemos si la opción es correcta para la lógica en el frontend.

# Serializador para el modelo QuizQuestion
# Incluye un campo anidado 'options' para que al serializar una pregunta, también se incluyan sus opciones de respuesta.
class QuizQuestionSerializer(serializers.ModelSerializer):
    options = QuizOptionSerializer(many=True, read_only=True) # 'many=True' porque una pregunta tiene varias opciones.

    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'options'] # Exponemos el texto de la pregunta y sus opciones.

