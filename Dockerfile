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
# Instala las dependencias de Python desde requirements.txt
RUN python3 -m pip install -r requirements.txt 

# Ejecuta collectstatic para recolectar los archivos estáticos de Django y React.
# --noinput evita que pida confirmación.
RUN python manage.py collectstatic --noinput

# Ejecuta las migraciones de la base de datos para configurar el esquema.
RUN python manage.py migrate

# --- COMANDO DE INICIO DE LA APLICACIÓN ---
# Define el comando que se ejecutará cuando el contenedor se inicie.
# Inicia Gunicorn, enlazándolo a todas las interfaces en el puerto que Render asigna ($PORT).
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:$PORT"]
