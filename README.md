# 📋 Mini Gestor de Tareas - Docker Setup

Esta aplicación está completamente configurada para funcionar con Docker y Docker Compose.

## 📋 Requisitos

- Docker Desktop instalado

## 🏗️ Arquitectura

La aplicación consiste en 4 servicios:

1. **MySQL Database** (`db`) - Base de datos en el puerto 3307
2. **Laravel Backend** (`app`) - API REST con PHP-FPM
3. **Nginx Backend Proxy** (`nginx`) - Servidor web para el backend en el puerto 8000
4. **React Frontend** (`frontend`) - Aplicación React con Nginx en el puerto 5173

## 🌐 URLs de Acceso

- **Frontend (React)**: http://localhost:5173
- **Backend (Laravel API)**: http://localhost:8000
- **Base de Datos**: localhost:3307 (MySQL)

## 📚 Instrucciones de Uso

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
exit
```

### 5. Verificar que todo funciona

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## ⚙ Configuración de la Base de Datos

- **Database**: tasks_db
- **Username**: user
- **Password**: pass
- **Host**: db (interno de Docker)
- **External Access**: localhost:3307

## 📚 Estructura de Archivos Importantes

- `docker-compose.yml` - Orquestación de todos los servicios
- `backend/Dockerfile` - Configuración del contenedor Laravel
- `frontend/Dockerfile` - Configuración del contenedor React
- `backend/.env.docker` - Variables de entorno específicas para Docker
- `nginx.conf` - Configuración de Nginx para el backend
- `frontend/nginx.frontend.conf` - Configuración de Nginx para el frontend

## 📑 Notas Técnicas

- El backend utiliza variables de entorno del docker-compose, no el archivo .env local
- Los datos de la base de datos persisten en un volumen Docker
- Los contenedores están optimizados para producción
- El frontend sirve archivos estáticos compilados a través de Nginx

## 💻 Vistas de la App

### Login

<img width="1366" height="633" alt="image" src="https://github.com/user-attachments/assets/8eb9857c-7ae3-4b7d-a731-7dcac6b89a6a" />

### Register

<img width="1366" height="637" alt="image" src="https://github.com/user-attachments/assets/d9982fae-18a1-4e34-b82e-ed5567721857" />

### Tareas

<img width="1366" height="637" alt="image" src="https://github.com/user-attachments/assets/72047bbc-b1d1-4547-bb3f-e135c40fcdc3" />
<img width="1366" height="636" alt="image" src="https://github.com/user-attachments/assets/702d0472-35e7-4093-bf74-66172b8d696e" />

### Crear Tarea

<img width="1347" height="634" alt="image" src="https://github.com/user-attachments/assets/62d519aa-6371-4e27-b2af-b26dfb4445e7" />

### Editar Tarea

<img width="1348" height="637" alt="image" src="https://github.com/user-attachments/assets/5712a1fb-bcc0-4391-a9ec-be808f009dff" />
