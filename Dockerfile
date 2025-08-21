# Usa una imagen base que incluya Python y utilidades básicas
FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067

# Configura el directorio de trabajo dentro del contenedor
WORKDIR /app

# --- INSTALACIÓN EXPLÍCITA DE NODE.JS Y NPM ---
# Actualiza los paquetes del sistema e instala 'curl' y 'gnupg'
# necesarios para añadir el repositorio de NodeSource.
RUN apt-get update && apt-get install -y curl gnupg && rm -rf /var/lib/apt/lists/*

# Descarga y ejecuta el script de instalación de NodeSource para Node.js v20 (LTS).
# Esto añade el repositorio de Node.js a tu sistema.
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Instala Node.js (que incluye npm) desde el repositorio recién añadido.
RUN apt-get install -y nodejs

# --- INSTALACIÓN EXPLÍCITA DE PIP PARA PYTHON Y ENTORNO VIRTUAL ---
# Instala python3-venv para poder crear entornos virtuales.
RUN apt-get install -y python3-pip python3-venv

# Copia todos tus archivos del repositorio al contenedor
COPY . /app

# --- FASE DE CONSTRUCCIÓN DE REACT (Frontend) ---
# Navega a la carpeta del frontend
WORKDIR /app/frontend

# Instala las dependencias de Node.js.
# --legacy-peer-deps puede ser útil para resolver problemas de compatibilidad de versiones.
RUN npm install --legacy-peer-deps

# Compila la aplicación React para producción.
RUN npm run build

# Vuelve al directorio raíz de la aplicación (donde está manage.py)
WORKDIR /app

# --- FASE DE CONSTRUCCIÓN DE DJANGO (Backend) ---
# Crea un entorno virtual de Python llamado 'venv'
RUN python3 -m venv venv

# Activa el entorno virtual y luego instala las dependencias de Python.
# Aseguramos que los comandos se ejecuten dentro del entorno virtual.
RUN . venv/bin/activate && pip install -r requirements.txt # <-- ¡LÍNEAS CORREGIDAS AQUÍ!

# Ejecuta collectstatic para recolectar los archivos estáticos de Django y React.
# Asegúrate de que este comando también se ejecute dentro del entorno virtual.
RUN . venv/bin/activate && python manage.py collectstatic --noinput

# Ejecuta las migraciones de la base de datos para configurar el esquema.
# Asegúrate de que este comando también se ejecute dentro del entorno virtual.
RUN . venv/bin/activate && python manage.py migrate

# --- COMANDO DE INICIO DE LA APLICACIÓN ---
# Define el comando que se ejecutará cuando el contenedor se inicie.
# El comando CMD debe activar el entorno virtual para ejecutar gunicorn.
CMD ["/bin/bash", "-c", ". venv/bin/activate && gunicorn core.wsgi:application --bind 0.0.0.0:$PORT"]
