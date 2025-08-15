# cursos/serializers.py
# 1. Importa 'serializers' desde la librería de REST Framework.
from rest_framework import serializers
# 2. Importa los modelos que creaste para los cursos y lecciones.
from .models import Curso, Leccion

# 5. Creamos otro serializador para el modelo de Leccion.
class LeccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leccion
        fields = '__all__'
# 3. Crea una clase llamada 'CursoSerializer'. El nombre debe ser descriptivo.
#    'serializers.ModelSerializer' es el "molde" que convierte un modelo de Django a JSON.
class CursoSerializer(serializers.ModelSerializer):
    # 4. En la clase 'Meta', le dices al serializador qué modelo debe usar y qué campos debe traducir.
    # NUEVO CAMPO: Agrega este campo para incluir la lista de lecciones del curso.
    # 'many=True' le dice que es una lista de objetos.
    lecciones = LeccionSerializer(many=True, read_only=True)

    class Meta:
        model = Curso # <-- El modelo que va a convertir
        fields = '__all__' # <-- 'fields = '__all__'' significa que traduzca TODOS los campos del modelo

