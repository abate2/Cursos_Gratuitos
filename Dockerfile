# Usa una imagen base que incluya Python y utilidades básicas
FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067

# Configura el directorio de trabajo dentro del contenedor
WORKDIR /app

# --- INSTALACIÓN EXPLÍCITA DE NODE.JS Y NPM ---
RUN apt-get update && apt-get install -y curl gnupg && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# --- INSTALACIÓN EXPLÍCITA DE PIP PARA PYTHON Y ENTORNO VIRTUAL ---
RUN apt-get install -y python3-pip python3-venv

# Copia todos tus archivos del repositorio al contenedor
COPY . /app

# --- FORZAR RECONSTRUCCIÓN DE LA CACHÉ PARA DIAGNÓSTICOS ---
# ¡CAMBIA ESTE VALOR A UNO NUEVO CADA VEZ QUE QUIERAS FORZAR UNA RECONSTRUCCIÓN!
ARG CACHE_BUSTER=20250824_0045_v4 

# --- FASE DE CONSTRUCCIÓN DE REACT (Frontend) ---
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps
RUN npm run build
RUN echo "--- DIAGNÓSTICO: CONTENIDO DE frontend/build después de npm run build ---" && \
    ls -la /app/frontend/build && \
    echo "--- CONTENIDO DE index.html EN frontend/build ---" && \
    cat /app/frontend/build/index.html || echo "Error al leer index.html en frontend/build" && \
    echo "--- FIN DIAGNÓSTICO DE BUILD DE FRONTEND ---"

# Vuelve al directorio raíz de la aplicación (donde está manage.py)
WORKDIR /app

# --- FASE DE CONSTRUCCIÓN DE DJANGO (Backend) ---
RUN python3 -m venv venv
RUN . venv/bin/activate && pip install -r requirements.txt

# Ejecuta collectstatic para recolectar los archivos estáticos de Django y React.
RUN . venv/bin/activate && python manage.py collectstatic --noinput

# --- DIAGNÓSTICO DEFINITIVO POST-COLLECTSTATIC ---
RUN echo "--- INICIO DIAGNÓSTICO: CONTENIDO RECURSIVO DE STATIC_ROOT (/app/staticfiles) ---" && \
    ls -laR /app/staticfiles && \
    echo "--- FIN DIAGNÓSTICO DE STATIC_ROOT ---" && \
    echo "--- INICIO DIAGNÓSTICO: BUSCANDO ARCHIVOS 'index' EN TODO STATIC_ROOT ---" && \
    find /app/staticfiles -name "index*" -ls && \
    echo "--- FIN DIAGNÓSTICO DE BUSQUEDA DE index ---" && \
    echo "--- INTENTANDO CAT /app/staticfiles/index.html ---" && \
    cat /app/staticfiles/index.html || echo "Error: /app/staticfiles/index.html no encontrado." && \
    echo "--- FIN DE PRUEBA DE CAT ---"

# Ejecuta las migraciones de la base de datos para configurar el esquema.
RUN . venv/bin/activate && python manage.py migrate

# --- COMANDO DE INICIO DE LA APLICACIÓN ---
CMD ["/bin/bash", "-c", ". venv/bin/activate && gunicorn core.wsgi:application --bind 0.0.0.0:$PORT"]
