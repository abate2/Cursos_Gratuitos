# Usa una imagen base que incluya Python y utilidades básicas
FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067

# Configura el directorio de trabajo dentro del contenedor
WORKDIR /app

# --- INSTALACIÓN EXPLÍCITA DE PIP PARA PYTHON Y ENTORNO VIRTUAL ---
# Instala python3-venv para poder crear entornos virtuales.
RUN apt-get update && apt-get install -y python3-pip python3-venv && rm -rf /var/lib/apt/lists/*

# Copia todos tus archivos del repositorio al contenedor
COPY . /app

# --- FASE DE CONSTRUCCIÓN DE DJANGO (Backend) ---
# Crea un entorno virtual de Python llamado 'venv'
RUN python3 -m venv venv

# Activa el entorno virtual y luego instala las dependencias de Python.
RUN . venv/bin/activate && pip install -r requirements.txt

# Ejecuta collectstatic para recolectar los archivos estáticos de Django (admin, ckeditor, etc.).
RUN . venv/bin/activate && python manage.py collectstatic --noinput

# Ejecuta las migraciones de la base de datos para configurar el esquema.
RUN . venv/bin/activate && python manage.py migrate

# --- COMANDO DE INICIO DE LA APLICACIÓN ---
# Define el comando que se ejecutará cuando el contenedor se inicie.
CMD ["/bin/bash", "-c", ". venv/bin/activate && gunicorn core.wsgi:application --bind 0.0.0.0:$PORT"]
