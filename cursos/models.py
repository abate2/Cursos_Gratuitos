# cursos/models.py
from django.db import models

class Curso(models.Model):
    titulo = models.CharField(max_length=200)
    instructor = models.CharField(max_length=100)
    descripcion_corta = models.TextField()
    imagen_portada = models.ImageField(upload_to='cursos_portadas/', blank=True, null=True)

    def __str__(self):
        return self.titulo

class Leccion(models.Model):
    titulo = models.CharField(max_length=200)
    contenido_texto = models.TextField()
    ejercicio_interactivo = models.TextField(blank=True, null=True)
    orden = models.IntegerField()
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='lecciones')

    def __str__(self):
        return f"{self.orden}. {self.titulo} ({self.curso.titulo})"