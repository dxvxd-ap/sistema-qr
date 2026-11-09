# Registro de Asistencia mediante Código QR
**Universidad Tecnológica de Gutiérrez Zamora**  
**División de Tecnologías de la Información**  
**Cuatrimestre 10 - Unidad 2: Operación con QR**  

---

## 1. Guía de Inicio Rápido

El proyecto consta de dos partes:
* **backend-qr**: API REST desarrollada en Laravel con autenticación por tokens (Sanctum), control de transacciones y base de datos MySQL (XAMPP).
* **app-qr**: Aplicación móvil desarrollada en Ionic con Angular (NgModules) y Capacitor para Android y Web.

---

## 2. Reglas de Negocio y Control de la API

La aplicación móvil captura el código con la cámara nativa, pero la validación y autorización se procesan en el backend:

1. **Autenticación requerida:** Solo alumnos autenticados con token Bearer pueden enviar registros (HTTP 401 si no está autenticado).
2. **Validación de rol:** Solo usuarios con rol `alumno` pueden registrar asistencia. Si un docente intenta escanear, el servidor responde HTTP 403 ("Alumno fuera del grupo").
3. **Formato del código:** El contenido del código QR debe contener la sesión, grupo y marca de tiempo válidos. De lo contrario, responde HTTP 404 ("Sesión no encontrada").
4. **Control de vigencia:** El código QR expira después de 10 minutos desde su generación. Si se escanea después de ese tiempo, responde HTTP 410 ("QR vencido").
5. **Prevención de duplicidad:** Un alumno solo puede registrar una asistencia por sesión y fecha. Si intenta escanearlo de nuevo, responde HTTP 429 ("Asistencia ya registrada").
6. **Registro exitoso:** Si todas las comprobaciones son válidas, se almacena en la tabla `asistencias` y responde HTTP 201 ("Asistencia registrada").

---

## 3. Requisitos del Sistema

* PHP 8.2 o superior (con extensión pdo_mysql habilitada).
* Composer.
* Node.js (v18 o superior) y npm.
* XAMPP con servicios Apache y MySQL en ejecución.
* Android Studio (para compilar y ejecutar en dispositivo físico).

---

## 4. Instalación y Configuración

### Backend (Laravel)

1. Abrir una terminal y ubicarse en la carpeta del backend:
   ```bash
   cd backend-qr
   ```

2. Instalar dependencias de PHP:
   ```bash
   composer install
   ```

3. Verificar las credenciales de conexión en el archivo `.env`:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=app_qr
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. Generar la clave de la aplicación y ejecutar migraciones con seeders:
   ```bash
   php artisan key:generate
   php artisan migrate:fresh --seed
   ```

5. Iniciar el servidor local permitiendo conexiones desde la red:
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

---

### Frontend (Ionic / Angular)

1. Abrir otra terminal y ubicarse en la carpeta del frontend:
   ```bash
   cd app-qr
   ```

2. Instalar dependencias de Node:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Compilar el proyecto:
   ```bash
   npm run build
   ```

4. Ejecución:
   * **Modo Web:**
     ```bash
     ionic serve
     ```
   * **Modo Android (Dispositivo Físico):**
     ```bash
     npx cap sync android
     npx cap open android
     ```
     En Android Studio, seleccionar el dispositivo conectado por depuración USB y hacer clic en **Run**.

---

## 5. Cuentas de Acceso

| Rol | Correo | Contraseña | Uso en la Aplicación |
| :--- | :--- | :--- | :--- |
| **Docente** | `docente@utgz.edu.mx` | `password123` | Generación del código QR en tiempo real y consulta del panel de asistencias con filtros de búsqueda. |
| **Alumno 1** | `david@utgz.edu.mx` | `password123` | Escaneo de código QR mediante cámara nativa e historial de asistencias personales. |
| **Alumno 2** | `maria@utgz.edu.mx` | `password123` | Cuenta secundaria para probar concurrencia y validación de duplicados. |

---

## 6. Endpoints de la API

### Autenticación
* **`POST /api/login`**
  * `200 OK`: Retorna token Bearer e información del usuario.
  * `422 Unprocessable Entity`: Credenciales no válidas.

### Registro de Asistencia
* **`POST /api/asistencias/qr`**
  * Parámetros: `{ "code": "<datos_qr>" }` o `{ "codigo_qr": "<datos_qr>" }`
  * Headers: `Authorization: Bearer <token>`
  * `201 Created`: Asistencia registrada correctamente.
  * `401 Unauthorized`: Falta de token de autenticación.
  * `403 Forbidden`: Usuario no autorizado (rol diferente a alumno).
  * `404 Not Found`: Formato de código o sesión inexistente.
  * `410 Gone`: Código QR vencido (más de 10 minutos de antigüedad).
  * `429 Too Many Requests`: Asistencia duplicada para la misma sesión y fecha.

### Consulta de Asistencias (Panel)
* **`GET /api/asistencias`**
  * Headers: `Authorization: Bearer <token>`
  * `200 OK`: Lista de registros con relación del usuario asociado.
  * Parámetros de filtro opcionales:
    * `?sesion=`: Filtro por nombre o número de sesión.
    * `?grupo=`: Filtro por grupo.
    * `?alumno=`: Búsqueda por nombre o correo del alumno.
