# Guía de Despliegue en Render - Cursos Gratuitos

Esta guía te ayudará a desplegar la aplicación Django + React en Render de forma segura y funcional.

## 📋 Requisitos Previos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Render](https://render.com)
- Tu código subido a un repositorio de GitHub (público o privado)

## 🚀 Paso 1: Preparar tu Repositorio Local

### 1.1 Verificar archivos críticos

Asegúrate de que tu proyecto tenga estos archivos en la raíz:

```
build.sh                 ✓ Script de construcción
requirements.txt         ✓ Dependencias Python
core/settings.py         ✓ Configuración Django
package.json             ✓ Dependencias Node.js
.gitignore               ✓ Archivos ignorados
```

### 1.2 Verificar `.gitignore`

Asegúrate de que **NUNCA** subas archivos sensibles:

```bash
# En .gitignore debe haber:
*.env
.env
.env.local
db.sqlite3
SECRET_KEY
```

**CRÍTICO**: Nunca subas tu `SECRET_KEY`, contraseñas o credenciales a GitHub.

### 1.3 Subir cambios a GitHub

```bash
git add .
git commit -m "Preparar para despliegue en Render"
git push origin main  # o tu rama principal
```

---

## 🌐 Paso 2: Crear Base de Datos PostgreSQL en Render

1. Ve a [https://dashboard.render.com/](https://dashboard.render.com/)
2. Click en **"New +"** → **"PostgreSQL"**
3. Configura:
   - **Name**: `cursos-db` (o el nombre que prefieras)
   - **Database**: `cursos`
   - **Region**: Elige la más cercana a ti
   - **Plan**: `Free` (incluye 90 días gratis)
4. Click en **"Create Database"**
5. **Importante**: Guarda la **Internal Database URL** (verás una pantalla con la URL)

---

## 🖥️ Paso 3: Crear Web Service (Backend Django)

1. Click en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name**: `cursos-backend` (o similar)
   - **Region**: Misma región que la BD
   - **Branch**: `main` (o tu rama principal)
   - **Root Directory**: Dejar vacío
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn core.wsgi:application`
   - **Plan**: `Free`

4. Click en **"Advanced"** (abajo)
5. Click en **"Add Environment Variable"** y agrega estas variables:

| Variable | Valor |
|----------|-------|
| `SECRET_KEY` | Genera una nueva clave [aquí](https://djecrety.ir/) |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `tu-dominio.onrender.com` |
| `DATABASE_URL` | Tu Internal Database URL de PostgreSQL |
| `DJANGO_SUPERUSER_USERNAME` | `admin` |
| `DJANGO_SUPERUSER_PASSWORD` | Contraseña fuerte propia |
| `DJANGO_SUPERUSER_EMAIL` | Tu email |

**⚠️ IMPORTANTE**:
- Generar `SECRET_KEY` nueva en https://djecrety.ir/
- Usar contraseña fuerte para superusuario
- NO compartir estas credenciales

6. Click en **"Create Web Service"**
7. Espera a que termine el build (5-10 minutos)

---

## ✅ Paso 4: Verificar el Despliegue

1. Una vez finalizado, tu app estará en: `https://tu-dominio.onrender.com`
2. Accede a `/admin/` para verificar que Django funciona
3. Login con las credenciales de superusuario que creaste
4. Verifica que los cursos se muestren en la página principal

---

## 📝 Paso 5: Agregar tu Dominio Personalizado (Opcional)

Si tienes un dominio propio:

1. En Render Dashboard → tu servicio → **Settings**
2. Desplázate a **Custom Domain**
3. Agrega tu dominio
4. Sigue las instrucciones DNS

---

## 🔍 Solución de Problemas Comunes

### Error: "Build failed"
- Verifica que `build.sh` tenga permisos ejecutables: `chmod +x build.sh`
- Revisa que todas las dependencias estén en `requirements.txt`
- Comprueba que `package.json` esté en la carpeta `frontend/`

### Error: "Bad Request (400)"
- Verifica que `ALLOWED_HOSTS` incluya tu dominio de Render
- Formato correcto: `mi-app.onrender.com` (sin https://)

### Error: "Static files not found"
- El build incluye `collectstatic` automáticamente
- Si persiste, verifica que `STATIC_ROOT` esté definido en `settings.py`

### No se muestran los cursos
- Verifica que `DATABASE_URL` esté correctamente configurada
- Comprueba que creaste cursos en el admin
- Abre la consola del navegador (F12) para ver errores de API

### Servicio "asleep" (demora al cargar)
- Es normal en el plan Free después de inactividad
- Primera petición puede tardar ~50 segundos
- Upgraar a plan pagado elimina este comportamiento

---

## 🔐 Mejores Prácticas de Seguridad

### ✅ HACER:
- Generar `SECRET_KEY` nueva para producción
- Usar variables de entorno para datos sensibles
- Mantener `DEBUG = False` en producción
- Usar HTTPS (Render lo hace automáticamente)
- Cambiar contraseña de superusuario regularmente

### ❌ NO HACER:
- Subir `.env` a GitHub
- Usar contraseñas débiles
- Compartir `SECRET_KEY` o credenciales
- Dejar `DEBUG = True` en producción
- Ignorar advertencias de seguridad

---

## 📚 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `build.sh` | Script que construye la app (npm, pip, migrations) |
| `requirements.txt` | Dependencias Python (Django, DRF, etc.) |
| `core/settings.py` | Configuración de Django (BD, CORS, etc.) |
| `core/urls.py` | Rutas principales (admin, api, frontend) |
| `frontend/package.json` | Dependencias Node.js (React, etc.) |
| `.gitignore` | Archivos que NO se suben a GitHub |

---

## 🆘 ¿Problemas?

1. Revisa los **Logs** en Render Dashboard (click en tu servicio → "Logs")
2. Busca el error específico en esta guía
3. Verifica que todas las variables de entorno estén configuradas
4. Comprueba que `build.sh` tenga formato Unix (no Windows)

---

## 🎉 ¡Listo!

Tu aplicación debería estar desplegada y funcionando. Para futuras actualizaciones:

```bash
git push origin main
# Render se redesplegará automáticamente
```

---

## 📖 Recursos Adicionales

- [Documentación de Render](https://render.com/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Generar SECRET_KEY segura](https://djecrety.ir/)
