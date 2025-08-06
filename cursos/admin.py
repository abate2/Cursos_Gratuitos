# cursos/admin.py
from django.contrib import admin
from .models import Curso, Leccion # Importa los modelos que acabas de crear.

# Registra tus modelos en el sitio de administración.
# Sin estas dos líneas, tus modelos no aparecerían en el panel.
admin.site.register(Curso)
admin.site.register(Leccion)

# Register your models here.
