# Mini Gestor de Tareas - Docker Setup

Esta aplicación está completamente configurada para funcionar con Docker y Docker Compose.

## Requisitos

- Docker Desktop instalado

## Arquitectura

La aplicación consiste en 4 servicios:

1. **MySQL Database** (`db`) - Base de datos en el puerto 3307
2. **Laravel Backend** (`app`) - API REST con PHP-FPM
3. **Nginx Backend Proxy** (`nginx`) - Servidor web para el backend en el puerto 8000
4. **React Frontend** (`frontend`) - Aplicación React con Nginx en el puerto 5173

## URLs de Acceso

- **Frontend (React)**: http://localhost:5173
- **Backend (Laravel API)**: http://localhost:8000
- **Base de Datos**: localhost:3307 (MySQL)

## Instrucciones de Uso

### 1. Clonar el repositorio

```
git clone https://github.com/RANDRESS23/mini-gestor-de-tareas.git
cd mini-gestor-de-tareas
```

### 2. Iniciar todos los servicios

```
docker compose up -d --build
```

### 3. Esperar a que los servicios estén listos

Los servicios tardarán unos minutos en iniciarse completamente. Puedes verificar el estado con:

```
docker ps
```

### 4. Ejecutar migraciones

```
docker exec -it laravel_app bash
php artisan migrate
```

### 5. Verificar que todo funciona

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Configuración de la Base de Datos

- **Database**: tasks_db
- **Username**: user
- **Password**: pass
- **Host**: db (interno de Docker)
- **External Access**: localhost:3307

Las migraciones se ejecutan automáticamente durante la construcción del contenedor.

## Estructura de Archivos Importantes

- `docker-compose.yml` - Orquestación de todos los servicios
- `backend/Dockerfile` - Configuración del contenedor Laravel
- `frontend/Dockerfile` - Configuración del contenedor React
- `backend/.env.docker` - Variables de entorno específicas para Docker
- `nginx.conf` - Configuración de Nginx para el backend
- `frontend/nginx.frontend.conf` - Configuración de Nginx para el frontend

## Notas Técnicas

- El backend utiliza variables de entorno del docker-compose, no el archivo .env local
- Los datos de la base de datos persisten en un volumen Docker
- Los contenedores están optimizados para producción
- El frontend sirve archivos estáticos compilados a través de Nginx
