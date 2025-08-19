# cursos/models.py
from django.db import models
from ckeditor.fields import RichTextField

class Curso(models.Model):
    titulo = models.CharField(max_length=200)
    instructor = models.CharField(max_length=100)
    descripcion_corta = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    imagen_portada = models.ImageField(upload_to='portadas/', null=True, blank=True)

    def __str__(self):
        return self.titulo

class Leccion(models.Model):
    titulo = models.CharField(max_length=200)
    contenido_texto = RichTextField()  # El campo que permite formato
    orden = models.IntegerField(default=1)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='lecciones')
    ejercicio_interactivo = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['orden']  # Ordena las lecciones por su número

    def __str__(self):
        return f'{self.orden}. {self.titulo}'

# --- Nuevo Modelo para las Flashcards ---
class Flashcard(models.Model):
    # La palabra en el idioma que estás enseñando (ej. inglés)
    palabra = models.CharField(max_length=100)
    # La traducción o significado (ej. español)
    significado = models.TextField()
    # Opcional: Un ejemplo de uso de la palabra
    ejemplo = models.TextField(blank=True, null=True)
    # Opcional: Relacionar la flashcard con una lección específica
    leccion = models.ForeignKey(Leccion, on_delete=models.CASCADE, related_name='flashcards', null=True, blank=True)

    def __str__(self):
        return f'{self.palabra} - {self.significado}'

    class Meta:
        verbose_name = "Flashcard"
        verbose_name_plural = "Flashcards"
