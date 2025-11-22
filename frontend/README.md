# 🩺 Gestión de Turnos Médicos

Aplicación web profesional para la gestión de turnos médicos e historias clínicas.  
Incluye **backend (API REST)**, **frontend (React + Vite)** y **base de datos MySQL**.

---

## 📂 Estructura del proyecto
- `/backend` → API REST con Node.js + Express
- `/frontend` → Interfaz web con React + Vite
- `/DB` → Scripts y documentación de la base de datos MySQL

---

## 🚀 Tecnologías
- **Backend**: Node.js + Express, Sequelize + MySQL, JWT + bcrypt
- **Frontend**: React + Vite
- **Arquitectura**: Modular y escalable

---

## 📦 Instalación

### 1. Clonar el repositorio

### 2. Backend
- cd backend
- npm install

### 3. Frontend # React + Vite
- cd backend
- npm install

▶️ Ejecución
Backend
  node server.js
Frontend
  npm run dev

⚙️ Variables de entorno
En la carpeta backend crear un archivo .env basado en el ejemplo:
PORT=3001
  DB_HOST=localhost
  DB_USER=
  DB_PASSWORD=
  DB_NAME=gestion_turnos
  JWT_SECRET=tu_clave_unica_aqui

⚠️ Importante:
- Cada desarrollador debe generar su propia clave única para JWT_SECRET.
- Ejemplo para generar una clave segura en Node.js:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

🗄️ Base de Datos
La base de datos utilizada es MySQL.
Nombre: gestion_turnos
Requisitos
- MySQL 8.x
- Usuario con permisos de creación de base de datos
  
Instalación
- Crear la base de datos:
CREATE DATABASE gestion_turnos;

- Importar el esquema:
mysql -u root -p gestion_turnos < DB/schema.sql

- (Opcional) Importar datos iniciales:
mysql -u root -p gestion_turnos < DB/seed.sql

Configuración del backend
El backend se conecta a la base de datos mediante las variables de entorno definidas en .env.
🔒 Seguridad
- No subir nunca el valor real de JWT_SECRET al repositorio.
- Cambiar la contraseña por defecto del usuario root.
- Usar un usuario dedicado con permisos limitados en producción.
- Mantener el .env fuera del control de versiones (añadirlo a .gitignore).

📌 Notas
- El MVP inicial incluye gestión de pacientes y turnos.
- El frontend se ejecuta en Vite y consume la API del backend.
- La arquitectura está pensada para escalar y añadir nuevos módulos (roles, historias clínicas, reportes).
