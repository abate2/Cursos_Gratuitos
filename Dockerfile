# Usa una imagen base que incluya Python y Node.js
# Esta imagen es adecuada para Railway y Nixpacks
FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067 # <-- ¡LÍNEA CORREGIDA AQUÍ!

# Configura el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia todos tus archivos del repositorio al contenedor
COPY . /app

# --- FASE DE CONSTRUCCIÓN DE REACT (Frontend) ---
# Navega a la carpeta del frontend
WORKDIR /app/frontend

# Instala las dependencias de Node.js
RUN npm install

# Compila la aplicación React
RUN npm run build

# Vuelve al directorio raíz de la aplicación (donde está manage.py)
WORKDIR /app

# --- FASE DE CONSTRUCCIÓN DE DJANGO (Backend) ---
# Instala las dependencias de Python desde requirements.txt
# Esto asegurará que gunicorn, dj-database-url, psycopg2-binary, etc., se instalen
RUN pip install -r requirements.txt

# Ejecuta collectstatic para recolectar los archivos estáticos de Django y React
RUN python manage.py collectstatic --noinput

# Ejecuta las migraciones de la base de datos
# Esto se hará en el momento de la construcción. Si prefieres que se haga al iniciar el contenedor,
# deberías moverlo al Start Command, pero para simplificar, lo hacemos aquí.
RUN python manage.py migrate

# --- COMANDO DE INICIO DE LA APLICACIÓN ---
# Define el comando que se ejecutará cuando el contenedor se inicie
# Este es tu Start Command, ejecutando Gunicorn
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:$PORT"]
