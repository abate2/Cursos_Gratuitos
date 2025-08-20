from django.contrib import admin
from .models import Curso, Leccion, Flashcard, QuizQuestion, QuizOption

# Inline para opciones de Quiz dentro de QuizQuestion (DEFINICIÓN A NIVEL SUPERIOR)
# Esta clase será referenciada por QuizQuestionAdmin y por QuizQuestionInline.
class QuizOptionInline(admin.TabularInline):
    model = QuizOption
    extra = 4 # Muestra 4 campos de opción vacíos por defecto.
    fk_name = 'question' 

# Inline para Preguntas de Quiz dentro de Leccion (AHORA INCLUYE SUS PROPIAS OPCIONES)
# ¡IMPORTANTE! Cambiado a StackedInline para probar la renderización
class QuizQuestionInline(admin.StackedInline): # <-- ¡CAMBIO AQUÍ!
    model = QuizQuestion
    # Aquí es donde incluimos las opciones para que aparezcan al añadir/editar preguntas desde la lección.
    inlines = [QuizOptionInline] # <-- REFERENCIA A LA CLASE DE ARRIBA
    extra = 1

# Inline para Flashcards dentro de Leccion
class FlashcardInline(admin.TabularInline):
    model = Flashcard
    extra = 1

# Registro del modelo QuizQuestion con su inline (para gestión directa de preguntas)
class QuizQuestionAdmin(admin.ModelAdmin):
    # Este inlines es para cuando editas una pregunta de quiz directamente desde el menú "Quiz questions" en el admin.
    inlines = [QuizOptionInline] # <-- REFERENCIA A LA CLASE DE ARRIBA
    list_display = ('question_text', 'leccion')
    search_fields = ('question_text',)
    list_filter = ('leccion',)

# Registro del modelo Leccion con sus inlines
@admin.register(Leccion)
class LeccionAdmin(admin.ModelAdmin):
    # Aquí es donde LeccionAdmin usa QuizQuestionInline (que ahora incluye sus opciones).
    inlines = [FlashcardInline, QuizQuestionInline] 
    list_display = ('titulo', 'curso', 'orden')
    list_filter = ('curso',)
    search_fields = ('titulo', 'contenido_texto')

# Registra los modelos restantes con el panel de administración de Django.
admin.site.register(Curso)
admin.site.register(Flashcard)
admin.site.register(QuizQuestion, QuizQuestionAdmin)
