#!/usr/bin/env bash
# Script de construcción para Render

set -o errexit  # Sale si hay error

# Instalar dependencias de Python
pip install --upgrade pip
pip install -r requirements.txt

# Compilar archivos estáticos de React
cd frontend
npm install
npm run build
cd ..

# Recolectar archivos estáticos de Django
python manage.py collectstatic --no-input

# Aplicar migraciones de base de datos
python manage.py migrate

# Crear superusuario automáticamente si DJANGO_SUPERUSER_USERNAME está definido
if [ -n "$DJANGO_SUPERUSER_USERNAME" ]; then
  python manage.py createsuperuser --noinput || true
fi
