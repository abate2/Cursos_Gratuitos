from django.db import models
from ckeditor.fields import RichTextField # Importa RichTextField para el editor CKEditor

# Modelo para Cursos
class Curso(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    imagen_url = models.URLField(max_length=200, blank=True, null=True) # Campo para URL de imagen

    def __str__(self):
        return self.titulo

# Modelo para Lecciones
class Leccion(models.Model):
    curso = models.ForeignKey(Curso, related_name='lecciones', on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    contenido_texto = RichTextField() # Usamos RichTextField para permitir contenido HTML enriquecido con CKEditor
    orden = models.IntegerField(default=0) # Para el orden de las lecciones

    class Meta:
        ordering = ['orden'] # Asegura que las lecciones se muestren en orden

    def __str__(self):
        return f"{self.curso.titulo} - {self.titulo}"

# Modelo para Flashcards (vocabulario)
class Flashcard(models.Model):
    # La relación con Leccion es opcional, ya que el juego principal usa todas las flashcards
    # Si la lección se elimina, la flashcard puede quedar, pero su campo 'leccion' será NULL
    leccion = models.ForeignKey(Leccion, related_name='flashcards', on_delete=models.SET_NULL, null=True, blank=True)
    palabra = models.CharField(max_length=255)
    significado = models.TextField()
    ejemplo = models.TextField(blank=True, null=True) # Ejemplo de uso, opcional

    def __str__(self):
        return f"{self.palabra} - {self.significado[:50]}..." # Muestra los primeros 50 caracteres del significado

# --- NUEVOS MODELOS PARA EL MINI-CUESTIONARIO ---

# Modelo para Preguntas del Cuestionario
# Cada pregunta está asociada a una lección específica
class QuizQuestion(models.Model):
    leccion = models.ForeignKey(Leccion, related_name='quiz_questions', on_delete=models.CASCADE)
    question_text = models.TextField() # El texto completo de la pregunta

    def __str__(self):
        return f"Pregunta para {self.leccion.titulo}: {self.question_text[:50]}..."

# Modelo para Opciones de Respuesta de una Pregunta
# Cada opción está asociada a una pregunta de quiz y puede ser marcada como correcta o no
class QuizOption(models.Model):
    question = models.ForeignKey(QuizQuestion, related_name='options', on_delete=models.CASCADE)
    option_text = models.CharField(max_length=255) # El texto de la opción de respuesta
    is_correct = models.BooleanField(default=False) # Indica si esta opción es la respuesta correcta

    def __str__(self):
        return f"Opción: {self.option_text} (Correcta: {self.is_correct})"

