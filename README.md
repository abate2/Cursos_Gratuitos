# 📚 Cursos Gratuitos - Plataforma de Aprendizaje

Una plataforma full-stack para crear y gestionar cursos online con lecciones interactivas, cuestionarios y juegos de memoria.

## 🎯 Características

- ✅ **Dashboard Admin**: Crear cursos, lecciones y cuestionarios
- ✅ **Frontend Responsivo**: Interfaz con React
- ✅ **API REST**: Construida con Django Rest Framework
- ✅ **Base de Datos**: PostgreSQL en producción
- ✅ **Editor Rich-Text**: CKEditor para contenido de lecciones
- ✅ **Cuestionarios Interactivos**: Mini-quiz por lección
- ✅ **Juego de Memoria**: Actividad complementaria
- ✅ **Despliegue en la Nube**: Preparado para Render

## 🛠️ Tech Stack

### Backend
- **Django 5.2** - Framework web
- **Django Rest Framework** - API REST
- **PostgreSQL** - Base de datos
- **Gunicorn** - Servidor WSGI

### Frontend
- **React 18** - UI
- **React Router** - Navegación
- **CSS3** - Estilos

### DevOps
- **Render** - Hosting cloud
- **WhiteNoise** - Servir archivos estáticos
- **GitHub** - Control de versiones

## 🚀 Inicio Rápido

### Instalación Local

1. **Clonar repositorio**
```bash
git clone https://github.com/tu-usuario/Cursos_Gratuitos.git
cd Cursos_Gratuitos
```

2. **Backend (Python)**
```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver
```

3. **Frontend (Node.js)**
```bash
cd frontend
npm install
npm start
```

La app estará disponible en:
- Frontend: http://localhost:3000
- Admin: http://localhost:8000/admin
- API: http://localhost:8000/api

---

## 📦 Despliegue en Render

Para desplegar la aplicación en la nube (gratis), sigue la guía completa:

**👉 [Leer DESPLIEGUE_RENDER.md](./DESPLIEGUE_RENDER.md)**

### Resumen rápido:
1. Crea una BD PostgreSQL en Render
2. Crea un Web Service conectado a tu GitHub
3. Configura variables de entorno (SECRET_KEY, DATABASE_URL, etc.)
4. ¡Listo! Tu app estará en línea

---

## 📁 Estructura del Proyecto

```
├── core/                    # Configuración Django
│   ├── settings.py         # Config principal
│   ├── urls.py             # Rutas
│   └── wsgi.py             # Entrypoint
├── cursos/                  # App principal
│   ├── models.py           # Modelos (Curso, Lección, etc)
│   ├── serializers.py      # Serializadores API
│   ├── views.py            # Vistas REST
│   └── urls.py             # Rutas API
├── frontend/               # React app
│   ├── public/
│   └── src/
│       ├── App.js          # Componente principal
│       ├── CourseList.js   # Listado de cursos
│       ├── CourseDetail.js # Detalle del curso
│       └── ...
├── build.sh                # Script de construcción
├── requirements.txt        # Dependencias Python
├── manage.py               # CLI Django
└── DESPLIEGUE_RENDER.md    # Guía de despliegue
```

---

## 🔐 Seguridad

⚠️ **Importante**: 
- Nunca subas `.env` o `SECRET_KEY` a GitHub
- Usa variables de entorno en producción
- Mantén `DEBUG = False` en producción
- Cambiar contraseña de admin regularmente

Ver [DESPLIEGUE_RENDER.md](./DESPLIEGUE_RENDER.md) para más detalles de seguridad.

---

## 📖 API Endpoints

### Cursos
- `GET /api/cursos/` - Listar cursos
- `GET /api/cursos/{id}/` - Detalle del curso

### Lecciones
- `GET /api/lecciones/{id}/quiz_questions/` - Preguntas del quiz

### Flashcards (Juego de Memoria)
- `GET /api/flashcards/` - Obtener todas las tarjetas

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo licencia [MIT](./LICENSE)

---

## 💬 Soporte

¿Problemas con el despliegue? 
- Revisa [DESPLIEGUE_RENDER.md](./DESPLIEGUE_RENDER.md)
- Abre un issue en GitHub
- Verifica los logs en Render Dashboard

---

## 🎓 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Certificados al completar curso
- [ ] Sistema de puntuación
- [ ] Comentarios en lecciones
- [ ] Integración con Cloudinary para imágenes
- [ ] Tests automatizados

---

**Hecho con ❤️ para facilitar el aprendizaje en línea**
