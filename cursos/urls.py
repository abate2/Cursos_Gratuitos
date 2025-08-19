# cursos/urls.py
from django.urls import path
from .views import (
    CursoListCreate, 
    CursoDetail, 
    LeccionListCreate, 
    LeccionDetail, 
    LeccionFlashcardsList,
    FlashcardList # <-- ¡Importa la nueva vista!
)

urlpatterns = [
    # Rutas para Cursos
    path('cursos/', CursoListCreate.as_view(), name='curso-list'),
    path('cursos/<int:pk>/', CursoDetail.as_view(), name='curso-detail'),
    
    # Rutas para Lecciones
    path('lecciones/', LeccionListCreate.as_view(), name='leccion-list'),
    path('lecciones/<int:pk>/', LeccionDetail.as_view(), name='leccion-detail'),
    
    # Ruta para las Flashcards de una lección específica
    path('lecciones/<int:pk>/flashcards/', LeccionFlashcardsList.as_view(), name='leccion-flashcards-list'),

    # --- Nueva Ruta para TODAS las Flashcards ---
    path('flashcards/', FlashcardList.as_view(), name='flashcard-list'), 
]
