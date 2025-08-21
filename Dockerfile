    # Usa una imagen base de Railway/Nixpacks que incluya Python
    # FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067
    # CAMBIADO A UNA BASE MÁS GENÉRICA Y LUEGO INSTALAMOS NODE EXPLICITAMENTE
    FROM python:3.10-slim-buster # Una imagen ligera con Python 3.10

    # Instala herramientas necesarias para npm (curl, gnupg)
    RUN apt-get update && apt-get install -y curl gnupg && rm -rf /var/lib/apt/lists/*

    # Instala Node.js v20 (o superior, ajusta si es necesario)
    RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    RUN apt-get install -y nodejs

    # Configura el directorio de trabajo dentro del contenedor
    WORKDIR /app

    # Copia todos tus archivos del repositorio al contenedor
    COPY . /app

    # --- FASE DE CONSTRUCCIÓN DE REACT (Frontend) ---
    # Navega a la carpeta del frontend
    WORKDIR /app/frontend

    # Instala las dependencias de Node.js
    RUN npm install --legacy-peer-deps # Usar --legacy-peer-deps para evitar problemas de dependencias

    # Compila la aplicación React
    RUN npm run build

    # Vuelve al directorio raíz de la aplicación (donde está manage.py)
    WORKDIR /app

    # --- FASE DE CONSTRUCCIÓN DE DJANGO (Backend) ---
    # Instala las dependencias de Python desde requirements.txt
    RUN pip install -r requirements.txt

    # Ejecuta collectstatic para recolectar los archivos estáticos de Django y React
    # --noinput para que no pida confirmación
    RUN python manage.py collectstatic --noinput

    # Ejecuta las migraciones de la base de datos
    RUN python manage.py migrate

    # --- COMANDO DE INICIO DE LA APLICACIÓN ---
    # Define el comando que se ejecutará cuando el contenedor se inicie
    CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:$PORT"]
    