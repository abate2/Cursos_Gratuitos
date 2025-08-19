# cursos/admin.py
from django.contrib import admin
from .models import Curso, Leccion, Flashcard # Asegúrate de importar Flashcard

# Registra tus modelos aquí.
admin.site.register(Curso)
admin.site.register(Leccion)
admin.site.register(Flashcard) # <-- ¡Añade esto!
