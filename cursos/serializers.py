# cursos/serializers.py
from rest_framework import serializers
from .models import Curso, Leccion, Flashcard

class LeccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leccion
        fields = '__all__' # Expone todos los campos del modelo Leccion

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ['id', 'palabra', 'significado', 'ejemplo', 'leccion']

class CursoSerializer(serializers.ModelSerializer):
    # ¡CAMBIO CLAVE AQUÍ! Ahora 'lecciones' usará LeccionSerializer para mostrar todos sus detalles
    lecciones = LeccionSerializer(many=True, read_only=True) 

    class Meta:
        model = Curso
        fields = '__all__'